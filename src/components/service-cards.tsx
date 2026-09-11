import Image from "next/image";

import ArrowFillButton from "@/components/ui/arrow-fill-button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { CTA_COLORS } from "@/lib/cta";
import { SERVICES } from "@/lib/home";

import { TextReveal } from "./text-reveal";

/**
 * Different contexts, same standards.
 * Figma: node 295:559
 *
 * The second dark section: a heading and its blurb, then the three practice
 * areas as full-bleed cards with their copy set on the floor of each.
 *
 * Geometry lives in the .hp-services* block in globals.css.
 */

/** Three cards and two 16px gaps across the 1360 column. */
const CARD_SIZES =
  "(max-width: 1000px) 100vw, calc((100vw - var(--site-gutter) * 2 - 32px) / 3)";

export function ServiceCards() {
  return (
    <section className="hp-services">
      <div className="hp-services-head">
        <TextReveal className="hp-services-label">
          <p className="hp-eyebrow hp-eyebrow-light">What we offer</p>
          <ScrollReveal
            rotationEnd="top 52%"
            wordAnimationEnd="center 52%"
            containerClassName="hp-heading hp-heading-light"
          >
            Different contexts same standards
          </ScrollReveal>
        </TextReveal>

        <TextReveal className="hp-services-aside">
          <p className="hp-body hp-body-light">
            Six things we take responsibility for. Matching without delivery is
            a directory. Delivery without the network is a contractor. We do
            both.
          </p>
          {/* On the dark ground, so this is the white pill of the pair. */}
          <ArrowFillButton
            btnText="Learn more"
            href="#contact"
            className="cta"
            {...CTA_COLORS}
          />
        </TextReveal>
      </div>

      <ul className="hp-service-cards">
        {SERVICES.map((service) => (
          <li key={service.title} className="hp-service-card">
            <Image
              src={service.image}
              alt=""
              fill
              sizes={CARD_SIZES}
              className="object-cover"
            />

            {/* Node 295:589's scrim. The design draws the third card's
                gradient the other way up, which would float its copy on a
                clear ground; run the same way as the other two. */}
            <div aria-hidden className="hp-service-scrim" />

            <div className="hp-service-copy">
              <ScrollReveal
                as="h3"
                baseRotation={2}
                rotationEnd="top 64%"
                wordAnimationEnd="center 64%"
                containerClassName="hp-service-title"
              >
                {service.title}
              </ScrollReveal>
              <p className="hp-service-body">{service.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
