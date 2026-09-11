import Link from "next/link";

import { HomeHeroParallax } from "./home-hero-parallax";
import { SiteNav } from "./site-nav";
import { TextReveal } from "./text-reveal";

/**
 * The home page masthead.
 * Figma: node 390:1387 — 1440x1200.
 *
 * The skyline, centred copy and navigation share one full-bleed stage. The
 * cloud cutouts at the foot remain a separate layer so HomeHeroParallax can
 * move foreground and background at different rates.
 *
 * Geometry lives in the .hp-hero* block in globals.css.
 */
export function HomeHero() {
  return (
    <section id="about" className="hp-hero">
      <HomeHeroParallax />

      <div className="hp-hero-nav">
        <SiteNav tone="media" />
      </div>

      <div className="hp-hero-copy">
        <TextReveal trigger="load" className="hp-hero-label">
          <h1 className="hp-hero-title">
            Designing for today and building for tomorrow
          </h1>
          <p className="hp-hero-blurb">
            Kairos studio offers a full range of bespoke interior design
            services — from initial concept and aesthetic counselling to
            coordination, execution and magazine-worthy finishing touches.
          </p>
        </TextReveal>

        <Link href="#contact" className="hp-hero-cta">
          Get started
        </Link>
      </div>
    </section>
  );
}
