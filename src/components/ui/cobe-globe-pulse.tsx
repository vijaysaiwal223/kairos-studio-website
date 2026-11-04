"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";

interface PulseMarker {
  id: string;
  location: [number, number];
  delay: number;
}

interface GlobePulseProps {
  markers?: PulseMarker[];
  className?: string;
  speed?: number;
}

const defaultMarkers: PulseMarker[] = [
  { id: "pulse-london", location: [51.51, -0.13], delay: 0 },
  { id: "pulse-new-york", location: [40.71, -74.01], delay: 0.5 },
  { id: "pulse-tokyo", location: [35.68, 139.65], delay: 1 },
  { id: "pulse-sydney", location: [-33.87, 151.21], delay: 1.5 },
];

/** The supplied COBE globe, adapted for this app's sizing and reduced-motion behavior. */
export function GlobePulse({ markers = defaultMarkers, className = "", speed = 0.003 }: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ phi: 0, theta: 0.2 });
  const dragRef = useRef<{ x: number; y: number; phi: number; theta: number } | null>(null);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let globe: ReturnType<typeof createGlobe> | null = null;
    let frame = 0;
    let visible = false;
    let currentSize = 0;

    const draw = () => {
      if (!visible || reducedMotion.matches || !globe) return;
      if (!dragRef.current) rotationRef.current.phi += speedRef.current;
      globe.update(rotationRef.current);
      frame = requestAnimationFrame(draw);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !reducedMotion.matches) frame = requestAnimationFrame(draw);
      else globe?.update(rotationRef.current);
    };

    const resize = () => {
      const size = Math.round(canvas.getBoundingClientRect().width);
      if (!size || size === currentSize) return;
      currentSize = size;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globe?.destroy();
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: Math.round(size * dpr),
        height: Math.round(size * dpr),
        phi: rotationRef.current.phi,
        theta: rotationRef.current.theta,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [0.5, 0.5, 0.5],
        markerColor: [0.2, 0.8, 0.9],
        glowColor: [0.05, 0.05, 0.05],
        markerElevation: 0,
        markers: markers.map((marker) => ({ id: marker.id, location: marker.location, size: 0.025 })),
        arcs: [],
        arcColor: [0.3, 0.85, 0.95],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      });
      canvas.style.opacity = "1";
      sync();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    visibilityObserver.observe(canvas);
    reducedMotion.addEventListener("change", sync);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      reducedMotion.removeEventListener("change", sync);
      globe?.destroy();
    };
  }, [markers]);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, ...rotationRef.current };
  };
  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    rotationRef.current.phi = drag.phi + (event.clientX - drag.x) / 300;
    rotationRef.current.theta = Math.max(-0.7, Math.min(0.7, drag.theta + (event.clientY - drag.y) / 1000));
  };
  const handlePointerUp = () => { dragRef.current = null; };

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive globe with architect network locations; drag to rotate"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="block size-full cursor-grab touch-none rounded-full opacity-0 transition-opacity duration-700 active:cursor-grabbing motion-reduce:transition-none"
      />
      {markers.map((marker) => (
        <span
          key={marker.id}
          aria-hidden="true"
          className="pointer-events-none absolute flex size-[40px] items-center justify-center transition-[opacity,filter] duration-400"
          style={{
            positionAnchor: `--cobe-${marker.id}`,
            bottom: "anchor(center)",
            left: "anchor(center)",
            translate: "-50% 50%",
            opacity: `var(--cobe-visible-${marker.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${marker.id}, 0)) * 8px))`,
          } as CSSProperties}
        >
          <span className="absolute inset-0 animate-[globe-pulse-expand_2s_ease-out_infinite] rounded-full border-2 border-[#33ccdd] opacity-0 motion-reduce:animate-none" style={{ animationDelay: `${marker.delay}s` }} />
          <span className="absolute inset-0 animate-[globe-pulse-expand_2s_ease-out_infinite] rounded-full border-2 border-[#33ccdd] opacity-0 motion-reduce:animate-none" style={{ animationDelay: `${marker.delay + 0.5}s` }} />
          <span className="size-[10px] rounded-full bg-[#33ccdd] shadow-[0_0_0_3px_#111,0_0_0_5px_#33ccdd]" />
        </span>
      ))}
    </div>
  );
}
