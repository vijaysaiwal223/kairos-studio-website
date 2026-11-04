"use client";

import Image from "next/image";

import { StoryboardControls, useStoryboardPlayback } from "@/components/sandbox/storyboard-playback";

const steps = ["Review", "Sign", "Ready"] as const;
const durations = [3500, 3500, 4500];

const paper = "overflow-hidden rounded-[3px] border border-[#c9c8c1] bg-[linear-gradient(145deg,#fafaf6_0%,#f0efe9_62%,#e8e7e0_100%)] text-[#1d1d1b] shadow-[1px_1px_0_#d5d3cb,0_16px_32px_#0008]";

function PaperGrain({ id }: { id: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0 size-full opacity-[0.06] mix-blend-multiply" aria-hidden="true">
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

function Signature({ kind, visible, complete }: { kind: "client" | "architect"; visible: boolean; complete: boolean }) {
  const isClient = kind === "client";
  const path = isClient
    ? "M5 31C17 15 25 11 27 20c2 8-5 15 0 10 9-11 17-23 19-18 3 5-8 21-2 18 10-7 20-18 24-13 3 4-6 13-1 13 8 0 16-9 24-7 13 3 27 2 52-3"
    : "M5 32C19 12 28 10 30 18c2 8-8 19-2 13 9-10 19-22 21-16 2 5-8 18-3 16 10-8 20-17 24-13 4 4-7 13-1 13 8-1 14-8 24-7 11 2 30 2 49-4";

  return (
    <div>
      <div className="relative h-[34px] border-b border-[#989791]">
        <svg className="absolute bottom-0 left-0 h-[29px] w-[75px]" viewBox="0 0 150 40" fill="none" aria-hidden="true">
          <path
            d={path}
            stroke="#242423"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            style={{ strokeDashoffset: visible ? 0 : 1 }}
            className={`${complete ? "transition-none" : "transition-[stroke-dashoffset] ease-out motion-reduce:transition-none"} ${isClient ? "duration-[850ms]" : "duration-[1300ms] delay-[450ms]"}`}
          />
        </svg>
      </div>
      <span className="mt-[5px] block text-[9px] text-[#60605d]">{isClient ? "Client" : "Architect"}</span>
    </div>
  );
}

/** A compact document cover opens to the agreement managed by kai.ros. */
export function CollaborationSetupBento() {
  const { tileRef, phase, playing, select, toggle } = useStoryboardPlayback(durations);
  const open = phase > 0;

  return (
    <div className="w-[500px] shrink-0">
      <div
        ref={tileRef}
        role="img"
        aria-label={`Project agreement concept: ${steps[phase]}`}
        className="relative size-[500px] overflow-hidden border border-white/10 bg-[#0d0f0e]"
      >
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(#ffffff09_1px,transparent_1px),linear-gradient(90deg,#ffffff09_1px,transparent_1px)] [background-size:50px_50px]" />

        <div className="absolute inset-0 [perspective:1400px]">
          <div className={`absolute top-[96px] left-[250px] h-[308px] w-[218px] transition-transform duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${open ? "translate-x-0" : "-translate-x-[109px]"} [transform-style:preserve-3d]`}>
            <div className="absolute inset-0 translate-x-[9px] translate-y-[5px] rotate-[5deg] rounded-[3px] border border-[#6b6b69] bg-[#555653] shadow-[0_16px_32px_#0008]" aria-hidden="true" />

            <div className={`absolute inset-0 flex flex-col px-[19px] pt-[24px] pb-[19px] ${paper}`}>
              <PaperGrain id="agreement-inside-grain" />
              <div className="relative flex items-start justify-between gap-2">
                <h3 className="font-serif text-[19px] leading-[23px] tracking-[-0.035em]">Project agreement</h3>
                <span aria-hidden="true" className={`flex size-[17px] shrink-0 items-center justify-center rounded-full border border-[#444] text-[11px] transition-opacity duration-500 ${phase === 2 ? "opacity-100" : "opacity-0"}`}>✓</span>
              </div>
              <dl className="relative mt-[22px] grid grid-cols-[53px_1fr] gap-y-[9px] border-t border-[#aaa9a3] pt-[14px] text-[10px] leading-[14px]">
                <dt className="text-[#686864]">Project</dt><dd>Coastal residence</dd>
                <dt className="text-[#686864]">Architect</dt><dd>ZZ Architects</dd>
              </dl>
              <p className="relative mt-[20px] border-t border-[#bdbcb5] pt-[14px] text-[9px] leading-[14px] text-[#575753]">Scope · Deliverables<br />Timeline · Fees</p>
              <div className="relative mt-auto grid grid-cols-2 gap-[13px]">
                <Signature kind="client" visible={open} complete={phase === 2} />
                <Signature kind="architect" visible={open} complete={phase === 2} />
              </div>
              <p className="relative mt-[17px] border-t border-[#aaa9a3] pt-[10px] text-center text-[9px] text-[#565653]">Managed by kai.ros Studio</p>
            </div>

            <div className={`absolute inset-0 z-10 origin-left transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none [transform-style:preserve-3d] ${open ? "[transform:rotateY(-180deg)]" : "[transform:rotateY(0deg)]"}`}>
              <div className={`absolute inset-0 flex flex-col px-[18px] pt-[24px] pb-[18px] [backface-visibility:hidden] ${paper}`}>
                <PaperGrain id="agreement-cover-grain" />
                <p className="relative max-w-[155px] font-mono text-[11px] leading-[15px] font-medium tracking-[0.08em] uppercase">Engagement &amp;<br />collaboration</p>
                <p className="relative mt-[30px] max-w-[166px] text-[18px] leading-[21px] font-medium tracking-[-0.04em]">Great spaces start with everyone on the same page. Clear scope. Shared expectations. A partnership ready to build.</p>
                <Image src="/home/hero/header-mark.png" width={34} height={34} alt="" className="relative mt-auto brightness-0 opacity-65" />
              </div>
              <div className={`absolute inset-0 flex flex-col px-[18px] pt-[24px] pb-[18px] [backface-visibility:hidden] [transform:rotateY(180deg)] ${paper}`}>
                <PaperGrain id="agreement-back-grain" />
                <p className="relative font-mono text-[10px] tracking-[0.08em] uppercase">kai.ros Studio</p>
                <p className="relative mt-[28px] font-serif text-[22px] leading-[25px] tracking-[-0.035em]">A shared foundation for what comes next.</p>
                <div className="relative mt-[24px] space-y-[12px] border-t border-[#aaa9a3] pt-[16px] text-[10px] text-[#555]">
                  <p>Scope and deliverables</p>
                  <p>Timeline and fees</p>
                  <p>One clear agreement</p>
                </div>
                <Image src="/home/hero/header-mark.png" width={30} height={30} alt="" className="relative mt-auto brightness-0 opacity-55" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <StoryboardControls steps={steps} phase={phase} playing={playing} onSelect={select} onToggle={toggle} />
    </div>
  );
}
