"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import { setSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Smooth scrolling, site-wide.
 *
 * Renders nothing. Mounted once by the root layout, so every page scrolls the
 * same way and any ScrollTrigger on any of them is reading the same clock.
 *
 * THE THREE WIRES
 * Lenis and ScrollTrigger each want to own the frame loop, and if they are
 * left to run their own the two drift apart — triggers fire against a scroll
 * position a frame or two stale, which on a pinned, scrubbed section reads as
 * jitter. So:
 *
 *   1. lenis.on("scroll", ScrollTrigger.update) — ScrollTrigger recalculates
 *      when Lenis moves, not when the browser fires its own scroll event.
 *   2. gsap.ticker drives lenis.raf — one requestAnimationFrame for the whole
 *      page rather than two competing ones. The ticker reports seconds and
 *      Lenis wants milliseconds, hence the 1000.
 *   3. lagSmoothing(0) — GSAP's default is to notice a long frame and quietly
 *      adjust time to hide it, which desynchronises it from Lenis's own
 *      accounting. Off, the two stay on the same clock through a stutter.
 *
 * Reduced motion gets no Lenis at all: native scrolling is what that setting
 * is asking for, and ScrollTrigger works perfectly well without it.
 */
export function SmoothScroll() {
  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // Long enough to glide, short enough that a flick still feels answered.
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Touch devices already have momentum scrolling of their own; a second
      // one on top of it fights the platform.
      smoothWheel: true,
      syncTouch: false,
    });

    setSmoothScroll(lenis);

    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setSmoothScroll(null);
    };
  }, []);

  return null;
}
