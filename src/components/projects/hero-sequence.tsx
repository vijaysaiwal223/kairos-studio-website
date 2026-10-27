"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A scroll-scrubbed frame sequence behind a project hero.
 *
 * The footage is not played, it is scrubbed: the hero sticks to the top of the
 * screen and the scroll position picks the frame, so the camera walks up to the
 * house, through the door and out to the aerial exactly as fast as the reader
 * scrolls, and stops when they stop.
 *
 * Pinned with native `position: sticky` and driven by one lerped scalar read
 * off the section's own rect — the same engine the featured-projects stage
 * uses, and for the same reasons: no pin-spacer DOM, and one smoothed value
 * that everything else derives from, so nothing can drift out of step.
 *
 * WHAT IS ACTUALLY SHIPPED
 * A frame sequence is heavy — 121 WebP frames come to 5.5MB — so it is not
 * shipped to everyone:
 *
 * - The poster is a plain <img> and is always there. It is frame one of the
 *   sequence, so the still the page opens on and the first frame the canvas
 *   draws are the same picture and nothing jumps when the canvas takes over.
 * - The frames are fetched only where the scrub will actually run: a viewport
 *   wide enough that the hero is not already stacked down, and a reader who
 *   has not asked for reduced motion. Everywhere else this is a still hero and
 *   costs 166KB.
 * - They are fetched in order, and the canvas draws the nearest frame it
 *   actually holds. So the scrub sharpens as the sequence arrives rather than
 *   waiting on all of it, and a reader on a slow connection gets a coarse
 *   scrub instead of a blank screen.
 */

/** Matches the lerp the featured-projects stage runs at. */
const SCROLL_EASE = 0.12;

/** Below this the hero is a stacked 640px block; see .pe-hero in globals.css. */
const SCRUB_FROM = 1201;

/** Retina is worth it here, beyond that is memory for nothing. */
const MAX_DPR = 2;

type HeroSequenceProps = {
  /** Folder of zero-padded frames, e.g. /projects/house-klaus/hero-sequence. */
  dir: string;
  /** How many frames are in it. Frame files are 0001.webp … {count}.webp. */
  count: number;
  /** Frame one, also served as the poster. */
  poster: string;
  alt: string;
};

const frameUrl = (dir: string, index: number) =>
  `${dir}/${String(index + 1).padStart(4, "0")}.webp`;

export function HeroSequence({ dir, count, poster, alt }: HeroSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** The <section> track. Its height is what the scrub is measured against. */
  const trackRef = useRef<HTMLElement | null>(null);
  /** True once the canvas has painted, so the poster can be handed over. */
  const [painting, setPainting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // The track is this canvas's .pe-hero ancestor. Found rather than passed,
    // so the markup can stay a plain server-rendered hero.
    const track = canvas.closest<HTMLElement>(".pe-hero");
    if (!track) return;
    trackRef.current = track;

    const scrubs = window.matchMedia(
      `(min-width: ${SCRUB_FROM}px) and (prefers-reduced-motion: no-preference)`,
    );
    if (!scrubs.matches) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const frames: (HTMLImageElement | undefined)[] = new Array(count);
    let cancelled = false;
    let raf = 0;
    let smooth = 0;
    let drawn = -1;

    /** Nearest frame we actually hold, preferring one at or before `want`. */
    const nearest = (want: number) => {
      for (let d = 0; d < count; d += 1) {
        const back = frames[want - d];
        if (back) return want - d;
        const forward = frames[want + d];
        if (forward) return want + d;
      }
      return -1;
    };

    const paint = (index: number) => {
      const img = frames[index];
      if (!img) return;
      const { width: cw, height: ch } = canvas;
      if (!cw || !ch) return;

      // Cover: fill the stage, crop the overflow, stay centred.
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      drawn = index;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      if (!width || !height) return;
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      // The bitmap is cleared by the resize, so whatever was showing is redrawn.
      const again = drawn >= 0 ? drawn : nearest(0);
      drawn = -1;
      if (again >= 0) paint(again);
    };

    /**
     * Progress across the track: 0 while the stage is still coming up, 1 once
     * the track's last screenful has been scrolled past.
     */
    const progress = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(Math.max(-rect.top / scrollable, 0), 1);
    };

    // Run only while scroll progress is changing or the lerp is settling.
    // The old self-scheduling loop stayed alive at 60fps for the entire page,
    // including the many screens below this hero, even after it had reached
    // its final frame.
    const tick = () => {
      raf = 0;
      const raw = progress();
      smooth += (raw - smooth) * SCROLL_EASE;
      // Close enough that another frame would not change the picture.
      if (Math.abs(raw - smooth) < 0.0005) smooth = raw;

      const want = Math.round(smooth * (count - 1));
      const have = nearest(want);
      if (have >= 0 && have !== drawn) paint(have);

      if (smooth !== raw) raf = window.requestAnimationFrame(tick);
    };

    const schedulePaint = () => {
      if (raf === 0 && !document.hidden) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    // Four workers preserve request order while overlapping network latency
    // and decoding, so the later frames are ready sooner during the scrub.
    let nextFrame = 0;
    const load = async () => {
      while (nextFrame < count) {
        if (cancelled) return;
        const i = nextFrame++;
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(dir, i);
        try {
          await img.decode();
        } catch {
          continue; // A frame that will not decode is simply one we skip.
        }
        if (cancelled) return;
        frames[i] = img;
        if (i === 0) {
          resize();
          paint(0);
          setPainting(true);
        }
        // If the reader has already reached this part of the sequence, refine
        // the canvas as the closer frame becomes available.
        schedulePaint();
      }
    };

    resize();
    for (let worker = 0; worker < Math.min(4, count); worker += 1) {
      void load();
    }
    schedulePaint();

    window.addEventListener("scroll", schedulePaint, { passive: true });
    const onVisibilityChange = () => schedulePaint();
    document.addEventListener("visibilitychange", onVisibilityChange);

    const observer = new ResizeObserver(() => {
      resize();
      schedulePaint();
    });
    observer.observe(canvas);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedulePaint);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
    };
  }, [count, dir]);

  return (
    <>
      {/* Always painted, and never removed — it is what the canvas is drawn
          over, so a frame that has not arrived shows this instead of nothing.
          Plain <img> rather than next/image: it is one fixed full-bleed
          picture at a known size, and it has to be the very first byte the
          hero paints. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={alt} loading="eager" fetchPriority="high" className="pe-hero-poster" />

      <canvas
        ref={canvasRef}
        aria-hidden
        className="pe-hero-canvas"
        data-painting={painting ? "true" : undefined}
      />
    </>
  );
}
