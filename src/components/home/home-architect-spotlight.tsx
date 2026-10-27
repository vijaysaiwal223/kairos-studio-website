"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import { Eyebrow } from "../ui/eyebrow";

const AWARDS = [
  {
    src: "/home/architect-spotlight/logo-lbc.png",
    alt: "LBC award mark",
  },
  {
    src: "/home/architect-spotlight/logo-awards.png",
    alt: "Awards mark",
  },
  {
    src: "/home/architect-spotlight/logo-india-architecture.png",
    alt: "India Architecture mark",
  },
  {
    src: "/home/architect-spotlight/logo-government.png",
    alt: "Government recognition mark",
  },
];

const ARCHITECT_SLIDES = [
  {
    name: "ZZ Architects",
    body: "A long-standing firm founded in 1957 focusing on biophilic (nature-connected) architecture and urban planning.",
    background: "background.png",
    portrait: "zz-architects.png",
    backgroundAlt: "Coastal residence opening onto an ocean terrace",
  },
  {
    name: "Sanjay Puri Architects",
    body: "Known for large, sustainable, and contextual designs across educational, retail, and housing sectors.",
    background: "sanjay-background.png",
    portrait: "sanjay-portrait.png",
    backgroundAlt: "Architectural project featured with Sanjay Puri Architects",
  },
  {
    name: "ZZ Architects",
    body: "Focuses on extremely high-end, luxury, and bespoke architectural and interior design services.",
    background: "zz-luxury-background.png",
    portrait: "zz-luxury-portrait.png",
    backgroundAlt: "Luxury architectural project featured with ZZ Architects",
  },
];

/** Figma 63:1923, using the former project stage's upward wipe. */
export function HomeArchitectSpotlight() {
  const stageRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const frames = Array.from(stage.querySelectorAll<HTMLElement>(".hp-architect-frame"));
      const backdrops = frames.map((frame) => frame.querySelector<HTMLElement>(".hp-architect-backdrop")!);
      const cards = frames.map((frame) => frame.querySelector<HTMLElement>(".hp-architect-spotlight-card")!);
      stage.dataset.animated = "true";
      gsap.set(backdrops.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(cards.slice(1), { autoAlpha: 0 });
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => "+=" + window.innerHeight * frames.length * 0.92,
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      backdrops.forEach((backdrop, index) => {
        if (!index) return;
        const at = 0.22 + (index - 1) * 1.18;
        // The image wipes behind a separate card layer, so portraits never split.
        timeline.to(backdrop,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.82 }, at)
          .fromTo(backdrop.querySelector(".hp-architect-spotlight-bg"),
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
      return () => {
        active = false;
        delete stage.dataset.animated;
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section id="projects" className="hp-architect-section" aria-labelledby="hp-architect-heading">
      <div className="hp-architect-intro">
        <Eyebrow>Our architect network</Eyebrow>
        <h2 id="hp-architect-heading">International expertise, chosen for you.</h2>
        <p className="hp-architect-intro-body">
          Every project deserves the right point of view. We connect your brief
          with architects whose approach suits its place, purpose and ambition.
        </p>
      </div>
      <div ref={stageRef} className="hp-architect-spotlight">
      {ARCHITECT_SLIDES.map((architect, index) => (
      <div className="hp-architect-frame" key={architect.portrait}>
      <div className="hp-architect-backdrop" style={{ zIndex: index + 1 }}>
        <Image
          src={`/home/architect-spotlight/${architect.background}`}
          alt={architect.backgroundAlt}
          fill
          sizes="100vw"
          className="hp-architect-spotlight-bg"
        />
      </div>

      <article className="hp-architect-spotlight-card" style={{ zIndex: index + 10 }}>
        <div className="hp-architect-spotlight-copy">
          <h3>{architect.name}</h3>
          <p>{architect.body}</p>
        </div>

        <ul className="hp-architect-awards" aria-label="Recognition">
          {AWARDS.map((award) => (
            <li key={award.src}>
              <Image src={award.src} alt={award.alt} width={80} height={80} />
            </li>
          ))}
        </ul>

        <div className="hp-architect-portrait">
          <Image
            src={`/home/architect-spotlight/${architect.portrait}`}
            alt={`Architects from ${architect.name}`}
            fill
            sizes="(max-width: 640px) calc(100vw - 64px), 468px"
            className="object-cover"
          />
        </div>
      </article>
      </div>
      ))}
      </div>
    </section>
  );
}
