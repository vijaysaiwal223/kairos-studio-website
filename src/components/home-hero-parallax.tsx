"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

const CLOUDS = ["one", "two", "three", "four", "five", "six"] as const;
const CLOUD_X_SHIFT = [-7, 6, -4, 8, -6, 5];

/**
 * The Figma hero is built from two supplied image layers: the skyline render
 * and one transparent cloud cutout repeated across the lower edge. Keeping
 * those layers separate lets scroll produce real depth without repainting
 * layout properties or running an idle animation loop.
 */
export function HomeHeroParallax() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const section = root?.closest<HTMLElement>(".hp-hero");
    if (!root || !section) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const background = root.querySelector<HTMLElement>(".hp-hero-media");
      const copy = section.querySelector<HTMLElement>(".hp-hero-copy");
      const clouds = gsap.utils.toArray<HTMLElement>(".hp-hero-cloud", root);

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      if (background) {
        timeline.fromTo(
          background,
          { scale: 1.035, yPercent: 0 },
          { scale: 1.09, yPercent: 7 },
          0,
        );
      }

      timeline.to(
        clouds,
        {
          xPercent: (index) => CLOUD_X_SHIFT[index] ?? 0,
          yPercent: (index) => -18 - index * 2.5,
        },
        0,
      );

      if (copy) {
        timeline.to(copy, { yPercent: -32, opacity: 0.18 }, 0);
      }

      return () => timeline.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} className="hp-hero-visual">
      <div className="hp-hero-media">
        <Image
          src="/home/hero-building.png"
          alt="A glass residential tower rising above a city skyline at sunset"
          fill
          sizes="(max-width: 700px) 156vw, 104vw"
          preload
          className="hp-hero-image"
        />
      </div>

      <div aria-hidden="true" className="hp-hero-fade" />

      <div aria-hidden="true" className="hp-hero-clouds">
        {CLOUDS.map((cloud) => (
          <span key={cloud} className={`hp-hero-cloud hp-hero-cloud--${cloud}`}>
            <Image
              src="/home/hero-cloud.png"
              alt=""
              fill
              sizes="56vw"
              loading="eager"
              className="hp-hero-cloud-image"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
