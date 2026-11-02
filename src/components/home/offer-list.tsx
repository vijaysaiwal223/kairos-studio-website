"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";
import { OFFERINGS } from "@/data/home";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

const CORNERS = [
  { position: "top-0 left-0", src: "/home/expertise/thumbnail-corner-top-left.svg" },
  { position: "top-0 right-0", src: "/home/expertise/thumbnail-corner-top-right.svg" },
  { position: "bottom-0 left-0", src: "/home/expertise/thumbnail-corner-bottom-left.svg" },
  { position: "bottom-0 right-0", src: "/home/expertise/thumbnail-corner-bottom-right.svg" },
] as const;

/** Figma 15:361 — a six-stage horizontal process gallery. */
export function OfferList() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const videos = Array.from(section.querySelectorAll<HTMLVideoElement>("[data-process-video]"));
    const visibleVideos = new Set<HTMLVideoElement>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      videos.forEach((video) => {
        if (visibleVideos.has(video) && !reducedMotion.matches) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) visibleVideos.add(video);
          else visibleVideos.delete(video);
        });
        syncPlayback();
      },
      { threshold: 0.1 },
    );
    videos.forEach((video) => observer.observe(video));
    reducedMotion.addEventListener("change", syncPlayback);

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const paint = (progress: number) => {
        const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
        gsap.set(track, { x: -distance * progress });
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => paint(self.progress),
        onRefresh: (self) => paint(self.progress),
      });

      return () => {
        trigger.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => {
      media.revert();
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      videos.forEach((video) => video.pause());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      aria-labelledby="hp-offer-heading"
      className="relative z-[1] h-[270svh] bg-[var(--ink-ground)] font-sans text-white max-[767px]:h-auto motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-svh min-h-[833px] flex-col overflow-hidden max-[767px]:relative max-[767px]:h-auto max-[767px]:min-h-0 motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-0">
        <GuideRailBlinks />
        <div className="pointer-events-none absolute inset-0 z-[1] hidden min-[768px]:block" aria-hidden="true">
          <span className="absolute inset-y-0 left-[40px] w-px bg-white/10" />
          <span className="absolute inset-y-0 right-[40px] w-px bg-white/10" />
        </div>

        <header className="relative z-[2] mx-[40px] flex shrink-0 flex-col items-center border-b border-white/10 py-[40px] text-center max-[767px]:mx-[20px]">
          <GuideRuleBlink className="right-0 bottom-0 left-0 z-[3]" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[660px] -translate-x-1/2 border-x border-white/10 max-[767px]:hidden" />
          <Eyebrow>Our Process</Eyebrow>
          <SplitText tag="h2" id="hp-offer-heading" className="mt-[12px] mb-0 max-w-[660px] text-[48px] leading-[64px] font-normal tracking-[-0.02em] text-balance max-[767px]:text-[clamp(36px,9vw,48px)] max-[767px]:leading-[1.15]">
            From idea to delivery
          </SplitText>
          <p className="mt-[12px] mb-0 max-w-[578px] text-[16px] leading-[24px] font-normal text-pretty max-[767px]:text-[15px] max-[767px]:leading-[23px]">
            We listen to what you want to build, bring together the expertise it needs and keep every decision moving in the same direction.
          </p>
        </header>

        <div ref={viewportRef} className="relative z-[2] mx-[40px] flex min-h-[581px] flex-1 overflow-visible border-b border-white/10 max-[767px]:mx-[20px] max-[767px]:min-h-0 max-[767px]:overflow-x-auto max-[767px]:overscroll-x-contain max-[767px]:scroll-smooth max-[767px]:[scrollbar-width:none] motion-reduce:overflow-x-auto motion-reduce:overscroll-x-contain motion-reduce:scroll-smooth motion-reduce:[scrollbar-width:none]" role="region" aria-label="Our six process stages" tabIndex={0}>
          <ol ref={trackRef} className="m-0 flex w-max list-none items-start gap-[40px] px-[40px] pt-[40px] pb-[40px] max-[767px]:gap-[16px] max-[767px]:px-[20px] max-[767px]:pb-[32px]">
            {OFFERINGS.map((offering) => (
              <li key={offering.title} className="relative h-[476px] w-[404px] shrink-0 border border-white/10 p-[16px] max-[767px]:w-[min(404px,calc(100vw-80px))] max-[767px]:snap-center">
                {CORNERS.map((corner) => (
                  <Image key={corner.src} src={corner.src} alt="" width={17} height={17} className={`pointer-events-none absolute ${corner.position}`} />
                ))}
                <article className="flex h-full flex-col overflow-hidden bg-white px-[24px] pt-[24px] pb-[12px] text-[#0e0c0c] max-[767px]:px-[16px]">
                  <div>
                    <h3 className="m-0 text-[20px] leading-[28px] font-medium tracking-[-0.02em]">{offering.title}</h3>
                    <p className="mt-[8px] mb-0 text-[16px] leading-[24px] font-medium tracking-[-0.02em] text-[#737373] max-[767px]:text-[15px] max-[767px]:leading-[22px]">
                      {offering.body}
                    </p>
                  </div>
                  <video data-process-video muted loop playsInline preload="none" poster={offering.poster} className="mt-auto aspect-square w-[298px] max-w-full shrink-0 self-center object-contain" aria-hidden="true">
                    <source src={offering.video} type="video/webm" />
                  </video>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
