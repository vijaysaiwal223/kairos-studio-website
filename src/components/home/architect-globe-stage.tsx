"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { GlobePolaroids } from "@/components/ui/cobe-globe-polaroids";

type GlobeSettings = {
  size: number;
  x: number;
  crop: number;
  rotation: number;
  tilt: number;
  speed: number;
  profileX: number;
  profileY: number;
  autoRotate: boolean;
};

const DEFAULT_SETTINGS: GlobeSettings = {
  size: 800,
  x: 0,
  crop: 260,
  rotation: 135,
  tilt: -25,
  speed: 0.0025,
  profileX: 0,
  profileY: -10,
  autoRotate: true,
};

const STORAGE_KEY = "kairos-globe-settings-v4";
const PREVIOUS_STORAGE_KEY = "kairos-globe-settings-v3";
const TO_DEGREES = 180 / Math.PI;

const controls: { key: Exclude<keyof GlobeSettings, "autoRotate">; label: string; min: number; max: number; step: number; unit: string }[] = [
  { key: "size", label: "Globe size", min: 350, max: 1200, step: 10, unit: "px" },
  { key: "x", label: "Horizontal position", min: -500, max: 500, step: 5, unit: "px" },
  { key: "crop", label: "Bottom crop", min: -100, max: 500, step: 5, unit: "px" },
  { key: "rotation", label: "Rotation", min: 0, max: 360, step: 1, unit: "°" },
  { key: "tilt", label: "Tilt", min: -40, max: 40, step: 1, unit: "°" },
  { key: "speed", label: "Spin speed", min: 0, max: 0.01, step: 0.0005, unit: "" },
  { key: "profileX", label: "Profile left / right", min: -250, max: 250, step: 5, unit: "px" },
  { key: "profileY", label: "Profile up / down", min: -250, max: 250, step: 5, unit: "px" },
];

function loadSettings(): GlobeSettings {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const saved = JSON.parse(current ?? localStorage.getItem(PREVIOUS_STORAGE_KEY) ?? "{}") as Partial<GlobeSettings>;
    return {
      size: Number.isFinite(saved.size) ? Math.max(350, Math.min(1200, saved.size!)) : DEFAULT_SETTINGS.size,
      x: Number.isFinite(saved.x) ? Math.max(-500, Math.min(500, saved.x!)) : DEFAULT_SETTINGS.x,
      crop: current && Number.isFinite(saved.crop) ? Math.max(-100, Math.min(500, saved.crop!)) : DEFAULT_SETTINGS.crop,
      rotation: Number.isFinite(saved.rotation) ? Math.max(0, Math.min(360, saved.rotation!)) : DEFAULT_SETTINGS.rotation,
      tilt: Number.isFinite(saved.tilt) ? Math.max(-40, Math.min(40, saved.tilt!)) : DEFAULT_SETTINGS.tilt,
      speed: Number.isFinite(saved.speed) ? Math.max(0, Math.min(0.01, saved.speed!)) : DEFAULT_SETTINGS.speed,
      profileX: Number.isFinite(saved.profileX) ? Math.max(-250, Math.min(250, saved.profileX!)) : DEFAULT_SETTINGS.profileX,
      profileY: Number.isFinite(saved.profileY) ? Math.max(-250, Math.min(250, saved.profileY!)) : DEFAULT_SETTINGS.profileY,
      autoRotate: typeof saved.autoRotate === "boolean" ? saved.autoRotate : DEFAULT_SETTINGS.autoRotate,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function ArchitectGlobeStage() {
  const [settings, setSettings] = useState<GlobeSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSettings(loadSettings());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [ready, settings]);

  const change = (key: Exclude<keyof GlobeSettings, "autoRotate">, value: number) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
      autoRotate: key === "rotation" || key === "tilt" ? false : current.autoRotate,
    }));
    setCopied(false);
  };

  const openControls = () => {
    setOpen(true);
    setSettings((current) => ({ ...current, autoRotate: false }));
  };

  const copySettings = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden border-b border-white/10">
      <GlobePolaroids
        className="absolute -translate-x-1/2"
        style={{
          width: `min(${settings.size}px, calc(100svh - 100px), calc(100vw + 40px))`,
          left: `calc(50% + ${settings.x}px)`,
          bottom: `max(-${settings.crop}px, calc(-32.5vw - 13px))`,
        } as CSSProperties}
        rotation={{ phi: settings.rotation / TO_DEGREES, theta: settings.tilt / TO_DEGREES }}
        speed={settings.speed}
        autoRotate={settings.autoRotate}
        profileOffset={{ x: settings.profileX, y: settings.profileY }}
        onViewChange={(view) => {
          setSettings((current) => ({
            ...current,
            rotation: Math.round(((view.phi * TO_DEGREES) % 360 + 360) % 360),
            tilt: Math.round(view.theta * TO_DEGREES),
            autoRotate: false,
          }));
        }}
      />

      {!open && (
        <button
          type="button"
          onClick={openControls}
          className="absolute right-[24px] top-[24px] z-30 rounded-[8px] border border-white/15 bg-[#252525]/90 px-[14px] py-[9px] font-[family-name:var(--font-geist-mono)] text-[12px] tracking-[0.08em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-[#353535] focus-visible:outline-2 focus-visible:outline-[#83ff83] max-[700px]:right-[12px] max-[700px]:top-[12px]"
        >
          Tune globe
        </button>
      )}

      {open && (
        <aside aria-label="Globe controls" className="absolute right-[24px] top-[24px] z-30 max-h-[calc(100%-48px)] w-[310px] max-w-[calc(100%-24px)] overflow-y-auto rounded-[12px] border border-white/15 bg-[#252525]/95 p-[16px] text-white shadow-[0_18px_48px_#0008] backdrop-blur-md max-[700px]:right-[12px] max-[700px]:top-[12px] max-[700px]:max-h-[calc(100%-24px)]">
          <div className="mb-[14px] flex items-center justify-between gap-[12px]">
            <h3 className="m-0 font-[family-name:var(--font-geist-mono)] text-[13px] font-normal tracking-[0.08em] uppercase">Tune globe</h3>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close globe controls" className="flex size-[28px] items-center justify-center rounded-[6px] bg-white/10 text-[18px] leading-none hover:bg-white/20">×</button>
          </div>

          <label className="mb-[14px] flex items-center justify-between text-[13px]">
            <span>Auto rotate</span>
            <input
              type="checkbox"
              checked={settings.autoRotate}
              onChange={(event) => setSettings((current) => ({ ...current, autoRotate: event.target.checked }))}
              className="size-[17px] accent-[#83ff83]"
            />
          </label>

          <div className="space-y-[12px]">
            {controls.map((control) => (
              <label key={control.key} className="block">
                <span className="mb-[4px] flex items-center justify-between gap-[12px] text-[12px]">
                  <span>{control.label}</span>
                  <output className="font-[family-name:var(--font-geist-mono)] tabular-nums text-[#83ff83]">
                    {control.key === "speed" ? settings.speed.toFixed(4) : settings[control.key]}{control.unit}
                  </output>
                </span>
                <input
                  type="range"
                  aria-label={control.label}
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={settings[control.key]}
                  onChange={(event) => change(control.key, Number(event.target.value))}
                  className="block h-[20px] w-full cursor-pointer accent-[#83ff83]"
                />
              </label>
            ))}
          </div>

          <div className="mt-[16px] flex gap-[8px]">
            <button type="button" onClick={copySettings} className="flex-1 rounded-[6px] bg-[#83ff83] px-[10px] py-[8px] text-[12px] font-medium text-[#151515] hover:bg-[#a4ffa4]">
              {copied ? "Copied" : "Copy values"}
            </button>
            <button type="button" onClick={() => { setSettings(DEFAULT_SETTINGS); setCopied(false); }} className="rounded-[6px] border border-white/20 px-[10px] py-[8px] text-[12px] hover:bg-white/10">
              Reset
            </button>
          </div>
          <p className="mt-[8px] mb-[6px] text-[11px] leading-[15px] text-white/60">Send me these values once the globe looks right:</p>
          <textarea readOnly aria-label="Current globe values" value={JSON.stringify(settings, null, 2)} onFocus={(event) => event.currentTarget.select()} className="h-[112px] w-full resize-none rounded-[6px] border border-white/10 bg-black/25 p-[8px] font-[family-name:var(--font-geist-mono)] text-[10px] leading-[14px] text-white/75 focus-visible:outline-2 focus-visible:outline-[#83ff83]" />
        </aside>
      )}
    </div>
  );
}
