"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { GlobePulse } from "@/components/ui/cobe-globe-pulse";

const noMarkers: [] = [];
const orbitCenter = { x: 250, y: 250 };
const orbitRadius = { x: 188, y: 124 };
const orbitTilt = (13 * Math.PI) / 180;
const fullTurn = Math.PI * 2;

const profiles = [
  { id: "northwest", phase: -150 },
  { id: "north", phase: -90 },
  { id: "northeast", phase: -30 },
  { id: "southeast", phase: 30 },
  { id: "south", phase: 90 },
  { id: "west", phase: 150 },
] as const;

type Profile = (typeof profiles)[number];

function ArchitectProfile({ profile, register }: { profile: Profile; register: (node: HTMLDivElement | null) => void }) {
  const angle = (profile.phase * Math.PI) / 180;
  const point = orbitPosition(angle);
  const front = Math.sin(angle) >= 0;
  return (
    <div
      ref={register}
      className="absolute aspect-square w-[12%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/75 bg-[#292929] p-[0.5%] shadow-[0_8px_20px_#000a]"
      style={{ left: `${point.x / 5}%`, top: `${point.y / 5}%`, zIndex: front ? 4 : 1, opacity: front ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className="relative size-full overflow-hidden rounded-full bg-[#dedede]">
        <Image
          src="/home/founder/portrait.png"
          alt=""
          fill
          sizes="(max-width: 500px) 12vw, 60px"
          className="object-cover object-[center_28%]"
          priority={profile.id === "northwest"}
        />
      </div>
    </div>
  );
}

function orbitPosition(angle: number) {
  const horizontal = orbitRadius.x * Math.cos(angle);
  const vertical = orbitRadius.y * Math.sin(angle);
  return {
    x: orbitCenter.x + horizontal * Math.cos(orbitTilt) - vertical * Math.sin(orbitTilt),
    y: orbitCenter.y + horizontal * Math.sin(orbitTilt) + vertical * Math.cos(orbitTilt),
  };
}

function makeOrbitPath(frontOnly: boolean) {
  const steps = 120;
  let path = "";
  for (let step = 0; step <= steps; step += 1) {
    const angle = (step / steps) * (frontOnly ? Math.PI : fullTurn);
    const point = orbitPosition(angle);
    path += `${step ? " L" : "M"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }
  return frontOnly ? path : `${path} Z`;
}

const orbitBackPath = makeOrbitPath(false);
const orbitFrontPath = makeOrbitPath(true);

/** Figma 175:4069. The 500px tile scales as a square; its layers keep their drawn proportions. */
export function ArchitectNetworkBento() {
  const tileRef = useRef<HTMLElement>(null);
  const profileRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    const started = performance.now();

    const animate = (time: number) => {
      if (!visible || reducedMotion.matches) return;
      const travel = (Math.max(0, time - started) / 22000) * fullTurn;
      profiles.forEach((profile) => {
        const node = profileRefs.current[profile.id];
        if (!node) return;
        const angle = (profile.phase * Math.PI) / 180 + travel;
        const point = orbitPosition(angle);
        const front = Math.sin(angle);
        node.style.left = `${point.x / 5}%`;
        node.style.top = `${point.y / 5}%`;
        node.style.zIndex = front >= 0 ? "4" : "1";
        node.style.opacity = `${Math.max(0, Math.min(1, (front + 0.08) * 6))}`;
      });
      frame = requestAnimationFrame(animate);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !reducedMotion.matches) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    observer.observe(tile);
    reducedMotion.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <figure
      ref={tileRef}
      aria-label="Global architect network concept with portrait cards orbiting a globe"
      className="relative aspect-square w-full max-w-[500px] overflow-hidden border border-white/10 bg-[#0d0f0e] [container-type:inline-size]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(#ffffff09_1px,transparent_1px),linear-gradient(90deg,#ffffff09_1px,transparent_1px)] [background-size:50px_50px]" />
      <svg className="pointer-events-none absolute inset-0 z-0 size-full" viewBox="0 0 500 500" fill="none" aria-hidden="true">
        <path d={orbitBackPath} stroke="white" strokeOpacity="0.36" strokeWidth="1" />
      </svg>

      <GlobePulse markers={noMarkers} className="absolute top-[10%] left-[10%] z-[2] w-[80%]" />

      <svg className="pointer-events-none absolute inset-0 z-[3] size-full" viewBox="0 0 500 500" fill="none" aria-hidden="true">
        <path d={orbitFrontPath} stroke="white" strokeOpacity="0.82" strokeWidth="1" />
      </svg>

      {profiles.map((profile) => (
        <ArchitectProfile key={profile.id} profile={profile} register={(node) => { profileRefs.current[profile.id] = node; }} />
      ))}
    </figure>
  );
}
