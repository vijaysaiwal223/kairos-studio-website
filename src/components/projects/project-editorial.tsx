import Image from "next/image";

import {
  CONTENT_WIDTH,
  EDITORIAL_FRAME,
  type EditorialProject,
} from "@/data/projects";

import { ArchitectBadge } from "./architect-badge";
import { HeroSequence } from "./hero-sequence";
import { ImageReveal } from "../motion/image-reveal";
import { SiteInvitation } from "../site/site-invitation";
import { TextReveal } from "../motion/text-reveal";
import ScrollReveal from "../ui/scroll-reveal";

/**
 * The editorial project page.
 * Figma: "PROJECT PAGE", node 299:948
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Website?node-id=299-948
 *
 * The site's second project template, and a different page from the showcase
 * rather than a restyling of it: the hero carries a typology, the facts are a
 * strip over the site outline instead of a table, the body is one hand-placed
 * run of photographs and paragraphs, and the page ends on an invitation
 * rather than closing copy.
 *
 * Nothing below is specific to House Klaus. All of it arrives as an
 * EditorialProject, so a second project on this template is a record in
 * src/data/projects.ts and its own folder under public/projects/<slug>/.
 *
 * Geometry lives in the .pe-* block in globals.css; the only measurements here
 * are the ones that vary per project, which is where the run's blocks are
 * placed. The page itself remains a Server Component.
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
      <main className="pe-page  [background:var(--background)] [color:var(--foreground)]">
        {/* With a frame sequence the hero is a tall track and the stage
            sticks to the top of it while the shot is scrubbed; without one the
            track is a single screenful and the stage simply fills it. Either
            way the stage is what carries the picture and the copy, so
            nothing below has to know which of the two it is. */}
        <section
          className={
            project.hero.sequence ? "pe-hero pe-hero--scrub  [position:relative] [height:100svh] max-[1200px]:[height:640px] [height:calc(var(--pe-track,_3)_*_100svh)] motion-reduce:[height:100svh]" : "pe-hero  [position:relative] [height:100svh] max-[1200px]:[height:640px]"
          }
          style={
            project.hero.sequence
              ? ({
                  "--pe-track": `${project.hero.sequence.track}`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <div className="pe-hero-stage  [position:sticky] [top:0] [height:100svh] [overflow:hidden] [isolation:isolate] [background:#000] max-[1200px]:[height:640px]">
            <div className="pe-hero-bg  [position:absolute] [inset:0]">
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
            <div aria-hidden className="pe-hero-scrim  [position:absolute] [inset:0] [background:linear-gradient(to_bottom,_rgba(0,_0,_0,_0)_50.373%,_#000)]" />

            <div className="pe-hero-foot  [position:absolute] [inset-inline:0] [bottom:112px] [z-index:1] [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:40px] [padding:var(--site-gutter)] [color:#fff] max-[1200px]:[flex-direction:column] max-[1200px]:[align-items:flex-start] max-[1200px]:[gap:24px]">
              <div className="pe-hero-copy  [display:flex] [width:40.9559%] [min-width:0] [flex-direction:column] [align-items:flex-start] [gap:12px] max-[1200px]:[width:100%]">
                <ArchitectBadge
                  name={project.architect.name}
                  base={project.architect.base}
                  portrait={project.architect.portrait}
                />

                <TextReveal trigger="load" className="pe-hero-type  [display:flex] [width:100%] [flex-direction:column] [gap:12px]">
                  <h1 className="pe-title  [font-size:var(--type-headline)] [line-height:var(--type-headline-lh)] [font-weight:700] [letter-spacing:-0.8px]">{project.title}</h1>
                  <p className="pe-summary  [font-size:var(--type-body)] [line-height:var(--type-body-lh)] [letter-spacing:-0.32px]">{project.summary}</p>
                </TextReveal>
              </div>

              <p className="pe-typology  [flex:none] [font-size:var(--type-subhead)] [line-height:28px] [letter-spacing:-0.4px] [color:var(--hero-subtext)]">{project.typology}</p>
            </div>
          </div>
        </section>

        {/* Node 346:2. The design draws the five values and no labels, over
            the outline of the site. The labels are supplied anyway and hidden,
            because "480 m²" read out on its own says nothing. */}
        <section className="pe-facts  [position:relative] [padding:200px_var(--site-gutter)] [overflow:clip] max-[1200px]:[padding-block:96px]" aria-label="Project facts">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.siteOutline}
            alt=""
            aria-hidden
            width={320}
            height={268}
            loading="eager"
            fetchPriority="low"
            className="pe-facts-outline  [position:absolute] [top:104px] [left:40.1%] [width:320px] [height:268px] max-[1200px]:[display:none]"
          />

          <dl className="pe-facts-list  [position:relative] [z-index:1] [display:flex] [justify-content:space-between] [gap:24px] [margin:0] [font-size:var(--type-fact)] [line-height:var(--type-fact-lh)] [color:var(--foreground)] max-[1200px]:[flex-wrap:wrap] max-[1200px]:[justify-content:flex-start] max-[1200px]:[gap:16px_32px]">
            {project.facts.map((fact) => (
              <div key={fact.label} className="pe-fact  [&_dd]:[margin:0]">
                <dt className="sr-only  [position:absolute] [width:1px] [height:1px] [padding:0] [margin:-1px] [overflow:hidden] [clip-path:inset(50%)] [white-space:nowrap] [border:0]">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Node 299:987. One box, everything placed inside it — see the note
            on EDITORIAL_FRAME for why the copy is pinned by its last line. */}
        <div className="pe-run  [position:relative] [margin-inline:var(--site-gutter)] [aspect-ratio:1360_/_4840] max-[1200px]:[display:flex] max-[1200px]:[aspect-ratio:auto] max-[1200px]:[flex-direction:column] max-[1200px]:[gap:64px]">
          {project.blocks.map((block, index) =>
            block.kind === "plate" ? (
              <figure
                key={`${block.src}-${index}`}
                className="pe-plate  [position:absolute] [left:var(--pe-x)] [top:var(--pe-y)] [width:var(--pe-w)] [height:var(--pe-h)] [overflow:hidden] [&_>_img]:[object-position:var(--pe-pos,_50%_50%)] max-[1200px]:[position:relative] max-[1200px]:[width:100%] max-[1200px]:[height:auto] max-[1200px]:[aspect-ratio:var(--pe-ratio)]"
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
                className="pe-copy  [position:absolute] [left:var(--pe-x)] [bottom:var(--pe-b)] [width:var(--pe-w)] max-[1200px]:[position:static] max-[1200px]:[width:100%] max-[1200px]:[height:auto]"
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
                    containerClassName="pe-copy-heading  [margin-bottom:12px] [font-size:var(--type-lead)] [line-height:var(--type-lead-lh)] [font-weight:700] [letter-spacing:-0.48px] [color:var(--foreground)]"
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
                  containerClassName="pe-copy-body  [font-size:var(--type-body)] [line-height:var(--type-body-lh)] [letter-spacing:-0.32px] [color:var(--editorial-copy)]"
                >
                  {block.body}
                </ScrollReveal>
              </div>
            ),
          )}
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
