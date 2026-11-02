import Image from "next/image";

import { Eyebrow } from "@/components/ui/eyebrow";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";

/** Figma 87:2341 — the gridded statement directly below the home hero. */
export function StandsFor() {
  return (
    <section id="stands-for" className="stands-for [--stands-for-line:rgb(255_255_255_/_10%)] [--stands-for-inner-edge:min(330px,_30vw)] [position:relative] [display:grid] [min-height:900px] [overflow:hidden] [place-items:center] [background:#1a1a1a] [color:#fff] [font-family:var(--font-geist),_sans-serif] [&_.stands-for-eyebrow]:[padding:6px_10px] [&_.stands-for-eyebrow]:[backdrop-filter:blur(20px)] max-[700px]:[--stands-for-inner-edge:30vw] max-[700px]:[min-height:720px]" aria-labelledby="stands-for-heading">
      <GuideRailBlinks />
      <GuideRuleBlink className="top-[40px] right-0 left-0 z-[5]" />
      <div className="stands-for-grid [position:absolute] [inset:0] [pointer-events:none]" aria-hidden="true">
        <span className="stands-for-line stands-for-line--vertical-outer-left [position:absolute] [display:block] [background:var(--stands-for-line)] [top:0] [bottom:0] [width:1px] [left:40px] max-[700px]:[left:20px]" />
        <span className="stands-for-line stands-for-line--vertical-inner-left [position:absolute] [display:block] [background:var(--stands-for-line)] [top:40px] [bottom:0] [width:1px] [left:calc(50%_-_var(--stands-for-inner-edge))]" />
        <span className="stands-for-line stands-for-line--vertical-inner-right [position:absolute] [display:block] [background:var(--stands-for-line)] [top:40px] [bottom:0] [width:1px] [right:calc(50%_-_var(--stands-for-inner-edge))]" />
        <span className="stands-for-line stands-for-line--vertical-outer-right [position:absolute] [display:block] [background:var(--stands-for-line)] [top:0] [bottom:0] [width:1px] [right:40px] max-[700px]:[right:20px]" />
        <span className="stands-for-line stands-for-line--horizontal-top [position:absolute] [display:block] [background:var(--stands-for-line)] [right:0] [left:0] [height:1px] [top:40px]" />
        <span className="stands-for-line stands-for-line--horizontal-upper [position:absolute] [display:block] [background:var(--stands-for-line)] [right:0] [left:0] [height:1px] [top:120px]" />
        <span className="stands-for-line stands-for-line--horizontal-middle-left [position:absolute] [display:block] [background:var(--stands-for-line)] [top:50%] [width:calc(50%_-_var(--stands-for-inner-edge))] [height:1px] [left:0]" />
        <span className="stands-for-line stands-for-line--horizontal-middle-right [position:absolute] [display:block] [background:var(--stands-for-line)] [top:50%] [width:calc(50%_-_var(--stands-for-inner-edge))] [height:1px] [right:0]" />
        <span className="stands-for-line stands-for-line--horizontal-lower [position:absolute] [display:block] [background:var(--stands-for-line)] [right:0] [left:0] [height:1px] [bottom:120px]" />
        <span className="stands-for-line stands-for-line--horizontal-bottom [position:absolute] [display:block] [background:var(--stands-for-line)] [right:0] [left:0] [height:1px] [bottom:40px]" />
      </div>

      <svg className="stands-for-ring stands-for-ring--outer [position:absolute] [top:50%] [left:50%] [width:min(calc(100%_-_40px),_var(--stands-for-ring-size))] [height:auto] [transform:translate(-50%,_-50%)] [pointer-events:none] [--stands-for-ring-size:820px]" viewBox="0 0 820 820" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="stands-for-green-tail" x1="0.5" y1="410" x2="156.888738" y2="88.091723" gradientUnits="userSpaceOnUse">
            <stop stopColor="#83FF83" stopOpacity="0" />
            <stop offset="1" stopColor="#83FF83" />
          </linearGradient>
        </defs>
        <circle cx="410" cy="410" r="409.5" stroke="white" strokeOpacity=".1" />
        <circle cx="410" cy="410" r="409.5" stroke="white" strokeOpacity=".06" strokeDasharray="4 4" />
        <path className="stands-for-arc stands-for-arc--green [transform-box:view-box] [transform-origin:center] [will-change:transform] motion-reduce:[animation:none] [animation:stands-for-clockwise_18s_linear_infinite]" d="M .5 410 A 409.5 409.5 0 0 1 156.888738 88.091723" stroke="url(#stands-for-green-tail)" />
      </svg>
      <svg className="stands-for-ring stands-for-ring--inner [position:absolute] [top:50%] [left:50%] [width:min(calc(100%_-_40px),_var(--stands-for-ring-size))] [height:auto] [transform:translate(-50%,_-50%)] [pointer-events:none] [--stands-for-ring-size:660px]" viewBox="0 0 660 660" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="stands-for-orange-tail" x1="74.078959" y1="537.544382" x2="495.052378" y2="615.180579" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4800" stopOpacity="0" />
            <stop offset="1" stopColor="#FF4800" />
          </linearGradient>
        </defs>
        <circle cx="330" cy="330" r="329.5" stroke="white" strokeOpacity=".1" strokeDasharray="4 4" />
        <path className="stands-for-arc stands-for-arc--orange [transform-box:view-box] [transform-origin:center] [will-change:transform] motion-reduce:[animation:none] [animation:stands-for-counterclockwise_22s_linear_infinite]" d="M 74.078959 537.544382 A 329.5 329.5 0 0 0 495.052378 615.180579" stroke="url(#stands-for-orange-tail)" />
      </svg>

      <div className="stands-for-content [position:relative] [z-index:1] [display:flex] [width:min(500px,_calc(100%_-_40px))] [flex-direction:column] [align-items:center] [gap:12px] [text-align:center] [&_>_img]:[display:block] [&_>_img]:[width:64px] [&_>_img]:[height:64px] [&_h2]:[margin:0] [&_h2]:[font-size:48px] [&_h2]:[font-weight:400] [&_h2]:[line-height:64px] [&_h2]:[letter-spacing:-0.02em] [&_h2]:[text-wrap:balance] [&_>_p:last-child]:[margin:0] [&_>_p:last-child]:[font-size:16px] [&_>_p:last-child]:[line-height:24px] [&_>_p:last-child]:[text-wrap:pretty] max-[700px]:[&_h2]:[font-size:clamp(32px,_8vw,_48px)] max-[700px]:[&_h2]:[line-height:1.2]">
        <Image src="/home/hero/header-mark.png" alt="" width={64} height={64} />
        <Eyebrow className="stands-for-eyebrow">kai.ros stands for</Eyebrow>
        <SplitText tag="h2" id="stands-for-heading">Better spaces begin with the right people.</SplitText>
        <p>
          We connect your vision with the right architects and specialists, then guide every decision with clarity and care — from the first conversation to the finished space.
        </p>
      </div>
    </section>
  );
}
