import Image from "next/image";
import ArrowFillButton from "@/components/ui/arrow-fill-button";
import { CTA_COLORS } from "@/lib/cta";

import { TextReveal } from "./text-reveal";

/**
 * About section.
 * Figma: "ABOUT SECTION", node 152:1203
 *
 * A picture and a column of copy, side by side and centred against each other:
 * 787 and 443 of the 1360 column with 130 between them, which is written below
 * as the shares of that column they are, so the pair holds at any width.
 *
 * The design leaves the frame unfilled, taking the page's own ground. Here it
 * has to be painted on, because this section is what now slides over the
 * pinned featured-projects stage — see the note in featured-projects-section —
 * and a transparent one would let the stage show through it.
 *
 * Carries id="about", which is where the nav and footer "About us" links have
 * been pointing all along.
 */

const BODY =
  "Kai.ros Studio is known for creating bespoke structures that marry architectural elegance with enduring quality. Each project is thoughtfully tailored to its setting and to the lives of those who inhabit it. We invest time in thoroughly understanding our client's lifestyles and functional needs to foster memorable experiences. From initial concept to final detail, the process is intimate and personalized—grounded in listening, dialogue, and a shared vision with every client.";

export function AboutSection() {
  return (
    <section id="about" className="about-section">
      <figure className="about-figure">
        <Image
          src="/images/about-office.jpg"
          alt="Two people working at a long timber desk in a daylit studio lined with shelves"
          fill
          sizes="(max-width: 900px) 100vw, calc((100vw - var(--site-gutter) * 2) * 0.5787)"
          className="object-cover"
        />
      </figure>

      <TextReveal className="about-copy">
        <h2 className="about-label">
          {/* The mark is ornament; it would only be noise read aloud. */}
          <span aria-hidden>✦</span>
          About us
        </h2>

        <p className="about-body">{BODY}</p>

        {/* The design draws a plain white pill here (node 217:1946). Swapped
            for the shared arrow-fill CTA, coloured to this section's ink
            rather than the component's orange default. */}
        <ArrowFillButton
          btnText="Learn more"
          href="/about"
          className="cta"
          {...CTA_COLORS}
        />
      </TextReveal>
    </section>
  );
}
