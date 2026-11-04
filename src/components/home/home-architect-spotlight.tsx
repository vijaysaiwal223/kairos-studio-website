"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitText } from "@/components/ui/split-text";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

const awards = [
  { src: "/home/architect-spotlight/logo-lbc.png", alt: "Indian Building Congress" },
  { src: "/home/architect-spotlight/logo-awards.png", alt: "Kyorius Design Awards" },
  { src: "/home/architect-spotlight/logo-india-architecture.png", alt: "Architecture MasterPrize" },
  { src: "/home/architect-spotlight/logo-government.png", alt: "Government recognition" },
] as const;

const architects = [
  {
    name: "ZZ Architects",
    description: "A long-standing firm founded in 1957 focusing on biophilic (nature-connected) architecture and urban planning.",
    background: "/home/architect-spotlight/background.png",
    backgroundAlt: "Coastal residence opening onto an ocean terrace",
    portrait: "/home/architect-spotlight/zz-architects.png",
  },
  {
    name: "Sanjay Puri Architects",
    description: "Known for sustainable, contextual designs across educational, retail and residential spaces.",
    background: "/home/architect-spotlight/sanjay-background.png",
    backgroundAlt: "Architectural project by Sanjay Puri Architects",
    portrait: "/home/architect-spotlight/sanjay-portrait.png",
  },
  {
    name: "ZZ Architects",
    description: "Creating bespoke architecture and interiors with a strong focus on craft, detail and the people who use each space.",
    background: "/home/architect-spotlight/zz-luxury-background.png",
    backgroundAlt: "Luxury architectural project by ZZ Architects",
    portrait: "/home/architect-spotlight/zz-luxury-portrait.png",
  },
] as const;

/** Figma 134:2195 — a centered architect card over a full-width project image. */
export function HomeArchitectSpotlight() {
  const stageRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const scenes = Array.from(stage.querySelectorAll<HTMLElement>("[data-architect-scene]"));
      const backdrops = scenes.map((scene) => scene.querySelector<HTMLElement>("[data-architect-backdrop]"));
      const cards = scenes.map((scene) => scene.querySelector<HTMLElement>("[data-architect-card]"));
      if (backdrops.some((backdrop) => !backdrop) || cards.some((card) => !card)) return;

      gsap.set(backdrops.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(cards.slice(1), { autoAlpha: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * architects.length * 0.92}`,
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      backdrops.forEach((backdrop, index) => {
        if (!index || !backdrop) return;
        const at = 0.22 + (index - 1) * 1.18;
        timeline
          .to(backdrop, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.82 }, at)
          .fromTo(backdrop.querySelector("[data-architect-background-image]"),
            { y: () => stage.offsetHeight * 0.16 },
            { y: 0, duration: 0.82 }, at)
          .set(cards[index - 1], { autoAlpha: 0 }, at + 0.48)
          .set(cards[index], { autoAlpha: 1 }, at + 0.48);
      });
      timeline.to({}, { duration: 0.18 });

      let active = true;
      void document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh();
      });
      return () => { active = false; };
    });

    return () => media.revert();
  }, []);

  return (
    <section id="projects" aria-labelledby="hp-architect-heading" className="relative z-[3] bg-[var(--ink-ground)] px-[40px] font-[family-name:var(--font-geist)] text-white max-[700px]:px-[20px]">
      <GuideRailBlinks />
      <div className="relative border-x border-white/10">
        <div className="relative flex h-[301px] items-center justify-center border-b border-white/10 px-[20px] py-[40px] text-center max-[700px]:h-auto max-[700px]:min-h-[300px]">
          <GuideRuleBlink className="right-0 bottom-0 left-0 z-[3]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[660px] -translate-x-1/2 border-x border-white/10 max-[700px]:hidden" />
          <div className="relative z-10 flex max-w-[660px] flex-col items-center">
            <Eyebrow>Our architect network</Eyebrow>
            <SplitText tag="h2" id="hp-architect-heading" className="mt-[12px] max-w-[578px] text-[48px] leading-[56px] font-normal tracking-[-0.02em] max-[700px]:text-[38px] max-[700px]:leading-[44px] max-[480px]:text-[32px] max-[480px]:leading-[38px]">
              International expertise,<br className="max-[480px]:hidden" /> chosen for you.
            </SplitText>
            <p className="mt-[12px] max-w-[578px] text-[16px] leading-[24px] max-[480px]:text-[14px] max-[480px]:leading-[21px]">
              Every project deserves the right point of view. We connect your brief with architects whose approach suits its place, purpose and ambition.
            </p>
          </div>
        </div>

        <div ref={stageRef} className="relative isolate h-svh min-h-[640px] overflow-hidden motion-reduce:h-auto">
          {architects.map((architect, index) => (
            <div key={architect.background} data-architect-scene className="absolute inset-0 grid place-items-center motion-reduce:relative motion-reduce:min-h-[640px]">
              <div data-architect-backdrop className={`absolute inset-0 overflow-hidden ${index ? "[clip-path:inset(100%_0_0_0)] motion-reduce:[clip-path:none]" : ""}`} style={{ zIndex: index + 1 }}>
                <Image
                  data-architect-background-image
                  src={architect.background}
                  alt={architect.backgroundAlt}
                  fill
                  sizes="(max-width: 700px) 100vw, calc(100vw - 80px)"
                  className="object-cover object-center"
                  priority={index === 0}
                />
              </div>

              <article data-architect-card aria-label={architect.name} className={`relative grid w-[434px] max-w-[calc(100%-32px)] place-items-center border border-white/20 bg-[#343434]/30 p-[16px] text-[#171717] shadow-[0_18px_60px_#0004] max-[480px]:p-[10px] ${index ? "invisible opacity-0 motion-reduce:visible motion-reduce:opacity-100" : ""}`} style={{ zIndex: index + 10 }}>
                <div className="w-full rounded-[12px] bg-white p-[8px] text-center shadow-[0_12px_30px_#0002]">
                  <div className="flex h-[164px] flex-col items-center justify-start pt-[10px] max-[480px]:h-[150px]">
                    <h3 className="text-[20px] leading-[28px] font-medium tracking-[-0.02em]">{architect.name}</h3>
                    <p className="mt-[8px] max-w-[384px] text-[14px] leading-[20px] text-[#464646] max-[480px]:text-[12px] max-[480px]:leading-[17px]">{architect.description}</p>
                    <ul aria-label="Recognition" className="mt-auto flex h-[80px] w-full items-center justify-center gap-[8px] max-[480px]:h-[64px] max-[480px]:gap-[4px]">
                      {awards.map((award) => (
                        <li key={award.src} className="relative size-[80px] shrink min-w-0 max-[480px]:size-[64px]">
                          <Image src={award.src} alt={award.alt} fill sizes="80px" className="object-contain" />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative aspect-[384/369] w-full overflow-hidden rounded-[12px] bg-[#dedede]">
                    <Image src={architect.portrait} alt={`Portrait of ${architect.name}`} fill sizes="(max-width: 480px) calc(100vw - 76px), 384px" className={`object-cover ${index === 2 ? "object-[center_88%]" : "object-center"}`} />
                  </div>
                </div>
                <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 size-[16px] border-l border-t border-[#FF9152]" />
                <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 size-[16px] border-r border-t border-[#FF9152]" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 size-[16px] border-b border-l border-[#FF9152]" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 size-[16px] border-b border-r border-[#FF9152]" />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
