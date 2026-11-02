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
    <div ref={rootRef} className="loader [position:fixed] [inset:0] [z-index:100] [overflow:hidden] [background:var(--ink-ground)] [color:#fff]" role="status" aria-live="polite">
      <span className="sr-only [position:absolute] [width:1px] [height:1px] [padding:0] [margin:-1px] [overflow:hidden] [clip-path:inset(50%)] [white-space:nowrap] [border:0]">Loading kai.ros Studio</span>
      <video
        src="/home/loader.mp4"
        className="loader-mark [position:absolute] [top:50%] [left:50%] [width:120px] [height:120px] [object-fit:contain] [transform:translate(-50%,_-50%)]"
        width={1000}
        height={1000}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <p ref={countRef} aria-hidden="true" className="loader-count [position:absolute] [right:4.1667%] [bottom:56px] [margin:0] [font-size:80px] [line-height:1.1] [font-weight:400] [letter-spacing:0] [font-variant-numeric:tabular-nums] [text-align:right] max-[600px]:[right:24px] max-[600px]:[bottom:40px] max-[600px]:[font-size:56px]">0%</p>
      <div ref={barRef} aria-hidden="true" className="loader-bar [position:absolute] [right:8px] [bottom:8px] [left:8px] [height:8px] [border-radius:24px] [transform:scaleX(0)] [transform-origin:0_50%] [background:currentColor] max-[600px]:[bottom:max(8px,_env(safe-area-inset-bottom))] max-[600px]:[height:6px]" />
    </div>
  );
}
