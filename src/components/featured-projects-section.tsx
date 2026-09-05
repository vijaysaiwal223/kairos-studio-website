import Image from "next/image";

import { getProject } from "@/lib/projects";

import ArrowFillButton from "@/components/ui/arrow-fill-button";
import { CTA_COLORS } from "@/lib/cta";

import { ArchitectBadge } from "./architect-badge";
import { FeaturedProjectsStage } from "./featured-projects-stage";

/**
 * Featured projects.
 * Figma: "project section", node 88:462
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Untitled?node-id=88-462
 *
 * A full-viewport section pinned for three scroll-scrubbed project slides. All
 * of the motion lives in FeaturedProjectsStage; everything below is static
 * markup so the renders and titles never enter the client bundle. The stage
 * finds the layers it drives through the data-fp-* attributes, so the slide
 * shell — [data-fp-slide] wrapping [data-fp-bg] — must keep its shape.
 *
 * Stacking: the section paints at z-0. Whatever comes after it must be opaque
 * and paint above, so it slides over the stage at 1x while the stage climbs
 * away at 0.5x on unpin. On the homepage that is now SiteFooter, which the
 * root layout renders after every page — so this holds for any page that ends
 * on this section, without one having to be put there on purpose.
 *
 * Content below is the design's own, read from the three "project section"
 * frames (88:462, 101:673, 101:700). Adding or removing an entry is enough on
 * its own — the counter reads off SLIDES.length and the stage takes its pinned
 * height from slideCount, so the scroll range follows automatically.
 *
 * A slide's render is its project's featured.jpg, which is a different frame
 * from the hero.jpg the showcase page opens on. Both live in that project's
 * folder under public/projects/<slug>/.
 */

/**
 * All three architect nodes export the same portrait, so it is stored once.
 * Give a project its own file here when real headshots arrive.
 */
const PORTRAIT = "/images/architect-portrait.png";

const SLIDES = [
  {
    slug: "beneath-jeoji-oreum-house",
    title: "Beneath Jeoji Oreum House",
    architect: {
      name: "A Root Architect",
      base: "JEJU, South Korea",
      portrait: PORTRAIT,
    },
    location: "Jeju, South Korea",
    background: {
      src: "/projects/beneath-jeoji-oreum-house/featured.jpg",
      alt: "Aerial view of a concrete and timber house set among citrus groves",
    },
  },
  {
    slug: "smitskamp-gorssel",
    title: "Smitskamp Gorssel",
    architect: {
      name: "ARC Architect",
      base: "Melbourne, Australia",
      portrait: PORTRAIT,
    },
    location: "Tashkent, Uzbekistan",
    background: {
      src: "/projects/smitskamp-gorssel/featured.jpg",
      alt: "Travertine house with a colonnaded terrace opening onto a lawn",
    },
  },
  {
    slug: "casa-pura-vida",
    title: "Casa Pura Vida",
    architect: {
      name: "Zozaya Arquitectos",
      base: "Madrid, Spain",
      portrait: PORTRAIT,
    },
    location: "Madrid, Spain",
    background: {
      src: "/projects/casa-pura-vida/featured.jpg",
      alt: "Palm-shaded house with a curved timber canopy beside a pool",
    },
  },
];

export function FeaturedProjectsSection() {
  return (
    <FeaturedProjectsStage slideCount={SLIDES.length}>
      {SLIDES.map((slide, index) => (
        <article key={slide.title} data-fp-slide className="fp-slide">
          {/* Background: the only layer inside a slide that ever moves. */}
          <div data-fp-bg className="fp-bg">
            <Image
              src={slide.background.src}
              alt={slide.background.alt}
              fill
              sizes="100vw"
              preload={index === 0}
              className="object-cover"
            />
          </div>

          <div aria-hidden className="fp-scrim" />

          {/* Foreground: zero translation, zero scale — revealed by the clip. */}
          <div className="fp-copy">
            <ArchitectBadge
              name={slide.architect.name}
              base={slide.architect.base}
              portrait={slide.architect.portrait}
            />

            <h2 className="fp-title">{slide.title}</h2>

            {/* Opens the project's showcase page once it has a record in
                src/lib/projects.ts; until then it stays on this section. */}
            <ArrowFillButton
              btnText="Explore full project"
              href={
                getProject(slide.slug) ? `/projects/${slide.slug}` : "#projects"
              }
              className="cta"
              {...CTA_COLORS}
              data-fp-interactive
            />
          </div>

          <p className="fp-meta fp-location">{slide.location}</p>

          <p
            className="fp-meta fp-counter"
            aria-label={`Project ${index + 1} of ${SLIDES.length}`}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden>/</span>
            <span>{String(SLIDES.length).padStart(2, "0")}</span>
          </p>
        </article>
      ))}
    </FeaturedProjectsStage>
  );
}
