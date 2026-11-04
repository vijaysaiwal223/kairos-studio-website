"use client";

import { useEffect, useRef, useState } from "react";

export function useStoryboardPlayback(durations: readonly number[]) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(tile);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => { observer.disconnect(); media.removeEventListener("change", sync); };
  }, []);

  useEffect(() => {
    if (!playing || !visible || reducedMotion) return;
    const timer = window.setTimeout(() => setPhase((current) => (current + 1) % durations.length), durations[phase]);
    return () => window.clearTimeout(timer);
  }, [durations, phase, playing, visible, reducedMotion]);

  const select = (index: number) => {
    setPhase(index);
    setPlaying(false);
  };

  return { tileRef, phase, playing, visible, reducedMotion, select, toggle: () => setPlaying((current) => !current) };
}

export function StoryboardControls({ steps, phase, playing, onSelect, onToggle }: {
  steps: readonly string[];
  phase: number;
  playing: boolean;
  onSelect: (index: number) => void;
  onToggle: () => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-between gap-3 text-[12px]">
      <div className="flex gap-4" role="group" aria-label="Animation stages">
        {steps.map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => onSelect(index)}
            aria-pressed={phase === index}
            className={`border-b py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${phase === index ? "border-white text-white" : "border-transparent text-white/45 hover:text-white"}`}
          >
            {step}
          </button>
        ))}
      </div>
      <button type="button" onClick={onToggle} className="py-2 text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
