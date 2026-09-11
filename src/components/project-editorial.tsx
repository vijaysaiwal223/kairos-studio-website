import Image from "next/image";

import {
  CONTENT_WIDTH,
  EDITORIAL_DRAWINGS,
  EDITORIAL_FRAME,
  type EditorialProject,
} from "@/lib/projects";

import { ArchitectBadge } from "./architect-badge";
import { HeroSequence } from "./hero-sequence";
import { ImageReveal } from "./image-reveal";
import { ProjectDrawings } from "./project-drawings";
import { SiteInvitation } from "./site-invitation";
import { SiteNav } from "./site-nav";
import { TextReveal } from "./text-reveal";
import ScrollReveal from "./ui/scroll-reveal";

/**
 * The editorial project page.
 * Figma: "PROJECT PAGE", node 299:948
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Website?node-id=299-948
 *
 * The site's second project template, and a different page from the showcase
 * rather than a restyling of it: the hero carries a typology, the facts are a
 * strip over the site outline instead of a table, the body is one hand-placed
 * run of photographs and paragraphs, the drawings sit in a horizontal rail,
 * and the page ends on an invitation rather than closing copy.
 *
 * Nothing below is specific to House Klaus. All of it arrives as an
 * EditorialProject, so a second project on this template is a record in
 * src/lib/projects.ts and its own folder under public/projects/<slug>/.
 *
 * Geometry lives in the .pe-* block in globals.css; the only measurements here
 * are the ones that vary per project, which is where the run's blocks are
 * placed. A Server Component that ships no JavaScript of its own beyond the
 * two client islands it mounts — the nav and the drawing rail.
 */

/** Two decimals is finer than a pixel at any width this layout is used at. */
const pct = (value: number, of: number) =>
  `${((value / of) * 100).toFixed(4)}%`;

/**
 * Rendered widths, so the browser fetches a plate rather than a full frame:
 * this image's drawn share of the 1360 column, capped at the viewport below
 * the width where the run stops being a drawing and stacks.
 *
 * sizes takes lengths rather than percentages, so the column is spelled out —
 * the viewport less the gutter on both sides, times that share.
 */
const sizesFor = (drawnWidth: number) =>
  `(max-width: 1200px) 100vw, calc((100vw - var(--site-gutter) * 2) * ${(
    drawnWidth / CONTENT_WIDTH
  ).toFixed(4)})`;

export function ProjectEditorial({ project }: { project: EditorialProject }) {
  return (
    <>
      <main className="pe-page">
        {/* With a frame sequence the hero is a tall track and the stage
            sticks to the top of it while the shot is scrubbed; without one the
            track is a single screenful and the stage simply fills it. Either
            way the stage is what carries the picture, the nav and the copy, so
            nothing below has to know which of the two it is. */}
        <section
          className={
            project.hero.sequence ? "pe-hero pe-hero--scrub" : "pe-hero"
          }
          style={
            project.hero.sequence
              ? ({
                  "--pe-track": `${project.hero.sequence.track}`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <div className="pe-hero-stage">
            <div className="pe-hero-bg">
              {project.hero.sequence ? (
                <HeroSequence
                  dir={project.hero.sequence.dir}
                  count={project.hero.sequence.count}
                  poster={project.hero.src}
                  alt={project.hero.alt}
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

            {/* Node 299:951: transparent to black, and only over the bottom
                half — the copy sits on the floor of the frame, so that is the
                only part of the photograph that has to carry type. */}
            <div aria-hidden className="pe-hero-scrim" />

            <div className="pe-hero-nav">
              <SiteNav />
            </div>

            <div className="pe-hero-foot">
              <div className="pe-hero-copy">
                <ArchitectBadge
                  name={project.architect.name}
                  base={project.architect.base}
                  portrait={project.architect.portrait}
                />

                <TextReveal trigger="load" className="pe-hero-type">
                  <h1 className="pe-title">{project.title}</h1>
                  <p className="pe-summary">{project.summary}</p>
                </TextReveal>
              </div>

              <p className="pe-typology">{project.typology}</p>
            </div>
          </div>
        </section>

        {/* Node 346:2. The design draws the five values and no labels, over
            the outline of the site. The labels are supplied anyway and hidden,
            because "480 m²" read out on its own says nothing. */}
        <section className="pe-facts" aria-label="Project facts">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.siteOutline}
            alt=""
            aria-hidden
            width={320}
            height={268}
            loading="eager"
            fetchPriority="low"
            className="pe-facts-outline"
          />

          <dl className="pe-facts-list">
            {project.facts.map((fact) => (
              <div key={fact.label} className="pe-fact">
                <dt className="sr-only">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Node 299:987. One box, everything placed inside it — see the note
            on EDITORIAL_FRAME for why the copy is pinned by its last line. */}
        <div className="pe-run">
          {project.blocks.map((block, index) =>
            block.kind === "plate" ? (
              <figure
                key={`${block.src}-${index}`}
                className="pe-plate"
                style={
                  {
                    "--pe-x": pct(block.x, EDITORIAL_FRAME.width),
                    "--pe-y": pct(block.y, EDITORIAL_FRAME.height),
                    "--pe-w": pct(block.width, EDITORIAL_FRAME.width),
                    "--pe-h": pct(block.height, EDITORIAL_FRAME.height),
                    "--pe-ratio": `${block.width} / ${block.height}`,
                    ...(block.position ? { "--pe-pos": block.position } : {}),
                  } as React.CSSProperties
                }
              >
                <Image
                  src={block.src}
                  alt={block.alt}
                  fill
                  sizes={sizesFor(block.width)}
                  loading="eager"
                  fetchPriority="low"
                  className={block.contain ? "object-contain" : "object-cover"}
                  data-image-reveal
                />
              </figure>
            ) : (
              <div
                key={`copy-${index}`}
                className="pe-copy"
                style={
                  {
                    "--pe-x": pct(block.x, EDITORIAL_FRAME.width),
                    "--pe-b": pct(
                      EDITORIAL_FRAME.height - block.bottom,
                      EDITORIAL_FRAME.height,
                    ),
                    "--pe-w": pct(block.width, EDITORIAL_FRAME.width),
                  } as React.CSSProperties
                }
              >
                {block.heading ? (
                  <ScrollReveal
                    rotationEnd="top 54%"
                    wordAnimationEnd="center 54%"
                    containerClassName="pe-copy-heading"
                  >
                    {block.heading}
                  </ScrollReveal>
                ) : null}
                <ScrollReveal
                  as="p"
                  baseOpacity={0.16}
                  baseRotation={1}
                  blurStrength={3}
                  rotationEnd="top 58%"
                  wordAnimationEnd="bottom 42%"
                  containerClassName="pe-copy-body"
                >
                  {block.body}
                </ScrollReveal>
              </div>
            ),
          )}

          {/* Placed on the same frame as everything else in the run, so the
              stage stays where it was drawn rather than following the run's
              last photograph. */}
          <div
            className="pe-drawings-slot"
            style={
              {
                "--pe-x": pct(EDITORIAL_DRAWINGS.main.x, EDITORIAL_FRAME.width),
                "--pe-y": pct(
                  EDITORIAL_DRAWINGS.main.y,
                  EDITORIAL_FRAME.height,
                ),
                "--pe-w": pct(
                  EDITORIAL_DRAWINGS.main.width,
                  EDITORIAL_FRAME.width,
                ),
                "--pe-h": pct(
                  EDITORIAL_DRAWINGS.rail.y +
                    EDITORIAL_DRAWINGS.rail.height -
                    EDITORIAL_DRAWINGS.main.y,
                  EDITORIAL_FRAME.height,
                ),
              } as React.CSSProperties
            }
          >
            <ProjectDrawings drawings={project.drawings} />
          </div>
        </div>

        {/* Node 299:1108. The same section the home page ends on, so it is
            shared rather than written twice. */}
        <SiteInvitation preloadImage />

      </main>

      {/* Renders nothing. Finds this page's data-image-reveal pictures and
          gives each one its entrance. */}
      <ImageReveal />
    </>
  );
}
