"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";

const projects = [
  {
    name: "Casa Villa",
    category: "Residential",
    architect: "ZZ Architect",
    image: "/home/portfolio/casa-villa-figma.webp",
    alt: "Sunlit double-height living room at Casa Villa",
    href: null,
  },
  {
    name: "Casa Pura Vida",
    category: "Residential",
    architect: "kai.ros Studio",
    image: "/projects/casa-pura-vida/gallery-01.jpg",
    alt: "Casa Pura Vida architecture and its tropical setting",
    href: "/projects/casa-pura-vida",
  },
  {
    name: "House Klaus",
    category: "Residential",
    architect: "kai.ros Studio",
    image: "/projects/house-klaus/outdoor-living.jpg",
    alt: "House Klaus living space opening toward the coast",
    href: "/projects/house-klaus",
  },
] as const;

const corners = [
  "left-0 top-0 border-l border-t",
  "right-0 top-0 border-r border-t",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
] as const;

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`size-6 ${direction === "left" ? "rotate-180" : ""}`}>
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Swap = { from: number; direction: "previous" | "next"; id: number };

function ProjectCard({ index, featured, onSelect, previousIndex, swap, onSwapEnd }: {
  index: number;
  featured: boolean;
  onSelect?: () => void;
  previousIndex?: number;
  swap?: Swap | null;
  onSwapEnd?: () => void;
}) {
  const project = projects[index];
  const enterAnimation = swap?.direction === "next" ? "animate-[project-image-enter-next_460ms_ease-out_both]" : "animate-[project-image-enter-previous_460ms_ease-out_both]";
  const exitAnimation = swap?.direction === "next" ? "animate-[project-image-exit-next_460ms_ease-out_both]" : "animate-[project-image-exit-previous_460ms_ease-out_both]";
  const content = (
    <>
      <div className="absolute inset-[16px] overflow-hidden max-[700px]:inset-[12px]">
        <Image
          key={`${index}-${swap?.id ?? "still"}`}
          src={project.image}
          alt={featured ? project.alt : ""}
          fill
          sizes={featured ? "(max-width: 700px) 85vw, 600px" : "427px"}
          className={`object-cover object-center ${swap ? enterAnimation : ""}`}
          priority={featured && index === 0}
        />
        {swap && previousIndex !== undefined && (
          <span
            key={swap.id}
            aria-hidden="true"
            onAnimationEnd={onSwapEnd}
            className={`pointer-events-none absolute inset-0 ${exitAnimation}`}
          >
            <Image src={projects[previousIndex].image} alt="" fill sizes={featured ? "(max-width: 700px) 85vw, 600px" : "427px"} className="object-cover object-center" />
          </span>
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
        <div className="absolute left-[16px] top-[10px] flex flex-wrap gap-[8px] font-[family-name:var(--font-geist-mono)] text-[14px] leading-[24px] tracking-[1px] uppercase max-[700px]:left-[10px] max-[700px]:top-[8px] max-[700px]:text-[10px]">
          <span className="rounded-full bg-[#1a1a1acc] px-[12px] py-[4px]">{project.category}</span>
          {featured && <span className="rounded-full bg-[#1a1a1acc] px-[12px] py-[4px]">{project.architect}</span>}
        </div>
        <span className={`absolute bottom-[16px] left-[16px] tracking-[-0.02em] ${featured ? "text-[32px] leading-[40px]" : "text-[24px] leading-[29px]"} max-[700px]:bottom-[10px] max-[700px]:left-[10px] max-[700px]:text-[24px]`}>
          {project.name}
        </span>
      </div>
      {corners.map((corner) => (
        <span key={corner} aria-hidden="true" className={`pointer-events-none absolute size-[16px] border-[#FF9152] ${corner} max-[700px]:size-[12px]`} />
      ))}
    </>
  );

  const frame = `relative block shrink-0 border border-white/10 bg-white/10 text-left text-white ${featured ? "h-[482px] w-[634px] max-[700px]:h-auto max-[700px]:w-[calc(100vw-80px)] max-[700px]:aspect-[634/482] max-[480px]:w-[calc(100vw-56px)]" : "h-[343px] w-[450px] opacity-35 transition-opacity duration-200 hover:opacity-60 max-[700px]:hidden"}`;

  if (featured) {
    if (project.href) {
      return <Link href={project.href} aria-label={`View ${project.name} project`} className={`${frame} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF9152]`}>{content}</Link>;
    }
    return <div aria-label={`${project.name} featured project`} className={frame}>{content}</div>;
  }

  return <button type="button" onClick={onSelect} aria-label={`Show ${project.name} project`} className={`${frame} cursor-pointer`}>{content}</button>;
}

function ProjectStrip({ active, swap, onSelect, onSwapEnd }: {
  active: number;
  swap: Swap | null;
  onSelect: (index: number, direction: "previous" | "next") => void;
  onSwapEnd: () => void;
}) {
  const previous = (active - 1 + projects.length) % projects.length;
  const next = (active + 1) % projects.length;

  return (
    <div className="flex w-max items-center justify-center gap-[16px]">
      <ProjectCard index={previous} featured={false} previousIndex={swap ? (swap.from - 1 + projects.length) % projects.length : undefined} swap={swap} onSelect={() => onSelect(previous, "previous")} />
      <ProjectCard index={active} featured previousIndex={swap?.from} swap={swap} onSwapEnd={onSwapEnd} />
      <ProjectCard index={next} featured={false} previousIndex={swap ? (swap.from + 1) % projects.length : undefined} swap={swap} onSelect={() => onSelect(next, "next")} />
    </div>
  );
}

export function ProjectGallery() {
  const [active, setActive] = useState(0);
  const swapId = useRef(0);
  const [transition, setTransition] = useState<Swap | null>(null);
  const previous = (active - 1 + projects.length) % projects.length;
  const next = (active + 1) % projects.length;

  const selectProject = (index: number, direction: "previous" | "next") => {
    if (index === active) return;
    swapId.current += 1;
    setTransition(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? null : { from: active, direction, id: swapId.current });
    setActive(index);
  };

  return (
    <section id="project-gallery" aria-labelledby="project-gallery-title" className="relative bg-[#1a1a1a] px-[40px] font-[family-name:var(--font-geist)] text-white max-[700px]:px-[20px]">
      <GuideRailBlinks />
      <div className="overflow-hidden border-x border-white/10">
        <div className="relative flex items-center justify-center border-b border-white/10 px-[20px] py-[40px] text-center">
          <GuideRuleBlink className="right-0 bottom-0 left-0 z-[3]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[660px] -translate-x-1/2 border-x border-white/10 max-[700px]:hidden" />
          <div className="relative z-10 flex max-w-[660px] flex-col items-center">
            <span className="inline-flex h-[36px] items-center gap-[12px] rounded-[8px] border border-white/10 bg-white/8 px-[8px] font-[family-name:var(--font-geist-mono)] text-[14px] leading-[20px] tracking-[0.12em] uppercase">
              <span aria-hidden="true" className="size-[8px] bg-white" />
              Featured Projects
            </span>
            <SplitText tag="h2" id="project-gallery-title" className="mt-[12px] max-w-[578px] text-[48px] leading-[56px] font-normal tracking-[-0.02em] max-[700px]:text-[38px] max-[700px]:leading-[44px] max-[480px]:text-[32px] max-[480px]:leading-[38px]">
              kai.ros here to<br className="max-[480px]:hidden" /> make difference
            </SplitText>
            <p className="mt-[12px] max-w-[620px] text-[16px] leading-[24px] max-[480px]:text-[14px] max-[480px]:leading-[21px]">
              We listen to what you want to build, bring together the expertise it needs and keep every decision moving in the same direction.
            </p>
          </div>
        </div>

        <div className="flex h-[635px] flex-col items-center justify-end gap-[24px] overflow-hidden pb-[40px] max-[700px]:h-auto max-[700px]:py-[40px]">
          <ProjectStrip
            active={active}
            swap={transition}
            onSelect={selectProject}
            onSwapEnd={() => setTransition((current) => current?.id === transition?.id ? null : current)}
          />
          <div className="flex h-[48px] w-[320px] items-center justify-between rounded-[8px] bg-[#111] p-[4px] max-[480px]:w-[min(320px,calc(100vw-56px))]">
            <button type="button" onClick={() => selectProject(previous, "previous")} aria-label="Previous project" className="flex size-[40px] items-center justify-center rounded-[8px] bg-[#212121] transition-colors hover:bg-[#313131] focus-visible:outline-2 focus-visible:outline-[#FF9152]">
              <Arrow direction="left" />
            </button>
            <span key={active} aria-live="polite" className="min-w-0 animate-[project-title-enter_360ms_ease-out_both] truncate text-[24px] leading-[32px] tracking-[-0.02em] motion-reduce:animate-none">{projects[active].name}</span>
            <button type="button" onClick={() => selectProject(next, "next")} aria-label="Next project" className="flex size-[40px] items-center justify-center rounded-[8px] bg-[#212121] transition-colors hover:bg-[#313131] focus-visible:outline-2 focus-visible:outline-[#FF9152]">
              <Arrow direction="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
