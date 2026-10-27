"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import { preloadPage } from "@/lib/preload-page";
import { getSmoothScroll, startSmoothScroll, stopSmoothScroll } from "@/lib/smooth-scroll";

const SEEN_KEY = "kairos:loader-seen";
/** Long enough for the mark to read, even when everything is cached. */
const MIN_DURATION = 1200;

/**
 * Covers the homepage until every font, image and video on it has loaded and
 * the scroll animations have been measured against the finished layout.
 * Shown once per session; later visits have it all in cache.
 */

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
    gsap.registerPlugin(ScrollTrigger);
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progress = { value: 0 };
    const paint = () => {
      count.textContent = Math.round(progress.value) + "%";
      gsap.set(bar, { scaleX: progress.value / 100 });
    };
    // The count follows real progress, held short of 100 until the page has
    // also been measured for its scroll animations.
    const onProgress = (share: number) => {
      const value = share * 95;
      if (reduced) {
        progress.value = value;
        paint();
        return;
      }
      gsap.to(progress, { value, duration: 0.6, ease: "power2.out", overwrite: true, onUpdate: paint });
    };
    // The footage played unseen behind the loader; start it over as it shows.
    const restartHero = () => {
      const hero = document.querySelector<HTMLVideoElement>(".hp-hero-video");
      if (!hero) return;
      hero.currentTime = 0;
      hero.play().catch(() => { /* Autoplay may be blocked; the poster stays. */ });
    };

    let cancelled = false;
    let exit: gsap.core.Timeline | undefined;
    Promise.all([
      preloadPage({ exclude: root, onProgress }),
      new Promise((resolve) => window.setTimeout(resolve, reduced ? 0 : MIN_DURATION)),
    ]).then(() => {
      if (cancelled) return;
      // Pins and scrubs were measured while images were still arriving.
      ScrollTrigger.refresh();
      if (reduced) {
        restartHero();
        finish();
        return;
      }
      exit = gsap.timeline({ onComplete: finish })
        .to(progress, { value: 100, duration: 0.45, ease: "power1.out", overwrite: true, onUpdate: paint })
        .call(restartHero, undefined, "+=0.15")
        .to(root, { opacity: 0, duration: 0.5, ease: "power2.inOut" });
    });

    return () => {
      cancelled = true;
      exit?.kill();
      gsap.killTweensOf(progress);
      release();
    };
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
