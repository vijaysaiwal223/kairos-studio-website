"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, useState } from "react";

import { SERVICES } from "@/data/home";
import { getSmoothScroll } from "@/lib/smooth-scroll";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import { SiteCta } from "@/components/ui/site-cta";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";
import { ServiceImageEffect } from "./service-image-effect";
import { Eyebrow } from "../ui/eyebrow";

const SERVICE_CATEGORY_ICONS = [
  "/home/expertise/strategy-icon.svg",
  "/home/expertise/design-icon.svg",
  "/home/expertise/project-management-icon.svg",
  "/home/expertise/execution-icon.svg",
  "/home/expertise/bespoke-icon.svg",
] as const;

/** Figma 25:470 — service overview with a selectable category list. */
export function ServiceCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const activeService = SERVICES[activeIndex];

  useIsomorphicLayoutEffect(() => {
    const stage = scrollStageRef.current;
    const content = contentRef.current;
    if (!stage || !content) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const buttons = Array.from(stage.querySelectorAll<HTMLButtonElement>(".service-section-categories button"));
      const distance = () => window.innerHeight * SERVICES.length * 0.68;
      const setStageHeight = () => {
        content.style.setProperty("--service-content-height", `${content.offsetHeight}px`);
        stage.style.height = `${content.offsetHeight + distance()}px`;
      };
      const update = (self: ScrollTrigger) => {
        const position = self.progress * SERVICES.length;
        const nextIndex = Math.min(SERVICES.length - 1, Math.floor(position));
        setActiveIndex((current) => current === nextIndex ? current : nextIndex);
        buttons.forEach((button, index) => {
          const progress = Math.max(0, Math.min(1, position - index));
          button.style.setProperty("--service-progress", `${progress * 100}%`);
        });
      };

      stage.dataset.scrollAnimated = "true";
      setStageHeight();
      ScrollTrigger.addEventListener("refreshInit", setStageHeight);
      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: () => `top ${Math.max(0, (window.innerHeight - content.offsetHeight) / 2)}px`,
        end: () => `+=${distance()}`,
        invalidateOnRefresh: true,
        onUpdate: update,
        onRefresh: update,
      });
      triggerRef.current = trigger;
      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.cancelAnimationFrame(refreshFrame);
        ScrollTrigger.removeEventListener("refreshInit", setStageHeight);
        triggerRef.current = null;
        delete stage.dataset.scrollAnimated;
        stage.style.height = "";
        content.style.removeProperty("--service-content-height");
        buttons.forEach((button) => button.style.removeProperty("--service-progress"));
      };
    });

    return () => media.revert();
  }, []);

  const selectService = (index: number) => {
    setActiveIndex(index);
    const trigger = triggerRef.current;
    if (!trigger) return;

    const target = trigger.start + ((index + 0.5) / SERVICES.length) * (trigger.end - trigger.start);
    const lenis = getSmoothScroll();
    if (lenis) {
      lenis.scrollTo(target, { duration: 0.75 });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <section className="service-section relative z-[1] bg-[var(--ink-ground)] font-sans text-white" aria-labelledby="service-section-title">
      <GuideRailBlinks />
      <div className="pointer-events-none absolute inset-0 hidden min-[768px]:block" aria-hidden="true">
        <span className="absolute inset-y-0 left-[40px] w-px bg-white/10" />
        <span className="absolute inset-y-0 right-[40px] w-px bg-white/10" />
      </div>
      <div className="service-section-inner relative mx-[40px] max-[767px]:mx-[20px]">
        <header className="service-section-intro relative flex flex-col items-center border-b border-white/10 py-[40px] text-center">
          <GuideRuleBlink className="right-0 bottom-0 left-0 z-[3]" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[660px] -translate-x-1/2 border-x border-white/10 max-[767px]:hidden" />
          <Eyebrow>Service</Eyebrow>
          <SplitText tag="h2" id="service-section-title" className="mt-[12px] mb-0 max-w-[578px] text-[48px] leading-[64px] font-normal tracking-[-0.02em] text-balance max-[767px]:text-[clamp(36px,9vw,48px)] max-[767px]:leading-[1.18]">
            The right expertise at every stage.
          </SplitText>
          <p className="mt-[12px] mb-0 max-w-[578px] text-[16px] leading-[24px] max-[767px]:text-[15px] max-[767px]:leading-[23px]">
            We listen to what you want to build, bring together the expertise it needs and keep every decision moving in the same direction.
          </p>
        </header>

        <div ref={scrollStageRef} className="service-section-scroll-stage [&[data-scroll-animated=true]_.service-section-content]:[position:sticky] [&[data-scroll-animated=true]_.service-section-content]:[top:max(0px,_calc((100dvh_-_var(--service-content-height,_681px))_/_2))]">
          <div ref={contentRef} className="service-section-content grid grid-cols-[minmax(0,600fr)_minmax(0,638fr)] gap-[40px] border-b border-white/10 p-[40px] max-[1100px]:grid-cols-2 max-[767px]:grid-cols-1 max-[767px]:gap-[48px] max-[767px]:px-0 max-[767px]:py-[40px]">
            <div className="service-section-visual [position:relative] [min-width:0] [width:100%] [aspect-ratio:1] [box-shadow:inset_0_0_0_1px_rgb(255_255_255_/_20%)] max-[767px]:[width:min(100%,_480px)] max-[767px]:[justify-self:center]" aria-hidden="true">
              <div className="service-section-visual-photo [position:absolute] [inset:4.1667%] [overflow:hidden] [background:rgb(255_255_255_/_10%)] [&_img]:[object-fit:cover] [&_img]:[opacity:0] [&_img]:[transition:opacity_320ms_linear] [&_img.is-active]:[opacity:1] motion-reduce:[&_img]:[transition:none]">
                {SERVICES.map((service, index) => (
                  <Image
                    key={service.image}
                    src={service.image}
                    alt=""
                    fill
                    sizes="(max-width: 767px) min(calc(100vw - 40px), 440px), (max-width: 1100px) 45vw, 40vw"
                    className={index === activeIndex ? "is-active" : ""}
                  />
                ))}
                <ServiceImageEffect activeIndex={activeIndex} />
              </div>
              <Image className="service-section-visual-ruler [position:absolute] [pointer-events:none] [top:0.1667%] [left:0.1667%] [width:99.6667%] [height:auto]" src="/home/expertise/thumbnail-ruler.svg" alt="" width={598} height={599} />
              <Image className="service-section-visual-corner is-top-left [position:absolute] [pointer-events:none] [width:2.8333%] [height:auto] [&.is-top-left]:[top:0.1667%] [&.is-top-left]:[left:0.1667%] [&.is-top-right]:[top:0.1667%] [&.is-top-right]:[right:0.1667%] [&.is-bottom-left]:[bottom:0.1667%] [&.is-bottom-left]:[left:0.1667%] [&.is-bottom-right]:[bottom:0.1667%] [&.is-bottom-right]:[right:0.1667%]" src="/home/expertise/thumbnail-corner-top-left.svg" alt="" width={17} height={17} />
              <Image className="service-section-visual-corner is-top-right [position:absolute] [pointer-events:none] [width:2.8333%] [height:auto] [&.is-top-left]:[top:0.1667%] [&.is-top-left]:[left:0.1667%] [&.is-top-right]:[top:0.1667%] [&.is-top-right]:[right:0.1667%] [&.is-bottom-left]:[bottom:0.1667%] [&.is-bottom-left]:[left:0.1667%] [&.is-bottom-right]:[bottom:0.1667%] [&.is-bottom-right]:[right:0.1667%]" src="/home/expertise/thumbnail-corner-top-right.svg" alt="" width={17} height={17} />
              <Image className="service-section-visual-corner is-bottom-left [position:absolute] [pointer-events:none] [width:2.8333%] [height:auto] [&.is-top-left]:[top:0.1667%] [&.is-top-left]:[left:0.1667%] [&.is-top-right]:[top:0.1667%] [&.is-top-right]:[right:0.1667%] [&.is-bottom-left]:[bottom:0.1667%] [&.is-bottom-left]:[left:0.1667%] [&.is-bottom-right]:[bottom:0.1667%] [&.is-bottom-right]:[right:0.1667%]" src="/home/expertise/thumbnail-corner-bottom-left.svg" alt="" width={17} height={17} />
              <Image className="service-section-visual-corner is-bottom-right [position:absolute] [pointer-events:none] [width:2.8333%] [height:auto] [&.is-top-left]:[top:0.1667%] [&.is-top-left]:[left:0.1667%] [&.is-top-right]:[top:0.1667%] [&.is-top-right]:[right:0.1667%] [&.is-bottom-left]:[bottom:0.1667%] [&.is-bottom-left]:[left:0.1667%] [&.is-bottom-right]:[bottom:0.1667%] [&.is-bottom-right]:[right:0.1667%]" src="/home/expertise/thumbnail-corner-bottom-right.svg" alt="" width={17} height={17} />
            </div>

            <div className="service-section-right [display:flex] [min-width:0] [flex-direction:column] [justify-content:space-between] max-[767px]:[gap:72px]">
              <div className="service-section-overview [position:relative] [display:grid] [grid-template-columns:32px_minmax(0,_1fr)] [gap:56px] [min-height:213px] [padding-top:16px] [border-top:1px_solid_rgb(255_255_255_/_10%)] [&::before]:[position:absolute] [&::before]:[top:0] [&::before]:[left:60px] [&::before]:[width:1px] [&::before]:[height:64px] [&::before]:[background:rgb(255_255_255_/_10%)] [&::before]:[content:''] max-[767px]:[min-height:0] max-[767px]:[gap:20px] max-[767px]:[&::before]:[display:none]">
                <div className="service-section-number [display:inline-flex] [width:32px] [height:32px] [align-items:center] [justify-content:center] [gap:12px] [padding:8px] [border-radius:8px] [background:rgb(255_255_255_/_8%)] [box-shadow:inset_0_0_0_1px_rgb(255_255_255_/_12%)] [font-family:var(--font-geist-mono),_monospace] [font-size:14px] [line-height:20px]">
                  {activeIndex + 1}
                </div>
                <div className="service-section-details [animation:service-details-enter_180ms_linear_both] [&_h3]:[margin:0] [&_h3]:[font-size:24px] [&_h3]:[font-weight:400] [&_h3]:[line-height:32px] [&_h3]:[letter-spacing:-0.02em] [&_p]:[margin:12px_0_0] [&_p]:[font-size:16px] [&_p]:[line-height:24px] [&_p]:[letter-spacing:-0.02em] [&_.site-cta]:[margin-top:32px] max-[767px]:[&_h3]:[font-size:26px] max-[767px]:[&_h3]:[line-height:32px] max-[767px]:[&_p]:[margin-top:16px] max-[767px]:[&_p]:[font-size:16px] max-[767px]:[&_p]:[line-height:24px] max-[767px]:[&_.site-cta]:[margin-top:28px] motion-reduce:[animation:none]" key={activeService.title}>
                  <h3>{activeService.heading}</h3>
                  <p>{activeService.body}</p>
                  <SiteCta href="#contact">Learn more</SiteCta>
                </div>
              </div>

              <ul className="service-section-categories [display:flex] [flex-direction:column] [gap:16px] [margin:0] [padding:0] [list-style:none] [&_button]:[position:relative] [&_button]:[display:flex] [&_button]:[width:100%] [&_button]:[height:33px] [&_button]:[align-items:flex-start] [&_button]:[gap:12px] [&_button]:[padding:0_0_12px] [&_button]:[border-bottom:1px_solid_rgb(255_255_255_/_10%)] [&_button]:[background:transparent] [&_button]:[color:#fff] [&_button]:[cursor:pointer] [&_button]:[font-size:14px] [&_button]:[line-height:20px] [&_button]:[letter-spacing:1px] [&_button]:[text-align:left] [&_button]:[text-transform:uppercase] [&_button]:[transition:color_180ms_linear,_border-color_180ms_linear] [&_button::after]:[position:absolute] [&_button::after]:[right:auto] [&_button::after]:[bottom:-1px] [&_button::after]:[left:0] [&_button::after]:[width:var(--service-progress,_0%)] [&_button::after]:[height:1px] [&_button::after]:[background:#fff] [&_button::after]:[content:''] [&_button:hover]:[color:#fff] [&_button:hover]:[border-color:rgb(255_255_255_/_28%)] [&_button:focus-visible]:[color:#fff] [&_button:focus-visible]:[border-color:rgb(255_255_255_/_28%)] [&_button.is-active]:[color:#fff] [&_button.is-active]:[border-color:rgb(255_255_255_/_28%)] [&_button:focus-visible]:[outline:2px_solid_#fff] [&_button:focus-visible]:[outline-offset:4px] [&_span]:[white-space:nowrap] max-[767px]:[&_span]:[white-space:normal] motion-reduce:[&_button]:[transition:none]" aria-label="Service categories">
                {SERVICES.map((service, index) => (
                  <li key={service.title}>
                    <button
                      type="button"
                      className={index === activeIndex ? "is-active" : ""}
                      aria-pressed={index === activeIndex}
                      onClick={() => selectService(index)}
                    >
                      <Image className="service-category-icon [flex:none]" src={SERVICE_CATEGORY_ICONS[index]} alt="" width={20} height={20} />
                      <span>{service.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
