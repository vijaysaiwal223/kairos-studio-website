"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * GSAP ScrollTrigger leaf for the design services section.
 *
 * The timeline is scrubbed, so the photos travel out from the centre of the
 * stage in step with the scroll position rather than playing a fixed one-shot
 * on entry. Each photo reads its own offset back to the centre from
 * data-scatter-x/y, which the section derives from its resting coordinates.
 *
 * The section pins at the top of the viewport for one screen of scrolling, so
 * the start state (everything stacked dead centre) is held while the section
 * fills the screen and the scatter only begins once the user scrolls on.
 *
 * Motion matches the Figma storyboard: frames 52:244 ("start") through 52:250
 * ("end") hold every photo at a constant 144x180 and full opacity, so nothing
 * scales or fades here. Only the copy fades in.
 *
 * Isolated in this leaf so the composition it wraps stays a Server Component,
 * and everything is torn down through gsap.matchMedia().revert().
 *
 * That teardown has to happen in a layout cleanup, not a passive one. The pin
 * lifts this section out of its place in the document and into a pin-spacer,
 * so on the way out GSAP has to put it back before React goes looking for it —
 * see use-isomorphic-layout-effect for what happens otherwise.
 */
type ScatterRevealProps = {
  children: ReactNode;
  className?: string;
};

export function ScatterReveal({ children, className }: ScatterRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const photos = gsap.utils.toArray<HTMLElement>("[data-scatter-item]", root);
    const texts = gsap.utils.toArray<HTMLElement>("[data-reveal-item]", root);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          // Pin at the viewport top so the section is already filling the
          // screen, photos stacked, before any of the scatter runs. Starting
          // anywhere else means the user sees it half-played on the way in.
          start: "top top",
          end: "+=100%",
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          // This pin adds a viewport of spacer height, so every trigger
          // further down the page depends on it having been measured first.
          // TextReveal runs in a layout effect and so registers before this
          // effect does; without a priority its triggers are positioned as if
          // the spacer were not there and fire a screen early.
          refreshPriority: 1,
        },
      });

      // The storyboard (Figma 52:244 "start" -> 52:250 "end") keeps every photo
      // at full size and full opacity, stacked dead centre, and only moves them
      // outward. So this is a pure translation: no scale, no fade. The photos
      // are opaque for the whole timeline; the set() below simply releases the
      // stylesheet's anti-flash guard.
      gsap.set(photos, { opacity: 1 });

      // fromTo, not from: a bare .from() would read the guarded value as the
      // end state and animate it back to itself.
      timeline.fromTo(
        photos,
        {
          x: (_index, el: HTMLElement) => Number(el.dataset.scatterX ?? 0),
          y: (_index, el: HTMLElement) => Number(el.dataset.scatterY ?? 0),
        },
        // from "end" so photo 01, the one on top of the stack, peels off first.
        { x: 0, y: 0, stagger: { each: 0.12, from: "end" } },
        0,
      );

      // The start board carries no text at all and the end board carries it in
      // place, so the copy is a straight fade with no displacement.
      timeline.fromTo(
        texts,
        { opacity: 0 },
        { opacity: 1, stagger: 0.1, ease: "power2.out" },
        0.2,
      );
    });

    // Anyone who asked for less motion just gets the finished composition.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([...photos, ...texts], { opacity: 1, clearProps: "transform" });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
