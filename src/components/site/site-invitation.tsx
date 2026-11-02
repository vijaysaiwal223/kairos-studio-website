import Image from "next/image";

import ScrollReveal from "@/components/ui/scroll-reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
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
    <section id="contact" className="invite  [display:flex] [flex-direction:column] [align-items:center] [padding-top:120px] max-[1200px]:[padding-top:96px] [background:var(--background)] [color:var(--foreground)]">
      <TextReveal className="invite-copy  [display:flex] [width:700px] [max-width:calc(100%_-_var(--site-gutter)_*_2)] [flex-direction:column] [align-items:center] [gap:12px] [text-align:center]">
        <Eyebrow>Start a conversation</Eyebrow>
        <ScrollReveal
          rotationEnd="top 52%"
          wordAnimationEnd="center 52%"
          containerClassName="invite-heading  [font-size:var(--type-headline)] [line-height:var(--type-headline-lh)] [font-weight:600] [letter-spacing:-0.04em] [color:var(--foreground)]"
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
          containerClassName="invite-body  [font-size:var(--type-body)] [line-height:1.55] [letter-spacing:0] [color:var(--editorial-copy)]"
        >
          Tell us about your site, your goals and where you are in the process.
          We will help define the right team and the next clear step.
        </ScrollReveal>

        {showCta && (
          <SiteCta className="site-cta--invitation  [width:max-content] [padding-right:16px] [&:is(:hover,_:focus-visible)]:[width:max-content] [&:is(:hover,_:focus-visible)]:[padding-right:16px]" href="mailto:hello@kairostudios.in?subject=Project%20enquiry">
            Discuss your project
          </SiteCta>
        )}
      </TextReveal>

      <figure className="invite-figure  [position:relative] [width:100%] [margin-top:120px] [aspect-ratio:1440_/_466] max-[1200px]:[margin-top:96px] max-[1200px]:[aspect-ratio:3_/_2]">
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
