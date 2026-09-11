"use client";

import Image from "next/image";
import { useState } from "react";

import {
  CONTENT_WIDTH,
  EDITORIAL_DRAWINGS,
  type ProjectImage,
} from "@/lib/projects";

/**
 * The drawing stage at the foot of the editorial run.
 * Figma: main frame node 310:1397, rail nodes 310:1399–310:1403.
 *
 * Simpler than the showcase's stage, because the design asks for something
 * simpler: there, the rail holds every drawing *except* the one on show, so
 * picking one is a swap and the two have to be animated past each other. Here
 * the rail holds all of them and the first thumbnail is drawn as a copy of
 * what is showing — so nothing moves, and only the main frame changes.
 *
 * Which leaves the thing the design does not draw: with every drawing in the
 * rail and none of them marked, there is no way to tell which one you are
 * looking at. The active thumbnail is given the page's own ink for its border
 * rather than the drawn grey — the smallest mark that answers it — and carries
 * aria-current, which is what actually answers it for a screen reader.
 */

const { main, rail } = EDITORIAL_DRAWINGS;

/** The rail's three cells and their two gaps come to the drawn 672px. */
const CELL_COUNT = 3;

/** The main frame is loaded at its own share of the column, never the rail's. */
const DRAWING_SIZES = `(max-width: 1200px) 100vw, calc((100vw - var(--site-gutter) * 2) * ${(
  main.width / CONTENT_WIDTH
).toFixed(4)})`;

export function ProjectDrawings({ drawings }: { drawings: ProjectImage[] }) {
  const [active, setActive] = useState(0);
  const shown = drawings[active];

  return (
    <section className="pe-drawings" aria-label="Drawings">
      <figure className="pe-drawing-main">
        <Image
          key={shown.src}
          src={shown.src}
          alt={shown.alt}
          fill
          sizes={DRAWING_SIZES}
          className="object-contain"
          data-image-reveal
        />
      </figure>

      <div className="pe-drawing-rail">
        {drawings.map((drawing, index) => (
          <button
            key={drawing.src}
            type="button"
            className="pe-drawing-thumb"
            aria-current={index === active ? "true" : undefined}
            aria-label={`Show ${drawing.alt}`}
            onClick={() => setActive(index)}
          >
            <Image
              src={drawing.src}
              alt=""
              fill
              sizes={`(max-width: 1200px) 33vw, calc((100vw - var(--site-gutter) * 2) * ${(
                rail.width / CELL_COUNT / CONTENT_WIDTH
              ).toFixed(4)})`}
              className="object-contain"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
