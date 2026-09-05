"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Interactive leaf of the capabilities section (Figma node 22:376).
 * Owns the only stateful part: which capability is selected.
 *
 * The list and the image sit on opposite sides of the layout but are driven by
 * the same index, so both are rendered here and positioned absolutely into the
 * parent's fixed stage rather than being passed back as slots.
 *
 * Selecting is a tablist rather than a row of buttons: one of N choices, each
 * governing the same panel. That earns arrow-key movement and a roving
 * tabindex, so the group is a single tab stop.
 */

export type Capability = {
  title: string;
  image: { src: string; alt: string };
};

/**
 * Only "Architecture" is specified in the design; its image (node 76:307) is
 * byte-for-byte the project's existing design-04.png, so it is reused rather
 * than re-committed. The other three carry project renders — see the note in
 * capabilities-section.tsx.
 */
const CAPABILITIES: Capability[] = [
  {
    title: "Architecture",
    image: {
      src: "/images/design-04.png",
      alt: "Timber-louvred house with a cantilevered upper storey",
    },
  },
  {
    title: "Interior Design",
    image: {
      src: "/images/design-01.png",
      alt: "Open-tread timber staircase behind a sheer full-height curtain",
    },
  },
  {
    title: "Space Planning",
    image: {
      src: "/images/slide-2.png",
      alt: "Aerial view of a white gabled house and its landscaped grounds",
    },
  },
  {
    title: "Creative Direction",
    image: {
      src: "/images/design-05.png",
      alt: "White rendered house at dusk with a dark timber pivot entrance door",
    },
  },
];

export function CapabilityPicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveTo = (index: number) => {
    const next = (index + CAPABILITIES.length) % CAPABILITIES.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;

    if (step === 0) {
      if (event.key === "Home") moveTo(0);
      else if (event.key === "End") moveTo(CAPABILITIES.length - 1);
      else return;
    } else {
      moveTo(index + step);
    }
    event.preventDefault();
  };

  return (
    // 176px below the intro, and bottom-aligned: the four titles are taller
    // than the image, so both columns finish on one line as the design has it.
    <div className="mt-44 flex w-full items-end justify-between gap-10">
      {/* Panel. Every render is stacked and cross-faded on opacity, the same
          way the hero rail swaps its slides. */}
      <div
        id="capability-panel"
        role="tabpanel"
        aria-labelledby={`capability-tab-${activeIndex}`}
        className="relative h-[300px] w-[500px] max-w-full shrink-0 overflow-hidden rounded-lg"
      >
        {CAPABILITIES.map((capability, index) => (
          <Image
            key={capability.title}
            src={capability.image.src}
            alt={index === activeIndex ? capability.image.alt : ""}
            fill
            sizes="500px"
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Half the gutter box, flushed right: its left edge lands on the
          viewport midline and its right edge on the gutter, which is the
          design's calc(50%-2px) / 682px pair at the 1440px frame. */}
      <div
        role="tablist"
        aria-label="Our capabilities"
        aria-orientation="vertical"
        className="flex w-1/2 shrink-0 flex-col items-start gap-4"
      >
        {CAPABILITIES.map((capability, index) => {
          const isActive = index === activeIndex;
          return (
            <div key={capability.title} className="contents">
              <button
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`capability-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="capability-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={`cursor-pointer text-left text-display-loose font-semibold whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${
                  isActive
                    ? "text-black"
                    : "text-capability-idle hover:text-black/60"
                }`}
              >
                {capability.title}
              </button>

              {/* Zero-height rule drawn on the boundary, per node 76:306, so
                  the four titles and the image share a bottom edge. */}
              <div aria-hidden className="relative h-0 w-full">
                <span className="bg-capability-rule absolute inset-x-0 -top-px block h-px" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
