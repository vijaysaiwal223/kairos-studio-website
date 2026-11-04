"use client";

import Image from "next/image";

import { StoryboardControls, useStoryboardPlayback } from "@/components/sandbox/storyboard-playback";

const steps = ["Sketch", "Shape", "Concept"] as const;
const durations = [3500, 4000, 5000];
const images = [
  { src: "/sandbox/concept-design/sketch.png", alt: "Isometric floor plan of the house" },
  { src: "/sandbox/concept-design/shape.png", alt: "The same house as an open architectural massing model" },
  { src: "/sandbox/concept-design/concept.png", alt: "The completed architectural concept model" },
] as const;

/** Step 05: three Blender renders share one model and one fixed camera. */
export function ConceptDesignBento() {
  const { tileRef, phase, playing, select, toggle } = useStoryboardPlayback(durations);

  return (
    <div className="w-[500px] shrink-0">
      <div
        ref={tileRef}
        role="img"
        aria-label={`Concept design: ${steps[phase]}`}
        className="relative size-[500px] overflow-hidden border border-white/10 bg-[#242625] text-white"
      >
        <div className="pointer-events-none absolute inset-0 opacity-65 [background-image:linear-gradient(#ffffff0a_1px,transparent_1px),linear-gradient(90deg,#ffffff0a_1px,transparent_1px)] [background-size:25px_25px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_26%,#10121188_100%)]" />

        {images.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            sizes="500px"
            loading="eager"
            unoptimized
            className={`pointer-events-none object-contain transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${phase === index ? "translate-y-0 scale-100 opacity-100 blur-0" : index < phase ? "-translate-y-[10px] scale-[1.015] opacity-0 blur-[2px]" : "translate-y-[13px] scale-[.98] opacity-0 blur-[2px]"}`}
          />
        ))}

        <p className="absolute top-[29px] left-[33px] z-10 font-mono text-[15px] tracking-[0.13em] text-white/85 uppercase">
          0{phase + 1}&nbsp; {steps[phase]}
        </p>
      </div>
      <StoryboardControls steps={steps} phase={phase} playing={playing} onSelect={select} onToggle={toggle} />
    </div>
  );
}
