import Image from "next/image";

import ArrowFillButton from "@/components/ui/arrow-fill-button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { CTA_COLORS_INK } from "@/lib/cta";

import { TextReveal } from "./text-reveal";

/**
 * The closing invitation.
 * Figma: node 299:1108 (project page) and node 299:926 (home page).
 *
 * The design draws the same section at the foot of both, to the pixel, so it
 * is written once. Site copy rather than any one project's, which is why none
 * of it is a prop.
 *
 * Geometry lives in the .invite* block in globals.css.
 */
export function SiteInvitation({ preloadImage = false }: { preloadImage?: boolean }) {
  return (
    <section id="contact" className="invite">
      <TextReveal className="invite-copy">
        <p className="invite-eyebrow">Start a conversation</p>
        <ScrollReveal
          rotationEnd="top 52%"
          wordAnimationEnd="center 52%"
          containerClassName="invite-heading"
        >
          Tell us what you want to make.
        </ScrollReveal>
        <ScrollReveal
          as="p"
          baseOpacity={0.16}
          baseRotation={1}
          blurStrength={3}
          rotationEnd="top 58%"
          wordAnimationEnd="bottom 42%"
          containerClassName="invite-body"
        >
          Share your site, your brief and the ambition behind it. We will tell
          you honestly how we can help and whether we are the right partner.
        </ScrollReveal>

        {/* The design draws a plain ink pill (nodes 299:1113 and 299:943).
            Swapped for the shared arrow CTA the rest of the site uses, in the
            ink palette — it is the one CTA that sits on the page's own ground
            rather than on photography. */}
        <ArrowFillButton
          btnText="Start a project"
          href="#contact"
          className="cta"
          {...CTA_COLORS_INK}
        />
      </TextReveal>

      <figure className="invite-figure">
        <Image
          src="/images/about-office.jpg"
          alt="Two people working at a long timber desk in a daylit studio lined with shelves"
          fill
          sizes="100vw"
          loading={preloadImage ? "eager" : "lazy"}
          fetchPriority={preloadImage ? "low" : "auto"}
          className="object-cover"
        />
      </figure>
    </section>
  );
}
