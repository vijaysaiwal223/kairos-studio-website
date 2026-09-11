import ArrowFillButton from "@/components/ui/arrow-fill-button";
import { CTA_COLORS } from "@/lib/cta";

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
            Architecture without borders. Delivered without compromise.
          </h1>
          <p className="hp-hero-blurb">
            We connect ambitious sites with exceptional architects, then lead
            every detail from first brief to final handover.
          </p>
        </TextReveal>

        <ArrowFillButton
          btnText="Start a project"
          href="#contact"
          className="cta"
          {...CTA_COLORS}
        />
      </div>
    </section>
  );
}
