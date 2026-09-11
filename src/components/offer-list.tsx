import Image from "next/image";

import ScrollReveal from "@/components/ui/scroll-reveal";
import { OFFERINGS } from "@/lib/home";

import { TextReveal } from "./text-reveal";

/**
 * What we offer.
 * Figma: node 295:481
 *
 * Six numbered rules on the dark ground. The design draws a photograph behind
 * the first row and nothing behind the other five, which reads as one row
 * caught in its hover state rather than as a row that is permanently
 * different — so the picture is the hover here, and the five without a file
 * simply have nothing to reveal yet.
 *
 * The hover is CSS alone. Nothing about it needs state, so the section stays a
 * Server Component and ships no JavaScript.
 *
 * Geometry lives in the .hp-offer* block in globals.css.
 */
export function OfferList() {
  return (
    <section className="hp-offer">
      <TextReveal className="hp-offer-label">
        <p className="hp-eyebrow hp-eyebrow-light">What we offer</p>
        <ScrollReveal
          rotationEnd="top 52%"
          wordAnimationEnd="center 52%"
          containerClassName="hp-heading hp-heading-light"
        >
          Access, and accountability.
        </ScrollReveal>
        <p className="hp-body hp-body-light">
          Six things we take responsibility for. Matching without delivery is a
          directory. Delivery without the network is a contractor. We do both.
        </p>
      </TextReveal>

      <ol className="hp-offer-list">
        {OFFERINGS.map((offer, index) => (
          <li key={offer.title} className="hp-offer-row">
            {offer.image ? (
              <div aria-hidden className="hp-offer-media">
                <Image
                  src={offer.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <span aria-hidden className="hp-offer-count">
              {index + 1}
            </span>
            <p className="hp-offer-body">{offer.body}</p>
            <ScrollReveal
              as="h3"
              rotationEnd="top 58%"
              wordAnimationEnd="center 58%"
              containerClassName="hp-offer-title"
            >
              {offer.title}
            </ScrollReveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
