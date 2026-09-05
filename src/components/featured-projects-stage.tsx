"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll engine for the "Featured projects" section.
 *
 * The section is pinned with native `position: sticky` rather than a
 * ScrollTrigger pin: the whole effect is one scalar (`progress`) read off the
 * section's own rect, and sticky gives us the pin without the pin-spacer DOM
 * that ScrollTrigger injects.
 *
 * SMOOTHING
 * There is exactly one lerped value (`smooth`) chasing the raw scroll position,
 * and every layer is derived from it in the same frame. That is what makes the
 * wipe line, the two background translations and the clip edges stay welded
 * together: none of them carries an easing curve of its own, they all inherit
 * this one. (Lenis-style feel, without hijacking native scrolling.)
 *
 * GEOMETRY — with `w` the wipe progress of the active transition (0 -> 1) and
 * `h` the viewport height, the line sits at y = (1 - w) * h and sweeps upward:
 *
 *   incoming slide   clip inset((1-w)*h from the top)   bg translateY  +(1-w)*h
 *   outgoing slide   clip inset(w*h from the bottom)    bg translateY  -w*0.5h
 *
 * The incoming background therefore rides the line at exactly 1:1 (its top edge
 * IS the line) and lands at translateY(0) the instant the line reaches the top.
 * The outgoing background travels the same direction at half speed. Both stay
 * inside their own clip window for every w by construction, so no gap can open;
 * the 4vh bleed on `.fp-bg` only guards against sub-pixel seams while scrubbing.
 *
 * Foregrounds (tag, title, card) get no transform at all — they sit in their
 * final position from the start and are purely revealed/erased by the clip.
 *
 * Scrolling up is not a special case: the transition is a pure function of
 * scroll position, so reversing the scroll runs the same wipe backwards and the
 * line re-enters from the top and travels down on its own.
 */

const SCROLL_EASE = 0.12; // lerp factor per 60fps frame for the scroll value
const CURSOR_EASE = 0.22; // lower = longer trail behind the pointer
const HAPTIC_MS = 8; // one short tick as a slide hands over
const OUTGOING_PARALLAX = 0.5; // outgoing background speed, relative to the line
const UNPIN_PARALLAX = 0.5; // stage speed once it releases and the next section covers it

type FeaturedProjectsStageProps = {
  /** Server-rendered slides, header and rail. Queried by data attribute. */
  children: ReactNode;
  /** Drives the section height: one viewport of scroll per transition. */
  slideCount: number;
};

export function FeaturedProjectsStage({
  children,
  slideCount,
}: FeaturedProjectsStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const cursor = cursorRef.current;
    if (!section || !stage) return;

    const slides = Array.from(
      section.querySelectorAll<HTMLElement>("[data-fp-slide]"),
    );
    if (slides.length < 2) return;

    const backgrounds = slides.map((slide) =>
      slide.querySelector<HTMLElement>("[data-fp-bg]"),
    );
    const lastTransition = slides.length - 2;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    let target = 0; // raw scroll offset into the pinned range, in px
    let smooth = 0; // lerped follower — the single source of truth for all layers
    let shift = 0; // px of exit parallax currently applied to the stage
    let range = 1; // scrollable distance while pinned, in px
    let viewport = window.innerHeight;

    let settledIndex = -1; // which slide currently reads as the dominant one
    let isHot = false; // pointer is over something actionable

    // Feature-detected: absent on desktop and on iOS Safari, where the call
    // simply never exists. Reduced motion opts out of it as well — a request
    // for less movement is taken to cover buzzing too.
    const canVibrate = typeof navigator.vibrate === "function";

    let pointerX = 0;
    let pointerY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let cursorReady = false;

    let frame = 0;
    let lastTime = 0;

    /**
     * Everything is measured live, every frame — position, viewport and the
     * pinned range alike. Nothing here is cached between frames. Anything that
     * changes layout after mount (ScrollTrigger inserting a pin-spacer for an
     * earlier section, late images, a font swap, a resize) would otherwise
     * leave a stale measurement behind and drift the whole sequence out of
     * step with the scroll.
     */
    const readScroll = () => {
      const rect = section.getBoundingClientRect();
      viewport = window.innerHeight;
      // The section is (slides.length * 100vh) tall, so the pinned range works
      // out to exactly one viewport per transition. rect.height is used rather
      // than offsetHeight because offsetHeight rounds to whole pixels.
      range = Math.max(rect.height - viewport, 1);
      target = Math.min(Math.max(-rect.top, 0), range);
    };

    /** Paints every layer from a single progress value. */
    const render = (offset: number) => {
      const progress = offset / range; // 0 -> 1 across the whole pinned range
      const scaled = progress * (slides.length - 1);
      const index = Math.min(Math.max(Math.floor(scaled), 0), lastTransition);
      const w = Math.min(Math.max(scaled - index, 0), 1);

      const linePx = (1 - w) * viewport; // the shared wipe line, in px from the top

      // Haptics: a single short tick at the point the wipe hands over, so the
      // change registers in the hand as well as the eye on a touch device.
      // Keyed off the rounded position, which flips exactly at the halfway
      // point of a transition rather than at either rest state.
      const settled = Math.round(scaled);
      if (settled !== settledIndex) {
        if (settledIndex !== -1 && canVibrate && !reduceMotion.matches) {
          navigator.vibrate(HAPTIC_MS);
        }
        settledIndex = settled;
      }

      slides.forEach((slide, i) => {
        const bg = backgrounds[i];

        if (i === index) {
          // Outgoing: kept above the line, erased from the bottom up.
          slide.style.clipPath = `inset(0px 0px ${w * viewport}px 0px)`;
          slide.style.visibility = "visible";
          if (bg) {
            bg.style.transform = `translate3d(0, ${-w * viewport * OUTGOING_PARALLAX}px, 0)`;
          }
        } else if (i === index + 1) {
          // Incoming: revealed below the line, its top edge welded to the line.
          slide.style.clipPath = `inset(${linePx}px 0px 0px 0px)`;
          slide.style.visibility = "visible";
          if (bg) bg.style.transform = `translate3d(0, ${linePx}px, 0)`;
        } else {
          slide.style.clipPath = "inset(100% 0px 0px 0px)";
          slide.style.visibility = "hidden";
        }
      });

      // Past the pin, sticky releases and the stage would scroll away at 1x.
      // Handing back half of the displacement leaves it climbing at 0.5x while
      // the next section — which paints above this one — slides over at 1x.
      //
      // This reads the displacement off the stage itself instead of deriving
      // it from the scroll position: `natural` is the stage's own top with our
      // transform backed out, so it is 0 for exactly as long as sticky holds
      // and only ever negative once it releases. The stage therefore lands at
      // natural * 0.5, which can never be positive — so the exit cannot push
      // the stage below the viewport top and expose the section's own
      // background as a band above the slides.
      const natural = stage.getBoundingClientRect().top - shift;
      shift = natural < 0 ? -natural * (1 - UNPIN_PARALLAX) : 0;
      stage.style.transform = shift > 0 ? `translate3d(0, ${shift}px, 0)` : "";
    };

    const tick = (time: number) => {
      readScroll();
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 1 / 60;
      lastTime = time;

      // Framerate-independent lerp, so the trail feels the same at 60 and 120Hz.
      const scrollAlpha = reduceMotion.matches
        ? 1
        : 1 - Math.pow(1 - SCROLL_EASE, delta * 60);
      smooth += (target - smooth) * scrollAlpha;
      if (Math.abs(target - smooth) < 0.05) smooth = target;
      render(smooth);

      if (cursor && cursorReady) {
        const cursorAlpha = reduceMotion.matches
          ? 1
          : 1 - Math.pow(1 - CURSOR_EASE, delta * 60);
        cursorX += (pointerX - cursorX) * cursorAlpha;
        cursorY += (pointerY - cursorY) * cursorAlpha;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }

      frame = window.requestAnimationFrame(tick);
    };

    const onResize = () => {
      readScroll();
      smooth = target;
      render(smooth);
    };

    const setPressed = (value: boolean) => {
      if (cursor) cursor.dataset.pressed = String(value);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!cursor || !finePointer.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;

      // Cheap enough to ride the move handler rather than add enter/leave
      // listeners to every actionable element inside the slides.
      const target = event.target as Element | null;
      const hot = !!target?.closest?.("[data-fp-interactive]");
      if (hot !== isHot) {
        isHot = hot;
        cursor.dataset.hot = String(hot);
      }
      if (!cursorReady) {
        // Land the cursor on the pointer the first time rather than flying in.
        cursorReady = true;
        cursorX = pointerX;
        cursorY = pointerY;
        cursor.dataset.visible = "true";
      }
    };

    const onPointerLeave = () => {
      if (!cursor) return;
      cursor.dataset.visible = "false";
      // A press that ends outside the section would otherwise stay stuck on.
      setPressed(false);
    };

    const onPointerDown = () => setPressed(true);
    // On window, not the section: a drag released outside still ends the press.
    const onPointerUp = () => setPressed(false);

    const onPointerEnter = () => {
      if (cursor && cursorReady && finePointer.matches) {
        cursor.dataset.visible = "true";
      }
    };

    readScroll();
    smooth = target;
    render(smooth);

    window.addEventListener("resize", onResize);
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerenter", onPointerEnter);
    section.addEventListener("pointerleave", onPointerLeave);
    section.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerenter", onPointerEnter);
      section.removeEventListener("pointerleave", onPointerLeave);
      section.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      slides.forEach((slide, i) => {
        slide.style.clipPath = "";
        slide.style.visibility = "";
        const bg = backgrounds[i];
        if (bg) bg.style.transform = "";
      });
      stage.style.transform = "";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="fp-section"
      style={{ "--fp-slides": slideCount } as CSSProperties}
    >
      <div ref={stageRef} className="fp-stage">
        {children}
      </div>

      {/* Deliberately outside .fp-stage: the stage takes a transform on unpin,
          which would turn this fixed element into an absolute one and send the
          cursor to the wrong coordinates. */}
      <div
        ref={cursorRef}
        aria-hidden
        className="fp-cursor"
        data-visible="false"
        data-hot="false"
        data-pressed="false"
      >
        <div className="fp-cursor-dot">
          <svg viewBox="0 0 16 16" className="fp-cursor-glyph" aria-hidden>
            <path d="M8 2.5v11M2.5 8h11" />
          </svg>
        </div>
      </div>
    </section>
  );
}
