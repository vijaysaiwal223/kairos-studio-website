"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";

const STORY = [
  {
    title: "Vision",
    image: "/home/story/vision-114-214.png",
    body: "We believe better spaces emerge when the right ideas, people and expertise come together around one shared vision.",
  },
  {
    title: "Mission",
    image: "/home/story/mission.png",
    body: "We connect clients with exceptional architects and specialists, then guide the journey from the first conversation to the finished space.",
  },
  {
    title: "Strategy",
    image: "/home/story/strategy.png",
    body: "We listen closely, define a clear direction and coordinate every decision with care, so ambition becomes a place people can feel.",
  },
] as const;

/** Figma 114:214, 113:204, 113:195 — three views of one scroll-led story. */
export function KairosStory() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const labels = scroll.querySelector<HTMLElement>("[data-story-labels]");
    const rule = scroll.querySelector<HTMLElement>("[data-story-progress]");
    const images = Array.from(scroll.querySelectorAll<HTMLElement>("[data-story-image]"));
    const names = Array.from(scroll.querySelectorAll<HTMLElement>("[data-story-name]"));
    const copies = Array.from(scroll.querySelectorAll<HTMLElement>("[data-story-copy]"));
    if (!labels || !rule || images.length !== 3 || names.length !== 3 || copies.length !== 3) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const offsets = [180, 84, 0];
      const paint = (progress: number) => {
        const position = progress * (STORY.length - 1);
        const lower = Math.min(Math.floor(position), STORY.length - 1);
        const upper = Math.min(lower + 1, STORY.length - 1);
        const fraction = position - lower;
        const labelOffset = offsets[lower] + (offsets[upper] - offsets[lower]) * fraction;

        gsap.set(labels, { y: labelOffset });
        gsap.set(rule, { scaleX: 0.35 + 0.65 * progress });

        images.forEach((image, index) => {
          gsap.set(image, { opacity: Math.max(0, 1 - Math.abs(position - index)) });
        });
        names.forEach((name, index) => {
          gsap.set(name, { opacity: 1 - 0.5 * Math.min(1, Math.abs(position - index)) });
        });
        copies.forEach((copy, index) => {
          gsap.set(copy, { opacity: Math.max(0, 1 - Math.abs(position - index)) });
        });
      };

      paint(0);
      const trigger = ScrollTrigger.create({
        trigger: scroll,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => paint(self.progress),
        onRefresh: (self) => paint(self.progress),
      });

      return () => {
        trigger.kill();
        gsap.set([labels, rule, ...images, ...names, ...copies], { clearProps: "all" });
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section className="relative bg-[#1a1a1a] font-sans text-white" aria-labelledby="kairos-story-heading">
      <GuideRailBlinks />
      <h2 id="kairos-story-heading" className="sr-only [position:absolute] [width:1px] [height:1px] [padding:0] [margin:-1px] [overflow:hidden] [clip-path:inset(50%)] [white-space:nowrap] [border:0]">Our vision, mission and strategy</h2>

      <div ref={scrollRef} className="relative h-[300svh] motion-reduce:hidden">
        <div className="sticky top-0 isolate h-svh overflow-hidden bg-[#1a1a1a]">
          <div className="absolute inset-0" aria-hidden="true">
            {STORY.map((item, index) => (
              <div data-story-image className="absolute inset-0 overflow-hidden" key={item.title} style={{ opacity: index === 0 ? 1 : 0 }}>
                <Image src={item.image} alt="" fill sizes="100vw" className="object-cover object-center" />
              </div>
            ))}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="absolute inset-y-0 left-[40px] z-[1] w-px bg-white/10 max-[700px]:left-[20px]" aria-hidden="true" />
          <div className="absolute inset-y-0 right-[40px] z-[1] w-px bg-white/10 max-[700px]:right-[20px]" aria-hidden="true" />
          <div className="absolute top-1/2 right-[40px] left-[40px] z-[1] h-px bg-white/10 max-[700px]:right-[20px] max-[700px]:left-[20px]" aria-hidden="true">
            <span data-story-progress className="block h-px w-full origin-left scale-x-[.35] bg-white/65" />
          </div>
          <GuideRuleBlink className="top-1/2 right-[40px] left-[40px] z-[2] max-[700px]:right-[20px] max-[700px]:left-[20px]" />

          <div className="absolute top-[calc(50%_-_163px)] left-[80px] z-[2] h-[244px] w-[min(360px,calc(100%_-_160px))] overflow-hidden max-[700px]:left-[32px]" aria-hidden="true">
            <div data-story-labels className="flex translate-y-[180px] flex-col gap-[24px]">
              {STORY.map((item, index) => (
                <span data-story-name className="block h-[64px] shrink-0 text-[48px] leading-[64px] font-normal tracking-[-0.02em] whitespace-nowrap max-[700px]:text-[clamp(36px,10vw,48px)]" key={item.title} style={{ opacity: index === 0 ? 1 : 0.5 }}>
                  {item.title}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute top-[calc(50%_+_41px)] right-[80px] z-[2] w-[338px] max-w-[calc(100%_-_160px)] max-[700px]:top-[calc(50%_+_78px)] max-[700px]:right-auto max-[700px]:left-[32px] max-[700px]:w-[min(338px,calc(100%_-_64px))]">
            {STORY.map((item, index) => (
              <p data-story-copy className="absolute top-0 left-0 m-0 w-full text-[20px] leading-[28px] font-normal tracking-[-0.02em] max-[700px]:text-[16px] max-[700px]:leading-[24px]" key={item.title} style={{ opacity: index === 0 ? 1 : 0 }}>
                {item.body}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden motion-reduce:block">
        {STORY.map((item) => (
          <article className="relative isolate flex min-h-[70svh] flex-col justify-center gap-[24px] px-[max(40px,6vw)] py-[80px]" key={item.title}>
            <Image src={item.image} alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
            <div className="absolute inset-0 -z-10 bg-black/30" />
            <h3 className="m-0 text-[clamp(36px,5vw,48px)] leading-[1.2] font-normal">{item.title}</h3>
            <p className="m-0 max-w-[440px] text-[20px] leading-[28px]">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
