import Image from "next/image";

import { ArchitectBadge } from "./architect-badge";
import { ImageReveal } from "./image-reveal";
import { TextReveal } from "./text-reveal";
import { HeroVideo } from "./hero-video";
import { ProjectPlans } from "./project-plans";
import { SiteNav } from "./site-nav";
import {
  COLLAGE_FRAME,
  CONTENT_WIDTH,
  type Project,
  type ProjectImage,
  type SpecIconName,
} from "@/lib/projects";

/**
 * The project showcase.
 * Figma: "PROJECT PAGE", node 139:865
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Untitled?node-id=139-865
 *
 * The template every project page is drawn from: hero, overview, plans, plate,
 * gallery, plate, closing. Nothing here is specific to the project the design
 * happens to show — all of it comes in as a Project record, so a second
 * project is a new entry in src/lib/projects.ts and its own asset folder.
 *
 * Geometry lives in the .ps-* block in globals.css; the only measurements
 * below are the ones that vary per project, which is the collage placement.
 * The component is a Server Component and ships no JavaScript of its own —
 * SiteNav is the one client island, as it is on the homepage.
 */

/**
 * Spec-row glyphs, exported from Figma nodes 156:1464, 156:1467, 156:1470,
 * 162:1478 and 156:1473. Path data is the export verbatim.
 *
 * "topology" repeats the calendar drawn for "year": the two nodes carry the
 * same path, so the design shows one glyph twice. Kept as drawn — give it its
 * own path here when the design supplies one.
 */
const SPEC_ICONS: Record<SpecIconName, string> = {
  architects:
    "M0.833008 4.16634C0.833008 3.70611 1.20611 3.33301 1.66634 3.33301H18.333C18.7933 3.33301 19.1663 3.70611 19.1663 4.16634V15.833C19.1663 16.2933 18.7933 16.6663 18.333 16.6663H1.66634C1.20611 16.6663 0.833008 16.2933 0.833008 15.833V4.16634ZM10.833 6.66634V8.33301H15.833V6.66634H10.833ZM14.9997 9.99967H10.833V11.6663H14.9997V9.99967ZM8.74967 8.33301C8.74967 7.18242 7.81693 6.24967 6.66634 6.24967C5.51575 6.24967 4.58301 7.18242 4.58301 8.33301C4.58301 9.48359 5.51575 10.4163 6.66634 10.4163C7.81693 10.4163 8.74967 9.48359 8.74967 8.33301ZM6.66634 11.2497C5.05551 11.2497 3.74967 12.5555 3.74967 14.1663H9.58301C9.58301 12.5555 8.27717 11.2497 6.66634 11.2497Z",
  area: "M12.5 17.5H10.8333V15H9.16667V17.5H7.5V15.8333H5.83333V17.5H3.33333C2.8731 17.5 2.5 17.1269 2.5 16.6667V14.1667H4.16667V12.5H2.5V10.8333H5V9.16667H2.5V7.5H4.16667V5.83333H2.5V3.33333C2.5 2.8731 2.8731 2.5 3.33333 2.5H8.33333C8.79358 2.5 9.16667 2.8731 9.16667 3.33333V10.8333H16.6667C17.1269 10.8333 17.5 11.2064 17.5 11.6667V16.6667C17.5 17.1269 17.1269 17.5 16.6667 17.5H14.1667V15.8333H12.5V17.5Z",
  year: "M14.167 2.49967H17.5003C17.9606 2.49967 18.3337 2.87277 18.3337 3.33301V16.6663C18.3337 17.1266 17.9606 17.4997 17.5003 17.4997H2.50033C2.04009 17.4997 1.66699 17.1266 1.66699 16.6663V3.33301C1.66699 2.87277 2.04009 2.49967 2.50033 2.49967H5.83366V0.833008H7.50033V2.49967H12.5003V0.833008H14.167V2.49967ZM3.33366 7.49967V15.833H16.667V7.49967H3.33366ZM5.00033 9.16634H6.66699V10.833H5.00033V9.16634ZM9.16699 9.16634H10.8337V10.833H9.16699V9.16634ZM13.3337 9.16634H15.0003V10.833H13.3337V9.16634Z",
  topology:
    "M14.167 2.49967H17.5003C17.9606 2.49967 18.3337 2.87277 18.3337 3.33301V16.6663C18.3337 17.1266 17.9606 17.4997 17.5003 17.4997H2.50033C2.04009 17.4997 1.66699 17.1266 1.66699 16.6663V3.33301C1.66699 2.87277 2.04009 2.49967 2.50033 2.49967H5.83366V0.833008H7.50033V2.49967H12.5003V0.833008H14.167V2.49967ZM3.33366 7.49967V15.833H16.667V7.49967H3.33366ZM5.00033 9.16634H6.66699V10.833H5.00033V9.16634ZM9.16699 9.16634H10.8337V10.833H9.16699V9.16634ZM13.3337 9.16634H15.0003V10.833H13.3337V9.16634Z",
  location:
    "M1.66699 4.16699L7.50033 1.66699L12.5003 4.16699L17.7528 1.91591C17.9644 1.82526 18.2093 1.92323 18.3 2.13475C18.3222 2.18662 18.3337 2.24246 18.3337 2.29888V15.8337L12.5003 18.3337L7.50033 15.8337L2.24779 18.0847C2.03628 18.1754 1.79133 18.0774 1.70068 17.8659C1.67845 17.8141 1.66699 17.7582 1.66699 17.7017V4.16699ZM12.5003 16.4702V5.98028L12.4463 6.0034L7.50033 3.53038V14.0204L7.55429 13.9972L12.5003 16.4702Z",
};

function SpecIcon({ name }: { name: SpecIconName }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d={SPEC_ICONS[name]} fill="currentColor" />
    </svg>
  );
}

/** Passes a hand-cropped image's object-position down to the element. */
const cropStyle = (image: ProjectImage) =>
  image.position
    ? ({ "--ps-pos": image.position } as React.CSSProperties)
    : undefined;

/** Two decimals is finer than a pixel at any width this layout is used at. */
const pct = (value: number, of: number) =>
  `${((value / of) * 100).toFixed(4)}%`;

/**
 * Rendered widths, so the browser fetches a plate rather than a full frame.
 * The design's own share of the 1360 column, capped at the viewport below the
 * width where the layout stacks.
 *
 * sizes takes lengths, not percentages, so the column is spelled out: the
 * viewport less the gutter on both sides, times this image's share of it.
 */
const sizesFor = (drawnWidth: number) =>
  `(max-width: 900px) 100vw, calc((100vw - var(--site-gutter) * 2) * ${(
    drawnWidth / CONTENT_WIDTH
  ).toFixed(4)})`;

export function ProjectShowcase({ project }: { project: Project }) {
  return (
    <>
      <main className="ps-page">
        <section className="ps-hero">
          {/* Footage when the project has it, the still on its own
              otherwise. Either way the still is what paints first, so the
              hero is never empty while the loop loads. */}
          <div className="ps-hero-bg" style={cropStyle(project.hero)}>
            {project.hero.video ? (
              /* The hero is a screenful and the clip is a few seconds, so the
                 page is held at the top until it has played rather than
                 letting the first scroll cut it off mid-shot. */
              <HeroVideo
                src={project.hero.video}
                poster={project.hero.src}
                holdScroll
              />
            ) : (
              <Image
                src={project.hero.src}
                alt={project.hero.alt}
                fill
                sizes="100vw"
                preload
                className="object-cover"
              />
            )}
          </div>

          <div aria-hidden className="ps-hero-scrim" />

          <div className="ps-hero-nav">
            <SiteNav />
          </div>

          <div className="ps-hero-copy">
            <ArchitectBadge
              name={project.architect.name}
              base={project.architect.base}
              portrait={project.architect.portrait}
            />

            <TextReveal trigger="load" className="ps-hero-type">
              <h1 className="ps-title">{project.title}</h1>
              <p className="ps-summary">{project.summary}</p>
            </TextReveal>
          </div>
        </section>

        <div className="ps-body">
          <section className="ps-overview">
            {/* Figma draws the facts as rows and rules rather than a table, but
              they are a table: each row is one heading and its one value. */}
            <dl className="ps-specs">
              {project.specs.map((spec) => (
                <div key={spec.label} className="ps-spec-row">
                  <dt className="ps-spec-label">
                    <SpecIcon name={spec.icon} />
                    {spec.label}
                  </dt>
                  <dd className="ps-spec-value">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <TextReveal className="ps-overview-copy">
              <h2 className="ps-overview-heading">
                {project.overview.heading}
              </h2>
              <p className="ps-overview-body">{project.overview.body}</p>
            </TextReveal>
          </section>

          <ProjectPlans drawings={project.plans.drawings} />

          <figure
            className="ps-feature ps-feature-first"
            style={cropStyle(project.features.first)}
          >
            <Image
              src={project.features.first.src}
              alt={project.features.first.alt}
              fill
              sizes={sizesFor(CONTENT_WIDTH)}
              className="object-cover"
              data-image-reveal
            />
          </figure>

          <section className="ps-collage" aria-label="Gallery">
            {project.collage.map((item, index) => (
              <figure
                key={`${item.src}-${index}`}
                className="ps-collage-item"
                style={
                  {
                    "--ps-x": pct(item.x, COLLAGE_FRAME.width),
                    "--ps-y": pct(item.y, COLLAGE_FRAME.height),
                    "--ps-w": pct(item.width, COLLAGE_FRAME.width),
                    "--ps-h": pct(item.height, COLLAGE_FRAME.height),
                    "--ps-ratio": `${item.width} / ${item.height}`,
                  } as React.CSSProperties
                }
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={sizesFor(item.width)}
                  className="object-cover"
                  data-image-reveal
                />
              </figure>
            ))}
          </section>

          <figure
            className="ps-feature ps-feature-second"
            style={cropStyle(project.features.second)}
          >
            <Image
              src={project.features.second.src}
              alt={project.features.second.alt}
              fill
              sizes={sizesFor(CONTENT_WIDTH)}
              className="object-cover"
              data-image-reveal
            />
          </figure>

          <TextReveal className="ps-closing">
            {project.closing.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </TextReveal>
        </div>
      </main>

      {/* Renders nothing. Finds this page's data-image-reveal pictures and
          gives each one its entrance — see the component for why it is mounted
          here rather than wrapped around anything. */}
      <ImageReveal />
    </>
  );
}
