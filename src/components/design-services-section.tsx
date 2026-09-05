import Image from "next/image";
import { ScatterReveal } from "./scatter-reveal";

/**
 * "High-end interiors & exteriors Design" section.
 * Figma: "section", node 12:156
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Untitled?node-id=12-156
 *
 * The design is a fixed 1440x800 composition with five photos pinned at
 * absolute coordinates, two of which deliberately bleed past the composition
 * (04 above the top, 05 below the bottom).
 *
 * The section is a full 100dvh and the 1440x800 stage sits centred inside it,
 * so those two photos now bleed against the viewport edge rather than an
 * 800px boundary: they crop on short viewports and sit fully visible on tall
 * ones.
 *
 * As the section scrolls through the viewport the photos travel out from the
 * middle of the stage to those pinned positions while the copy fades in, driven
 * by the scrubbed GSAP timeline in scatter-reveal.tsx. Each photo carries its
 * own data-scatter-x/y: the vector from its resting spot back to the centre,
 * which is exactly where the Figma "start" board (52:244) stacks them.
 *
 * Array order is the Figma paint order (05, 04, 03, 02, 01), so photo 01 sits
 * on top of the stack in the start state exactly as the board shows.
 */

const STAGE_WIDTH = 1440;
const STAGE_HEIGHT = 800;
const PHOTO_WIDTH = 160;
const PHOTO_HEIGHT = 200;

const SCATTERED_PHOTOS = [
  {
    src: "/images/design-05.png",
    alt: "White minimalist villa with a paved path and landscaped lawn",
    left: 219,
    top: 626,
  },
  {
    src: "/images/design-04.png",
    alt: "Timber and glass house with a curved roof seen across the garden",
    left: 379,
    top: -46,
  },
  {
    src: "/images/design-03.png",
    alt: "Corner house with a folded timber facade and hanging planting",
    left: 1129,
    top: 560,
  },
  {
    src: "/images/design-02.png",
    alt: "Modern house at dusk with a warm lit timber facade",
    left: 118,
    top: 234,
  },
  {
    src: "/images/design-01.png",
    alt: "Timber staircase in a double height interior behind sheer curtains",
    left: 1049,
    top: 106,
  },
];

export function DesignServicesSection() {
  return (
    <ScatterReveal className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-white">
      <noscript>
        <style>{`[data-scatter-item],[data-reveal-item]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <div className="relative h-[800px] w-[1440px] shrink-0">
        {SCATTERED_PHOTOS.map((photo) => (
          <div
            key={photo.src}
            data-scatter-item
            data-scatter-x={STAGE_WIDTH / 2 - photo.left - PHOTO_WIDTH / 2}
            data-scatter-y={STAGE_HEIGHT / 2 - photo.top - PHOTO_HEIGHT / 2}
            className="absolute h-[200px] w-[160px] overflow-hidden rounded-xl"
            style={{ left: `${photo.left}px`, top: `${photo.top}px` }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        ))}

        <h2 className="absolute top-[200px] left-[434px] flex w-[573px] flex-col items-start text-center">
          <span
            data-reveal-item
            className="text-heading-ink mb-[-32px] w-full text-display font-semibold uppercase"
          >
            high-end interiors &amp; exteriors
          </span>
          <span
            data-reveal-item
            className="font-script text-script-gold w-full text-script"
          >
            Design
          </span>
        </h2>

        <p
          data-reveal-item
          className="text-body-muted absolute top-[568px] left-[420px] w-[600px] text-center text-lead font-medium"
        >
          Kairos studio offers a full range of bespoke interior design services
          — from initial concept and aesthetic counselling to coordination,
          execution and magazine-worthy finishing touches.
        </p>
      </div>
    </ScatterReveal>
  );
}
