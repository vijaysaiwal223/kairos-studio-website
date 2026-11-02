"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { SiteCta } from "@/components/ui/site-cta";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

const STEPS = [
  {
    title: "Design",
    body: "We turn your brief into a clear design direction, shaping spaces around the way you want to live and work.",
    video: "design",
    image: "/home/how-we-work/design-figma.png",
  },
  {
    title: "Permit",
    body: "We coordinate drawings, specialists and approvals so the design is ready for the next stage.",
    video: "permit",
    image: "/home/how-we-work/permit-poster.jpg",
  },
  {
    title: "Construction",
    body: "We keep the team aligned through delivery, protecting the details and intent behind every decision.",
    video: "build",
    image: "/home/how-we-work/build-poster.jpg",
  },
  {
    title: "Move In",
    body: "We guide the final handover and help you settle into a space made for the way you live. We review the finishing details with you, coordinate anything still outstanding and make sure the transition feels as considered as the design itself.",
    video: "movein",
    image: "/home/how-we-work/movein-poster.jpg",
  },
] as const;

const CORNERS = [
  { position: "top-0 left-0", src: "/home/expertise/thumbnail-corner-top-left.svg" },
  { position: "top-0 right-0", src: "/home/expertise/thumbnail-corner-top-right.svg" },
  { position: "bottom-0 left-0", src: "/home/expertise/thumbnail-corner-bottom-left.svg" },
  { position: "bottom-0 right-0", src: "/home/expertise/thumbnail-corner-bottom-right.svg" },
] as const;

type Step = (typeof STEPS)[number];

function StepPanel({ step, index }: { step: Step; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(false);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const syncPlayback = () => {
      if (visible && !reducedMotion.matches && !document.hidden) {
        void video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.2 });

    observer.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [step.video]);

  return (
    <article data-work-step={index + 1} className="relative grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[48px] border-b border-white/10 max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[900px]:gap-0 max-[900px]:pb-[40px]">
      <div className="flex min-h-0 items-center px-[40px] max-[900px]:min-h-[240px] max-[900px]:px-[20px] max-[900px]:py-[40px]">
        <div className="flex w-full items-start gap-[24px]">
          <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-white/8 font-mono text-[14px] leading-[20px] ring-1 ring-white/10">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="m-0 text-[24px] leading-[32px] font-normal tracking-[-0.02em]">{step.title}</h3>
            <p className="mt-[12px] mb-0 text-[16px] leading-[24px] tracking-[-0.02em]">{step.body}</p>
            <SiteCta href="#contact" className="mt-[32px]">Learn more</SiteCta>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 items-center justify-center px-[40px] max-[900px]:px-[20px]">
        <div className="relative aspect-[575/520] h-[min(520px,calc(100svh-380px))] max-w-full border border-white/10 max-[900px]:mx-auto max-[900px]:h-auto max-[900px]:w-full">
          <div className="absolute inset-[24px] overflow-hidden bg-[#fcf7f6]">
            <Image src={step.image} alt="" fill sizes="(max-width: 900px) 100vw, 525px" className="object-cover object-top" />
            <video
              ref={videoRef}
              src={`/home/how-we-work/${step.video}.mp4`}
              muted
              loop
              playsInline
              preload="none"
              poster={step.image}
              onPlaying={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className={`absolute inset-0 h-full w-full bg-[#fcf7f6] object-contain transition-opacity duration-200 motion-reduce:transition-none ${playing ? "opacity-100" : "opacity-0"}`}
              aria-hidden="true"
            />
          </div>
          <Image src="/home/how-we-work/ruler.svg" alt="" width={559} height={519} className="pointer-events-none absolute top-0 left-0 h-auto max-w-full" />
          {CORNERS.map((corner) => (
            <Image key={corner.src} src={corner.src} alt="" width={17} height={17} className={`pointer-events-none absolute ${corner.position}`} />
          ))}
        </div>
      </div>
      <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white/20 max-[900px]:hidden motion-reduce:hidden" aria-hidden="true">
        <span className="absolute top-0 left-0 h-[var(--work-progress,0%)] w-px bg-[#83ff83]" />
        <span className="absolute top-[var(--work-progress,0%)] left-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#83ff83]" />
      </span>
    </article>
  );
}

function WorkHeader() {
  return (
    <header className="relative flex shrink-0 flex-col items-center border-b border-white/10 py-[40px] text-center">
      <GuideRuleBlink className="right-0 bottom-0 left-0 z-[3]" />
      <Eyebrow>How we work</Eyebrow>
      <SplitText tag="h2" id="how-work-heading" className="mt-[12px] mb-0 max-w-[578px] text-[48px] leading-[56px] font-normal tracking-[-0.02em] text-balance max-[600px]:text-[clamp(36px,9vw,48px)] max-[600px]:leading-[1.15]">
        kai.ros here to make difference
      </SplitText>
      <p className="mt-[12px] mb-0 max-w-[578px] text-[16px] leading-[24px] max-[600px]:text-[15px] max-[600px]:leading-[23px]">
        We listen to what you want to build, bring together the expertise it needs and keep every decision moving in the same direction.
      </p>
    </header>
  );
}

/** Figma 125:558 — a split view of each stage of the work. */
export function HowWeWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => window.innerHeight * STEPS.length * 0.65;
      const update = (self: ScrollTrigger) => {
        const index = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
        content.style.setProperty("--work-progress", `${self.progress * 100}%`);
        setActiveIndex((current) => current === index ? current : index);
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        pin: section,
        pinSpacing: true,
        start: "top top",
        end: () => `+=${distance()}`,
        invalidateOnRefresh: true,
        onUpdate: update,
        onRefresh: update,
      });
      const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.cancelAnimationFrame(frame);
        trigger.kill();
        content.style.removeProperty("--work-progress");
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-we-work" className="relative z-[2] bg-[var(--ink-ground)] font-sans text-white min-[901px]:h-svh motion-reduce:h-auto" aria-labelledby="how-work-heading">
      <GuideRailBlinks />
      <div className="pointer-events-none absolute inset-0 hidden min-[901px]:block" aria-hidden="true">
        <span className="absolute inset-y-0 left-[40px] w-px bg-white/10" />
        <span className="absolute top-0 left-[calc(50%-330px)] h-[301px] w-px bg-white/10" />
        <span className="absolute top-0 right-[calc(50%-330px)] h-[301px] w-px bg-white/10" />
        <span className="absolute inset-y-0 right-[40px] w-px bg-white/10" />
      </div>

      <div className="relative mx-[40px] max-[900px]:mx-[20px]">
        <div ref={contentRef} className="flex h-svh flex-col max-[900px]:hidden motion-reduce:hidden">
          <WorkHeader />
          <StepPanel step={STEPS[activeIndex]} index={activeIndex} />
        </div>
        <div className="hidden max-[900px]:block motion-reduce:block">
          <WorkHeader />
          {STEPS.map((step, index) => <StepPanel key={step.title} step={step} index={index} />)}
        </div>
      </div>
    </section>
  );
}
