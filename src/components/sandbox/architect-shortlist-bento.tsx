"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { GlobePulse } from "@/components/ui/cobe-globe-pulse";
import { StoryboardControls, useStoryboardPlayback } from "@/components/sandbox/storyboard-playback";

const emptyMarkers: [] = [];
const steps = ["Match", "Shortlist", "Align", "Select"] as const;
const durations = [4000, 2600, 4300, 4600];
const fullTurn = Math.PI * 2;
const tilt = (13 * Math.PI) / 180;

const people = [
  { id: "zz", name: "ZZ Architects", image: "/home/architect-spotlight/zz-architects.png", position: "71% 32%", phase: -130, selected: true },
  { id: "sanjay", name: "Sanjay Puri", image: "/home/architect-spotlight/sanjay-portrait.png", position: "50% 35%", phase: -10, selected: true },
  { id: "zozaya", name: "Zozaya Arquitectos", image: "/projects/casa-pura-vida/architect.jpg", position: "50% 35%", phase: 115, selected: true },
  { id: "extra-one", name: "Network architect", image: "/home/founder/portrait.png", position: "50% 25%", phase: -75, selected: false },
  { id: "extra-two", name: "Network architect", image: "/images/architect-portrait.png", position: "50% 40%", phase: 55, selected: false },
  { id: "extra-three", name: "Network architect", image: "/home/architect-spotlight/zz-luxury-portrait.png", position: "66% 45%", phase: 175, selected: false },
] as const;

function orbitPoint(angle: number) {
  const x = 188 * Math.cos(angle);
  const y = 124 * Math.sin(angle);
  return { x: 250 + x * Math.cos(tilt) - y * Math.sin(tilt), y: 250 + x * Math.sin(tilt) + y * Math.cos(tilt) };
}

function orbitPath(frontOnly: boolean) {
  let path = "";
  for (let i = 0; i <= 120; i += 1) {
    const point = orbitPoint((i / 120) * (frontOnly ? Math.PI : fullTurn));
    path += `${i ? " L" : "M"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }
  return path;
}

const backPath = orbitPath(false);
const frontPath = orbitPath(true);

function Portrait({ src, alt, position, sizes }: { src: string; alt: string; position: string; sizes: string }) {
  return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position }} />;
}

/** Four beats of the step 02 → 03 story, kept at the storyboard's fixed 500px size. */
export function ArchitectShortlistBento() {
  const avatarRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const phaseRef = useRef(0);
  const motionRef = useRef(0);
  const { tileRef, phase, playing, visible, reducedMotion, select, toggle } = useStoryboardPlayback(durations);

  useEffect(() => {
    phaseRef.current = phase;
    if (phase === 0) {
      motionRef.current = performance.now();
      return;
    }
    people.forEach((person, index) => {
      const avatar = avatarRefs.current[person.id];
      if (!avatar) return;
      if (phase === 1 && person.selected) {
        avatar.style.left = "288px";
        avatar.style.top = `${142 + index * 104}px`;
        avatar.style.opacity = "1";
        avatar.style.zIndex = "6";
        avatar.style.transform = "translate(-50%, -50%) scale(.74)";
      } else {
        avatar.style.opacity = "0";
      }
    });
  }, [phase]);

  useEffect(() => {
    if (phase !== 0 || !visible || reducedMotion) return;
    let frame = 0;
    const draw = (time: number) => {
      if (phaseRef.current !== 0) return;
      const travel = ((time - motionRef.current) / 22000) * fullTurn;
      people.forEach((person) => {
        const avatar = avatarRefs.current[person.id];
        if (!avatar) return;
        const angle = (person.phase * Math.PI) / 180 + travel;
        const point = orbitPoint(angle);
        const front = Math.sin(angle);
        avatar.style.left = `${point.x}px`;
        avatar.style.top = `${point.y}px`;
        avatar.style.opacity = `${Math.max(0, Math.min(1, (front + 0.08) * 6))}`;
        avatar.style.zIndex = front >= 0 ? "6" : "1";
        avatar.style.transform = "translate(-50%, -50%) scale(1)";
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [phase, visible, reducedMotion]);

  const showGlobe = phase < 2;
  const showCards = phase >= 2;
  const selected = phase === 3;

  return (
    <div className="w-[500px] shrink-0">
      <div ref={tileRef} role="img" aria-label={`Architect shortlisting storyboard: ${steps[phase]}`} className="relative size-[500px] overflow-hidden border border-white/10 bg-[#0d0f0e] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(#ffffff09_1px,transparent_1px),linear-gradient(90deg,#ffffff09_1px,transparent_1px)] [background-size:50px_50px]" />

        <div className={`absolute inset-0 transition-opacity duration-700 ${showGlobe ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <svg className={`pointer-events-none absolute inset-0 z-0 size-full transition-[transform,opacity] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${phase === 1 ? "-translate-x-[120px] scale-[.72] opacity-45" : "opacity-100"}`} viewBox="0 0 500 500" fill="none" aria-hidden="true">
            <path d={backPath} stroke="white" strokeOpacity="0.34" strokeWidth="1" />
          </svg>
          <GlobePulse markers={emptyMarkers} speed={phase === 0 ? 0.0025 : 0} className={`absolute z-[2] transition-[top,left,width,opacity] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${phase === 1 ? "top-[19%] -left-[7%] w-[65%] opacity-70" : "top-[10%] left-[10%] w-[80%]"}`} />
          <svg className={`pointer-events-none absolute inset-0 z-[3] size-full transition-[transform,opacity] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${phase === 1 ? "-translate-x-[120px] scale-[.72] opacity-50" : "opacity-100"}`} viewBox="0 0 500 500" fill="none" aria-hidden="true">
            <path d={frontPath} stroke="white" strokeOpacity="0.72" strokeWidth="1" />
          </svg>
          {phase === 1 && <svg className="pointer-events-none absolute inset-0 z-[4] size-full" viewBox="0 0 500 500" fill="none" aria-hidden="true"><path d="M 144 225 C 215 130, 224 145, 286 142 M 144 225 C 218 194, 235 250, 286 246 M 144 225 C 218 298, 235 350, 286 350" stroke="white" strokeWidth="1" strokeDasharray="3 5" strokeOpacity=".65" /></svg>}
          {people.map((person) => {
            const point = orbitPoint((person.phase * Math.PI) / 180);
            return <div key={person.id} ref={(node) => { avatarRefs.current[person.id] = node; }} className="absolute z-[6] size-[48px] overflow-hidden rounded-full border border-white/75 bg-[#252525] p-[2px] shadow-[0_8px_20px_#000a] transition-[left,top,opacity,transform] duration-1000 ease-[cubic-bezier(.22,1,.36,1)]" style={{ left: `${point.x.toFixed(3)}px`, top: `${point.y.toFixed(3)}px`, opacity: Math.sin((person.phase * Math.PI) / 180) >= 0 ? 1 : 0, transform: "translate(-50%, -50%)" }}><div className="relative size-full overflow-hidden rounded-full"><Portrait src={person.image} alt="" position={person.position} sizes="48px" /></div></div>;
          })}
        </div>

        <div className={`absolute inset-0 transition-opacity duration-700 ${showCards ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <div className="absolute top-[162px] left-[24px] w-[207px] overflow-hidden rounded-[7px] border border-white/20 bg-[#1b1d1c] shadow-[0_18px_35px_#0008]">
            <div className="relative h-[112px] w-full"><Image src="/projects/house-klaus/hero.jpg" alt="Coastal residence concept" fill sizes="207px" className="object-cover" /></div>
            <div className="p-[13px]"><h3 className="text-[17px] leading-[20px] tracking-[-0.03em]">Coastal residence</h3></div>
          </div>
          <svg className="pointer-events-none absolute top-[110px] left-[226px] h-[288px] w-[48px]" viewBox="0 0 48 288" fill="none" aria-hidden="true"><path d="M0 144 H22 M22 37 V251 M22 37 H48 M22 144 H48 M22 251 H48" stroke={selected ? "#ffffff" : "#ffffff55"} strokeWidth="1" className="transition-colors duration-700" /></svg>
          <div className="absolute top-[102px] right-[17px] flex w-[225px] flex-col gap-[10px]">
            {people.slice(0, 3).map((person, index) => <div key={person.id} className={`relative flex h-[88px] items-center gap-[10px] rounded-[7px] border bg-[#1c1e1d] p-[9px] shadow-[0_12px_24px_#0005] transition-[border-color,opacity,box-shadow,transform] duration-700 ${selected && index === 0 ? "translate-x-[-3px] border-white/85 shadow-[0_0_22px_#ffffff1e]" : selected ? "border-white/10 opacity-35" : "border-white/20"}`}><div className="relative size-[58px] shrink-0 overflow-hidden rounded-[5px] bg-[#b4b4b4]"><Portrait src={person.image} alt={person.name} position={person.position} sizes="58px" /></div><div className="min-w-0"><p className="text-[13px] leading-[16px] font-medium">{person.name}</p></div>{selected && index === 0 && <span className="absolute -top-[7px] -right-[7px] flex size-[18px] items-center justify-center rounded-full bg-white text-[11px] text-[#121512]">✓</span>}</div>)}
          </div>
        </div>
      </div>
      <StoryboardControls steps={steps} phase={phase} playing={playing} onSelect={select} onToggle={toggle} />
    </div>
  );
}
