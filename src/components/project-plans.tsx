"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { CONTENT_WIDTH, PLAN_STAGE, type ProjectImage } from "@/lib/projects";

/**
 * The drawings stage.
 * Figma: main frame node 156:1266, rail node 191:1697, Previous/Next 191:1700.
 *
 * Every drawing is one cell, and all of them live in a single absolutely
 * positioned stage. What changes when you pick a drawing is not which elements
 * exist but which slot each one occupies — the chosen drawing takes the main
 * slot and whatever was there falls back into the rail. Keeping one element
 * per drawing for the life of the component is what makes the swap animatable:
 * the same node is measured before the change and after it, so it can be sent
 * from the first rectangle to the last one.
 *
 * That is the FLIP part. On a click we record every cell's rectangle, let
 * React move them, then in a layout effect — before the browser paints —
 * measure again, apply the inverted difference as a transform so nothing
 * appears to have moved, and animate that transform away. The browser only
 * ever composites a translate and a scale, so a 1131px drawing and a 204px
 * thumbnail can trade places without either being laid out twice.
 */

/** Matches the wipe language used elsewhere on the site. */
const SWAP_MS = 560;
const SWAP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Below this the stage stops being a fixed drawing and simply stacks. */
const STACKED_BELOW = 900;

const pct = (value: number, of: number) =>
  `${((value / of) * 100).toFixed(4)}%`;

/**
 * A slot is carried entirely by custom properties rather than by left/top/
 * width/height, so the stacked rules in globals.css can still override it —
 * an inline style would outrank a media query.
 */
type Slot = React.CSSProperties & Record<`--slot-${string}`, string>;

/**
 * Where every slot sits on the 1360x636 stage.
 *
 * The rail is centred on its thumbnails rather than on itself: the design
 * hangs Previous/Next below the stack, and it is the stack that lines up with
 * the main frame. With four thumbnails this returns the drawn 66px top offset
 * and the 578px nav offset; with any other number it re-centres.
 */
function buildLayout(count: number) {
  const { width: W, height: H, main, thumb, nav } = PLAN_STAGE;
  const railCount = Math.max(count - 1, 0);
  const stackHeight =
    railCount * thumb.height + Math.max(railCount - 1, 0) * thumb.gap;
  const stackTop = (H - stackHeight) / 2;

  const slot = (x: number, y: number, w: number, h: number): Slot =>
    ({
      "--slot-x": pct(x, W),
      "--slot-y": pct(y, H),
      "--slot-w": pct(w, W),
      "--slot-h": pct(h, H),
    }) as Slot;

  return {
    main: slot(0, 0, main.width, main.height),
    rail: Array.from({ length: railCount }, (_, i) =>
      slot(
        thumb.x,
        stackTop + i * (thumb.height + thumb.gap),
        thumb.width,
        thumb.height,
      ),
    ),
    nav: slot(
      thumb.x,
      stackTop + stackHeight + thumb.gap,
      thumb.width,
      nav.height,
    ),
  };
}

/**
 * Drawings are loaded at the size of the main frame rather than the size of
 * the slot they happen to be in, so a swap never waits on a new file.
 */
const PLAN_SIZES = `(max-width: ${STACKED_BELOW}px) 100vw, calc((100vw - var(--site-gutter) * 2) * ${(
  PLAN_STAGE.main.width / CONTENT_WIDTH
).toFixed(4)})`;

export function ProjectPlans({ drawings }: { drawings: ProjectImage[] }) {
  const [active, setActive] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const cells = useRef(new Map<number, HTMLButtonElement>());
  /** Rectangles captured just before a swap; consumed by the layout effect. */
  const firstRects = useRef<Map<number, DOMRect> | null>(null);
  /** The two cells actually trading places, so they can travel over the rest. */
  const travelling = useRef<{ from: number; to: number } | null>(null);

  const layout = buildLayout(drawings.length);

  const show = (next: number) => {
    if (next === active || next < 0 || next >= drawings.length) return;

    const rects = new Map<number, DOMRect>();
    cells.current.forEach((node, index) =>
      rects.set(index, node.getBoundingClientRect()),
    );
    firstRects.current = rects;
    travelling.current = { from: active, to: next };
    setActive(next);
  };

  /** Previous and Next wrap, which is why the design draws neither disabled. */
  const step = (delta: number) =>
    show((active + delta + drawings.length) % drawings.length);

  useLayoutEffect(() => {
    const first = firstRects.current;
    firstRects.current = null;
    const pair = travelling.current;
    travelling.current = null;
    if (!first) return;

    const stage = stageRef.current;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof Element.prototype.animate !== "function"
    ) {
      return;
    }

    const running: Animation[] = [];

    cells.current.forEach((node, index) => {
      const before = first.get(index);
      if (!before) return;

      const after = node.getBoundingClientRect();
      if (!after.width || !before.width) return;

      const dx = before.left - after.left;
      const dy = before.top - after.top;
      const sx = before.width / after.width;
      const sy = before.height / after.height;

      // A cell that did not actually move is left alone, so the rail's
      // untouched thumbnails never get a pointless composited layer.
      const still =
        Math.abs(dx) < 0.5 &&
        Math.abs(dy) < 0.5 &&
        Math.abs(sx - 1) < 0.005 &&
        Math.abs(sy - 1) < 0.005;
      if (still) return;

      // The travellers cross the rail on their way, so they ride above it.
      if (pair && (index === pair.to || index === pair.from)) {
        node.style.zIndex = index === pair.to ? "3" : "2";
      }

      running.push(
        node.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
            { transform: "translate(0px, 0px) scale(1, 1)" },
          ],
          { duration: SWAP_MS, easing: SWAP_EASING },
        ),
      );
    });

    if (running.length === 0) return;

    // The 1px frame is scaled by the same transform as everything else, which
    // on the shrinking drawing would start as a 5px slab. It is hidden for the
    // flight and handed back at the end.
    stage?.setAttribute("data-swapping", "true");

    let cancelled = false;
    void Promise.allSettled(running.map((a) => a.finished)).then(() => {
      if (cancelled) return;
      stage?.removeAttribute("data-swapping");
      cells.current.forEach((node) => {
        node.style.zIndex = "";
      });
    });

    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <section className="ps-plans" aria-label="Drawings">
      <div ref={stageRef} className="ps-plan-stage">
        {drawings.map((drawing, index) => {
          const isActive = index === active;
          // Rank among the drawings not currently in the main frame, which is
          // the order the rail lists them in.
          const rank = index < active ? index : index - 1;

          return (
            <button
              key={index}
              ref={(node) => {
                if (node) cells.current.set(index, node);
                else cells.current.delete(index);
              }}
              type="button"
              className="ps-plan-cell"
              style={isActive ? layout.main : layout.rail[rank]}
              aria-current={isActive ? "true" : undefined}
              aria-label={isActive ? undefined : `Show ${drawing.alt}`}
              onClick={() => show(index)}
            >
              <Image
                src={drawing.src}
                alt={isActive ? drawing.alt : ""}
                fill
                sizes={PLAN_SIZES}
                className="object-cover"
                data-image-reveal
              />
            </button>
          );
        })}

        <div className="ps-plan-nav" style={layout.nav}>
          <button type="button" onClick={() => step(-1)}>
            Previous
          </button>
          <button type="button" onClick={() => step(1)}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
