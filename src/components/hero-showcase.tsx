"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

import { HERO_SLIDES } from "@/lib/hero-slides";

/**
 * Interactive leaf of the header section (Figma node 14:322).
 * Owns the only stateful part of the hero: which slide is showing.
 * The nav and the headline column are passed in as server-rendered slots so
 * they never enter the client bundle.
 *
 * The rail auto-advances. The active thumbnail carries the 2px white border
 * from the design plus a progress bar that runs for the length of the slide,
 * so the rail reads as progressing rather than just sitting there.
 */

const SLIDE_DURATION_MS = 5000;

/**
 * Progress veil, per Figma node 50:208 (the "3" layer inside the active slide).
 * A white wash trailing the playhead, transparent again 48px behind it, with a
 * 1px white leading edge. Swap #ffffff / rgba(255,255,255,0) for #000000 /
 * rgba(0,0,0,0) to run the same sweep as a dark veil instead.
 */
const PROGRESS_VEIL =
  "linear-gradient(to left, #ffffff, rgba(255, 255, 255, 0) 48px)";

type HeroShowcaseProps = {
  nav: ReactNode;
  copy: ReactNode;
};

export function HeroShowcase({ nav, copy }: HeroShowcaseProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  // Autoplay is opt-in per the visitor's motion preference, and is only turned
  // on after mount so the server and client render the same first paint.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAutoplay(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Keyed on activeSlide, so a manual pick restarts the countdown cleanly.
  useEffect(() => {
    if (!autoplay || isPaused) return;
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [activeSlide, autoplay, isPaused]);

  return (
    <div className="relative flex h-screen w-full flex-col items-start justify-between overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {HERO_SLIDES.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            sizes="100vw"
            preload={index === 0}
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {nav}

      <div className="relative flex w-full flex-1 items-end justify-between gap-10 p-gutter">
        {copy}

        <div
          className="flex shrink-0 items-center gap-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show ${slide.alt}`}
                aria-current={isActive}
                onClick={() => setActiveSlide(index)}
                className={`flex w-40 cursor-pointer flex-col items-start rounded-xl p-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive
                    ? "border-2 border-white"
                    : "opacity-90 hover:opacity-100 active:scale-[0.98]"
                }`}
              >
                <div className="relative h-[88px] w-full overflow-hidden rounded-lg">
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    sizes="160px"
                    className="pointer-events-none object-cover"
                  />
                  {isActive && autoplay ? (
                    <span
                      key={activeSlide}
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-full border-r border-white"
                      style={{
                        backgroundImage: PROGRESS_VEIL,
                        animation: `hero-slide-progress ${SLIDE_DURATION_MS}ms linear forwards`,
                        animationPlayState: isPaused ? "paused" : "running",
                      }}
                    />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
