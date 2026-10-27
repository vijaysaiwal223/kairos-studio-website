"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's background footage. It plays once and rests on its last frame.
 *
 * A client island for one reason: nothing in CSS can stop a video from
 * playing, and motion that starts on its own is worth withholding from anyone
 * who has asked for less of it. So the element carries no autoplay attribute
 * and playback is started here only when motion is welcome — which also means
 * that if the script never runs, the hero simply stays on its poster instead
 * of moving unbidden.
 *
 * The poster is a frame of the footage itself, so the hero is filled from the
 * first paint rather than sitting black while the video buffers.
 *
 * With `holdScroll`, the page is also kept still until the footage has played
 * through, so the hero is seen whole rather than scrolled off two seconds in.
 * Holding a visitor in place is a thing to do carefully, so it is hedged at
 * every edge: it never starts for someone who asked for less motion, or who is
 * already somewhere further down the page, and it ends on the clip finishing,
 * on the clip failing, on the browser refusing to play it, on the tab going to
 * the background, on Escape, and — if none of those ever happen — on a ceiling
 * measured from the clip's own length. The page can be slow to release. It
 * cannot be stuck.
 */

/** The longest the page is ever held, if the clip's length is never known. */
const HOLD_CEILING = 12000;

/** Slack on top of the clip's own remaining time, once that is known. */
const HOLD_SLACK = 1200;

type HeroVideoProps = {
  src: string;
  poster: string;
  /** Keep the page at the top until the footage has played through. */
  holdScroll?: boolean;
};

export function HeroVideo({ src, poster, holdScroll = false }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Null when the page is free; the previous overflow while it is held, so
    // releasing puts back whatever was there rather than assuming "visible".
    let heldOverflow: string | null = null;
    let ceiling = 0;

    const release = () => {
      if (heldOverflow === null) return;
      root.style.overflow = heldOverflow;
      heldOverflow = null;
      window.clearTimeout(ceiling);
    };

    const hold = () => {
      if (!holdScroll || heldOverflow !== null) return;
      // Not for anyone who asked for less motion: there is nothing to wait for.
      if (reduced.matches) return;
      // Not for anyone already reading further down — a restored scroll
      // position, a deep link, a back navigation. Freezing someone mid-page is
      // indistinguishable from a page that has broken.
      if (window.scrollY > 0) return;
      // Not for footage that has already played.
      if (video.ended) return;

      heldOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      ceiling = window.setTimeout(release, HOLD_CEILING);
    };

    // Once the clip's length is known the ceiling can be its own remaining
    // time rather than a flat guess — which matters because the guess has to
    // be generous, and nobody should sit through the difference.
    const onMetadata = () => {
      if (heldOverflow === null || !Number.isFinite(video.duration)) return;
      window.clearTimeout(ceiling);
      const remaining = Math.max(video.duration - video.currentTime, 0) * 1000;
      ceiling = window.setTimeout(release, remaining + HOLD_SLACK);
    };

    // Anyone who tries to leave gets to leave.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") release();
    };

    // A backgrounded tab pauses the video and may never finish it. Nobody
    // should come back to a page that will not move.
    const onVisibilityChange = () => {
      if (document.hidden) release();
    };

    const sync = () => {
      if (reduced.matches) {
        release();
        video.pause();
        // Back to the poster frame, so the still the design chose is what
        // stays on screen rather than wherever playback happened to stop.
        video.currentTime = 0;
        return;
      }

      hold();
      // Muted playback needs no gesture; a rejection here only means the
      // browser declined — the poster is already the right fallback, and there
      // is then nothing left to hold the page for.
      void video.play().catch(release);
    };

    sync();

    reduced.addEventListener("change", sync);
    video.addEventListener("ended", release);
    video.addEventListener("error", release);
    video.addEventListener("loadedmetadata", onMetadata);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Cached footage can be past `loadedmetadata` before any of that is
    // attached, so the length is taken now if it is already there.
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();

    return () => {
      release();
      reduced.removeEventListener("change", sync);
      video.removeEventListener("ended", release);
      video.removeEventListener("error", release);
      video.removeEventListener("loadedmetadata", onMetadata);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [holdScroll]);

  return (
    <video
      ref={videoRef}
      className="size-full object-cover"
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
    />
  );
}
