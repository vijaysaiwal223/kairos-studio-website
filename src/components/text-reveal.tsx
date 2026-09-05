"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * Line-by-line text reveal for headings and body copy.
 *
 * Every heading and paragraph inside the wrapper is split into lines, each line
 * is given a clipping mask, and the lines rise out of those masks. Wrap a block
 * and everything prose-like inside it reveals together:
 *
 *     <TextReveal>
 *       <h2 className="...">Project Overview</h2>
 *       <p className="...">The site gives more than a plan can hold…</p>
 *     </TextReveal>
 *
 * The wrapper is a plain block, so this is invisible to layout.
 *
 * Two triggers, because a block's position on the page decides which one reads
 * as intentional:
 *
 * - "scroll" (the default) scrubs the reveal to the scroll position as the
 *   block crosses the viewport, the way the design services scatter and the
 *   featured-projects wipe already do.
 * - "load" plays it once, shortly after the page settles. For copy already on
 *   screen when the page opens — scrubbing a hero would leave it blank until
 *   the reader happened to scroll, which is worse than no reveal at all.
 *
 * Not used on the design services copy, which ScatterReveal already reveals on
 * a scrubbed timeline of its own, nor on the featured-projects titles, which
 * the pinned stage reveals with its clip-path wipe. Either would be two
 * reveals fighting over the same type.
 */

/** What counts as prose. Deliberately excludes table-ish and label text. */
const TARGETS = "h1, h2, h3, h4, p";

type TextRevealProps = {
  children: ReactNode;
  className?: string;
  /** Defaults to "scroll". Use "load" for anything above the fold. */
  trigger?: "scroll" | "load";
};

/**
 * The split has to happen before the browser paints, otherwise the finished
 * text flashes for a frame and then drops back into its mask. Running it in a
 * layout effect also means no CSS guard is needed to hide the copy up front —
 * so with scripting off, the text is simply there.
 */

/**
 * The element's text as a reader would hear it, with hard breaks counted as
 * spaces. SplitText writes its own aria-label from textContent, which welds the
 * words either side of a <br> together ("todayand building for tomorrow"), so
 * this is written over the top of it.
 */
function accessibleText(el: HTMLElement) {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
  return clone.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

export function TextReveal({
  children,
  className,
  trigger = "scroll",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(TARGETS));
    if (targets.length === 0) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const mm = gsap.matchMedia();
    /** Survives autoSplit's re-splits; see the "load" branch below. */
    const played = new WeakSet<HTMLElement>();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const splits: SplitText[] = [];

      targets.forEach((el) => {
        const label = accessibleText(el);
        // Splitting rewrites the element's innards, and on copy that sets its
        // own line breaks it can come back a line taller than it went in. The
        // reveal is decoration; it does not get to reflow the page. So the
        // height is taken before and after, and anything that moved is put
        // straight back and left alone.
        const heightBefore = el.getBoundingClientRect().height;

        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "text-reveal-line",
          // Returning the tween hands its lifecycle to SplitText, so a
          // re-split tears the old one down rather than leaving it on
          // orphaned nodes.
          onSplit(self) {
            if (trigger === "load") {
              // autoSplit re-runs this on every font load and resize. A
              // scrubbed reveal can simply be rebuilt, but replaying a
              // one-shot every time the window is dragged would be absurd, so
              // after the first run the lines are just put where they landed.
              if (played.has(el)) {
                gsap.set(self.lines, { yPercent: 0 });
                return;
              }
              played.add(el);
              return gsap.from(self.lines, {
                yPercent: 115,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.12,
                // Enough to let the hero's own image or footage land first.
                delay: 0.15,
              });
            }

            return gsap.from(self.lines, {
              yPercent: 115,
              // Linear, because the scroll position is doing the easing.
              ease: "none",
              stagger: 0.14,
              scrollTrigger: {
                trigger: root,
                // Finishes a little above the middle of the viewport, so the
                // block is settled and readable by the time it is reached.
                //
                // clamp() keeps both ends inside the page's actual scroll
                // range. Without it, a block close to the bottom — the footer
                // blurb, say — asks the reader to scroll further than the page
                // can go, the scrub stops short of 1, and the copy is left
                // permanently part-masked. The stagger makes the last line the
                // worst of it, so it reads as the text being clipped rather
                // than as an animation that never finished.
                start: "clamp(top 88%)",
                end: "clamp(top 42%)",
                scrub: true,
              },
            });
          },
        });

        if (Math.abs(el.getBoundingClientRect().height - heightBefore) > 1) {
          split.revert();
          return;
        }

        el.setAttribute("aria-label", label);
        splits.push(split);
      });

      return () => splits.forEach((split) => split.revert());
    });

    // Anyone who asked for less motion just gets the text.
    mm.add("(prefers-reduced-motion: reduce)", () => {});

    return () => mm.revert();
  }, [trigger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
