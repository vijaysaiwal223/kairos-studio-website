import Image from "next/image";

import ScrollReveal from "@/components/ui/scroll-reveal";
import { SiteCta } from "@/components/ui/site-cta";

import { TextReveal } from "../motion/text-reveal";

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
export function SiteInvitation({
  preloadImage = false,
  showCta = true,
}: {
  preloadImage?: boolean;
  showCta?: boolean;
}) {
  return (
    <section id="contact" className="invite">
      <TextReveal className="invite-copy">
        <p className="invite-eyebrow">Start a conversation</p>
        <ScrollReveal
          rotationEnd="top 52%"
          wordAnimationEnd="center 52%"
          containerClassName="invite-heading"
        >
          Bring us your brief.
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
          Tell us about your site, your goals and where you are in the process.
          We will help define the right team and the next clear step.
        </ScrollReveal>

        {showCta && (
          <SiteCta className="site-cta--invitation" href="mailto:mail@kairos.studio?subject=Project%20enquiry">
            Discuss your project
          </SiteCta>
        )}
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
