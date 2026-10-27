"use client";

import gsap from "gsap";
import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import { getSmoothScroll, startSmoothScroll, stopSmoothScroll } from "@/lib/smooth-scroll";

const SEEN_KEY = "kairos:loader-seen";

export function LoadingScreen() {
  const [isFinished, setIsFinished] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    if (!root || !count || !bar) return;
    let seen = false;
    try {
      seen = process.env.NODE_ENV !== "development" && sessionStorage.getItem(SEEN_KEY) === "1";
    } catch { /* Storage may be unavailable in private browsing. */ }
    if (seen) {
      setIsFinished(true);
      return;
    }

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    stopSmoothScroll();
    getSmoothScroll()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);

    const release = () => {
      document.documentElement.style.overflow = previousOverflow;
      startSmoothScroll();
    };
    const finish = () => {
      release();
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* Replay if storage is unavailable. */ }
      setIsFinished(true);
    };
    const media = gsap.matchMedia(root);
    media.add("(prefers-reduced-motion: reduce)", finish);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const video = document.querySelector<HTMLVideoElement>(".hp-hero-video");
      const progress = { value: 0 };
      let ready = !video || video.readyState >= 2;
      let settled = false;
      let closing = false;
      let exit: gsap.core.Timeline | undefined;
      const paint = () => {
        count.textContent = Math.round(progress.value) + "%";
        gsap.set(bar, { scaleX: progress.value / 100 });
      };
      const closeIfReady = () => {
        if (!ready || !settled || closing) return;
        closing = true;
        exit = gsap.timeline({ onComplete: finish })
          .to(progress, { value: 100, duration: 0.45, ease: "power1.out", onUpdate: paint })
          .to(root, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.15");
      };
      const onReady = () => { ready = true; closeIfReady(); };
      video?.addEventListener("loadeddata", onReady);
      video?.addEventListener("error", onReady);
      // The count approaches readiness; completion waits for a drawable video frame.
      const run = gsap.to(progress, {
        value: 90, duration: 1.9, ease: "none", onUpdate: paint,
        onComplete: () => { settled = true; closeIfReady(); },
      });
      const safety = gsap.delayedCall(6, onReady);
      return () => {
        run.kill();
        safety.kill();
        exit?.kill();
        video?.removeEventListener("loadeddata", onReady);
        video?.removeEventListener("error", onReady);
      };
    });
    return () => { media.revert(); release(); };
  }, []);

  if (isFinished) return null;
  return (
    <div ref={rootRef} className="loader" role="status" aria-live="polite">
      <span className="sr-only">Loading Kairos Studio</span>
      <video
        src="/home/loader.mp4"
        className="loader-mark"
        width={1000}
        height={1000}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <p ref={countRef} aria-hidden="true" className="loader-count">0%</p>
      <div ref={barRef} aria-hidden="true" className="loader-bar" />
    </div>
  );
}
