import Image from "next/image";

import ArrowFillButton from "@/components/ui/arrow-fill-button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { CTA_COLORS_INK } from "@/lib/cta";
import { ARCHITECTS } from "@/lib/home";

import { TextReveal } from "./text-reveal";

/**
 * The network.
 * Figma: node 288:186
 *
 * A heading and its blurb, then the four principals on one row. The stagger is
 * not an offset: the cards hang from the top of the row on portraits drawn at
 * alternating 450 and 500px, so the names below them land at different
 * heights. That is carried on each record as `height`.
 *
 * Geometry lives in the .hp-network* block in globals.css.
 */

/** Their drawn share of the 1360 column: four cards and three 16px gaps. */
const CARD_SIZES =
  "(max-width: 1000px) 50vw, calc((100vw - var(--site-gutter) * 2 - 48px) / 4)";

export function ArchitectNetwork() {
  return (
    <section id="architects" className="hp-network">
      <div className="hp-network-head">
        <div className="hp-network-label">
          <TextReveal>
            <p className="hp-eyebrow">The network</p>
          </TextReveal>
          <ScrollReveal
            baseOpacity={0.08}
            baseRotation={4}
            blurStrength={8}
            rotationEnd="top 48%"
            wordAnimationEnd="center 52%"
            containerClassName="hp-heading"
          >
            The right architect changes everything.
          </ScrollReveal>
        </div>

        <TextReveal className="hp-network-aside">
          <p className="hp-body">
            Your project deserves more than the nearest available practice. We
            bring together distinctive architects from around the world and
            match their thinking to your site, brief and ambitions.
          </p>
          <ArrowFillButton
            btnText="Meet the network"
            href="#contact"
            className="cta"
            {...CTA_COLORS_INK}
          />
        </TextReveal>
      </div>

      <ul className="hp-architects">
        {ARCHITECTS.map((architect) => (
          <li key={architect.name} className="hp-architect">
            <div
              className="hp-architect-card"
              style={{ "--hp-card-h": `${architect.height}` } as React.CSSProperties}
            >
              <Image
                src={architect.portrait}
                alt={`Portrait of ${architect.name}`}
                fill
                sizes={CARD_SIZES}
                className="object-cover"
                data-image-reveal
              />
            </div>

            <div className="hp-architect-name-wrapper">
              <p className="hp-architect-name">{architect.name}</p>
              {/* The design sets the first of these four at 16px and the
                  other three at 14. Read as a slip and set to 14 throughout. */}
              <p className="hp-architect-role">{architect.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
