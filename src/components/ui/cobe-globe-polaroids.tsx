"use client";

import createGlobe from "cobe";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";

interface GlobeMarker {
  id: string;
  location: [number, number];
  size?: number;
  profile?: { image: string; name: string };
}

interface GlobePolaroidsProps {
  markers?: GlobeMarker[];
  className?: string;
  style?: CSSProperties;
  speed?: number;
  rotation?: { phi: number; theta: number };
  autoRotate?: boolean;
  profileOffset?: { x: number; y: number };
  onViewChange?: (view: { phi: number; theta: number }) => void;
}

const CHANDIGARH_LOCATION: [number, number] = [30.73, 76.78];

const defaultMarkers: GlobeMarker[] = [
  { id: "australia", location: [-33.87, 151.21], size: 0.07 },
  { id: "italy", location: [41.9, 12.5] },
  { id: "new-york", location: [40.71, -74.01] },
  { id: "japan", location: [35.68, 139.65] },
  { id: "south-korea", location: [37.57, 126.98] },
  { id: "portugal", location: [38.72, -9.14] },
  { id: "uk", location: [51.51, -0.13] },
  { id: "switzerland", location: [47.37, 8.54] },
  { id: "chandigarh", location: CHANDIGARH_LOCATION, size: 0.05 },
  { id: "south-africa", location: [-33.92, 18.42] },
  { id: "new-zealand", location: [-36.85, 174.76] },
  { id: "zozaya", location: [40.42, -3.7], profile: { image: "/projects/casa-pura-vida/architect.jpg", name: "Zozaya Arquitectos" } },
  { id: "zz-architects", location: [19.08, 72.88], size: 0, profile: { image: "/home/architect-spotlight/zz-architects.png", name: "ZZ Architects" } },
];

export function GlobePolaroids({
  markers = defaultMarkers,
  className = "relative",
  style,
  speed = 0.003,
  rotation = { phi: 3.1, theta: 0.2 },
  autoRotate = true,
  profileOffset = { x: 0, y: 0 },
  onViewChange,
}: GlobePolaroidsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const rotationRef = useRef(rotation);
  const speedRef = useRef(speed);
  const autoRotateRef = useRef(autoRotate);
  const syncAnimationRef = useRef<() => void>(() => {});
  const pointerRef = useRef<{ x: number; y: number; phi: number; theta: number } | null>(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const nextRotation = { phi: rotation.phi, theta: rotation.theta };
    rotationRef.current = nextRotation;
    globeRef.current?.update(nextRotation);
  }, [rotation.phi, rotation.theta]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (!autoRotate) {
      const nextRotation = { phi: rotation.phi, theta: rotation.theta };
      rotationRef.current = nextRotation;
      globeRef.current?.update(nextRotation);
    }
    syncAnimationRef.current();
  }, [autoRotate, rotation.phi, rotation.theta]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let currentSize = 0;

    const draw = () => {
      if (!visible || motion.matches || !globeRef.current) return;
      if (!pointerRef.current) rotationRef.current.phi += speedRef.current;
      globeRef.current.update(rotationRef.current);
      frame = window.requestAnimationFrame(draw);
    };

    const syncAnimation = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !motion.matches && autoRotateRef.current) frame = window.requestAnimationFrame(draw);
      else globeRef.current?.update(rotationRef.current);
    };
    syncAnimationRef.current = syncAnimation;

    const resize = () => {
      const size = Math.round(canvas.getBoundingClientRect().width);
      if (!size || size === currentSize) return;
      currentSize = size;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globeRef.current?.destroy();
      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: Math.round(size * dpr),
        height: Math.round(size * dpr),
        phi: rotationRef.current.phi,
        theta: rotationRef.current.theta,
        dark: 1,
        diffuse: 1.35,
        mapSamples: 16000,
        mapBrightness: 8,
        baseColor: [0.46, 0.46, 0.46],
        markerColor: [0.88, 0.88, 0.88],
        glowColor: [0.12, 0.12, 0.12],
        markerElevation: 0.02,
        markers: markers.map((marker) => ({ id: marker.id, location: marker.location, size: marker.size ?? 0.025 })),
        arcs: markers
          .filter((marker) => marker.id !== "chandigarh" && marker.id !== "zz-architects")
          .map((marker) => ({
            from: CHANDIGARH_LOCATION,
            to: marker.location,
          })),
        arcColor: [0.72, 0.72, 0.72],
        arcWidth: 0.35,
        arcHeight: 0.18,
      });
      canvas.style.opacity = "1";
      syncAnimation();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    }, { threshold: 0.05 });
    visibilityObserver.observe(canvas);
    motion.addEventListener("change", syncAnimation);
    resize();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motion.removeEventListener("change", syncAnimation);
      globeRef.current?.destroy();
      globeRef.current = null;
      syncAnimationRef.current = () => {};
    };
  }, [markers]);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = { x: event.clientX, y: event.clientY, ...rotationRef.current };
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const pointer = pointerRef.current;
    if (!pointer) return;
    rotationRef.current.phi = pointer.phi + (event.clientX - pointer.x) / 220;
    rotationRef.current.theta = Math.max(-0.7, Math.min(0.7, pointer.theta + (event.clientY - pointer.y) / 600));
    globeRef.current?.update(rotationRef.current);
  };

  const handlePointerUp = () => {
    if (pointerRef.current) onViewChange?.(rotationRef.current);
    pointerRef.current = null;
  };

  return (
    <div className={`aspect-square select-none ${className}`} style={style}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive globe showing kai.ros Studio in Chandigarh connected to its international architect network; drag to rotate"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="block size-full cursor-grab touch-none rounded-full opacity-0 transition-opacity duration-700 active:cursor-grabbing motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 whitespace-nowrap rounded-[4px] border border-white/40 bg-[#1f1f1f]/85 px-[7px] py-[4px] font-[family-name:var(--font-geist-mono)] text-[9px] tracking-[0.06em] text-white/85 uppercase backdrop-blur-sm transition-[opacity,filter] duration-300"
        style={{
          positionAnchor: "--cobe-chandigarh",
          top: "anchor(center)",
          left: "clamp(156px, calc(anchor(center) + 28px), calc(100% - 170px))",
          translate: "0 -50%",
          opacity: "var(--cobe-visible-chandigarh, 0)",
          filter: "blur(calc((1 - var(--cobe-visible-chandigarh, 0)) * 8px))",
        } as CSSProperties}
      >
        kai.ros / Chandigarh
      </div>
      {markers.map((marker) => marker.profile && (
        <div
          key={marker.id}
          aria-hidden="true"
          className="pointer-events-none absolute z-20 h-[146px] w-[116px] bg-[#303030] p-[4px] shadow-[0_8px_28px_#0008] transition-[opacity,filter] duration-300"
          style={{
            positionAnchor: `--cobe-${marker.id}`,
            bottom: "anchor(top)",
            left: "clamp(98px, anchor(center), calc(100% - 98px))",
            translate: `calc(-50% + ${profileOffset.x}px) ${profileOffset.y}px`,
            marginBottom: 8,
            opacity: `var(--cobe-visible-${marker.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${marker.id}, 0)) * 8px))`,
          } as CSSProperties}
        >
          <Image src={marker.profile.image} alt="" width={108} height={114} className="h-[114px] w-[108px] object-cover" />
          <span className="absolute inset-x-[3px] bottom-[4px] text-center font-[family-name:var(--font-geist)] text-[11px] leading-[12px] text-white">
            {marker.profile.name}
          </span>
          <span aria-hidden="true" className="absolute left-0 top-0 size-[12px] border-l border-t border-white/70" />
          <span aria-hidden="true" className="absolute right-0 top-0 size-[12px] border-r border-t border-white/70" />
          <span aria-hidden="true" className="absolute bottom-0 left-0 size-[12px] border-b border-l border-white/70" />
          <span aria-hidden="true" className="absolute bottom-0 right-0 size-[12px] border-b border-r border-white/70" />
        </div>
      ))}
    </div>
  );
}
