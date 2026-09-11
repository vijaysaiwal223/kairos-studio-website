"use client";

import { useMemo, useState } from "react";
import DottedMap from "dotted-map";

type Location = { lat: number; lng: number; label: string };
type WorldMapProps = { locations: Location[]; lineColor?: string };
type Point = { x: number; y: number };

const MAP_WIDTH = 800;
const MAP_HEIGHT = 400;

function toPoint(lat: number, lng: number): Point {
  return { x: (lng + 180) * (MAP_WIDTH / 360), y: (90 - lat) * (MAP_HEIGHT / 180) };
}

/** A CSS-motion adaptation of the supplied dotted-map component. */
export function WorldMap({ locations, lineColor = "#d8ff6a" }: WorldMapProps) {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);
  const mapSvg = useMemo(
    () => map.getSVG({ radius: 0.22, color: "#ffffff42", shape: "circle", backgroundColor: "transparent" }),
    [map],
  );

  return (
    <div className="world-map" role="region" aria-label="Kai.ros global network">
      <div aria-hidden className="world-map-dots" style={{ backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(mapSvg)}")` }} />
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="world-map-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {locations.map((location, index) => {
          const point = toPoint(location.lat, location.lng);
          return <g key={`${location.label}-${index}`} className="world-map-location" onMouseEnter={() => setActiveLocation(location.label)} onMouseLeave={() => setActiveLocation(null)}>
            <circle cx={point.x} cy={point.y} r="9" fill="transparent" />
            <circle cx={point.x} cy={point.y} r="3" fill={lineColor} />
            <circle cx={point.x} cy={point.y} r="3" fill={lineColor} className="world-map-pulse" />
            <foreignObject x={point.x + 9} y={point.y - 14} width="130" height="28"><div className="world-map-label">{location.label}</div></foreignObject>
          </g>;
        })}
      </svg>
      <p className="world-map-tooltip" aria-live="polite">{activeLocation ?? "Selected sites across our network"}</p>
    </div>
  );
}
