import Image from "next/image";

import { SiteCta } from "@/components/ui/site-cta";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";

/** Home masthead, Figma node 87:2155. */
export function HomeHero() {
  return (
    <section id="about" className="hp-hero [body:has(&)]:[--background:#1A1A1A] [body:has(&)]:[--ink-ground:#1A1A1A] [body:has(&)]:[background:#1A1A1A] [position:relative] [isolation:isolate] [width:100%] [height:100svh] [min-height:680px] [overflow:hidden] [background:var(--ink-ground)] [color:#fff] [font-family:var(--font-geist),_sans-serif] max-[700px]:[min-height:760px]">
      <div className="hp-hero-stage [position:relative] [width:100%] [height:100%] [overflow:hidden] [background:var(--ink-ground)]">
        <GuideRailBlinks />
        <video
          src="/home/hero/intro-video.mp4"
          poster="/home/hero/intro-video-poster.jpg"
          className="hp-hero-image hp-hero-video [position:absolute] [inset:0] [width:100%] [height:100%] [object-fit:cover] [object-position:center] max-[700px]:[object-position:55%_center]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hp-hero-scrim [position:absolute] [inset:0] [z-index:1] [background:linear-gradient(180deg,_rgb(0_0_0_/_50%)_0%,_rgb(0_0_0_/_36%)_34%,_rgb(0_0_0_/_14%)_60%,_#1a1a1a_100%)] [pointer-events:none]" aria-hidden="true" />
        <div className="hp-hero-guides [position:absolute] [z-index:2] [inset:0] [pointer-events:none] [&_span]:[position:absolute] [&_span]:[display:block] [&_span]:[background:rgb(255_255_255_/_10%)] [&_span:nth-child(1)]:[top:0] [&_span:nth-child(1)]:[bottom:0] [&_span:nth-child(1)]:[width:1px] [&_span:nth-child(2)]:[top:0] [&_span:nth-child(2)]:[bottom:0] [&_span:nth-child(2)]:[width:1px] [&_span:nth-child(1)]:[left:40px] [&_span:nth-child(2)]:[right:40px] [&_span:nth-child(3)]:[top:40px] [&_span:nth-child(3)]:[right:0] [&_span:nth-child(3)]:[left:0] [&_span:nth-child(3)]:[height:1px] max-[700px]:[&_span:nth-child(1)]:[left:20px] max-[700px]:[&_span:nth-child(2)]:[right:20px]" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute top-[calc(100svh-68px)] right-[40px] left-[40px] z-[2] h-px bg-white/10 max-[700px]:top-[calc(100svh-44px)] max-[700px]:right-[20px] max-[700px]:left-[20px]" />
        <GuideRuleBlink className="top-[calc(100svh-68px)] right-[40px] left-[40px] z-[3] max-[700px]:top-[calc(100svh-44px)] max-[700px]:right-[20px] max-[700px]:left-[20px]" />

        <div className="hp-hero-copy [position:absolute] [top:160px] [left:50%] [z-index:3] [display:flex] [width:min(750px,_calc(100%_-_40px))] [flex-direction:column] [align-items:center] [gap:12px] [text-align:center] [transform:translateX(-50%)] max-[700px]:[top:clamp(120px,_18svh,_160px)] max-[700px]:[left:50%] max-[700px]:[width:calc(100%_-_40px)]">
          <Image src="/home/hero/header-mark.png" width={64} height={64} alt="" className="hp-hero-mark [display:block] [width:64px] [height:64px]" />
          <p className="hp-hero-eyebrow [margin:0] [font-family:var(--font-geist-mono),_monospace] [font-size:14px] [line-height:20px] [letter-spacing:1.525px] [text-transform:uppercase] max-[700px]:[font-size:11px] max-[700px]:[letter-spacing:1.1px]">kai.ros Studio — Architecture without borders</p>
          <SplitText tag="h1" trigger="load" className="hp-hero-title [width:100%] [margin:0] [font-size:64px] [line-height:72px] [font-weight:400] [letter-spacing:-3.595px] [color:#fff] [&>span]:[display:block] max-[700px]:[font-size:clamp(32px,_8vw,_48px)] max-[700px]:[line-height:1.1] max-[700px]:[letter-spacing:-.05em]">
            <span>International architects.</span>
            <span>One clear vision.</span>
          </SplitText>
          <p className="hp-hero-blurb [width:100%] [margin:0] [font-size:16px] [line-height:24px] [letter-spacing:0] [color:rgb(255_255_255_/_60%)] max-[700px]:[max-width:350px] max-[700px]:[font-size:15px] max-[700px]:[line-height:22px]">
            We bring the right architects and specialists from around the world
            to your project, then guide their ideas from brief to built space.
          </p>
          <SiteCta className="site-cta--hero [width:fit-content] [padding:4px_8px_4px_4px] [&:is(:hover,_:focus-visible)]:[width:fit-content] [&:is(:hover,_:focus-visible)]:[padding:4px_8px_4px_4px] [margin-top:12px]" href="#stands-for">Learn more</SiteCta>
        </div>
      </div>
    </section>
  );
}
