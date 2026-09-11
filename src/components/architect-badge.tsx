import Image from "next/image";

/**
 * The architect credit pill.
 * Figma: node 94:561 (featured slides) and node 154:1207 (project showcase).
 *
 * Both nodes are the same component down to the pixel — 8/12/8/0 padding, a
 * 4px gap, bottom-aligned so a two-line name still meets the 40px wreath — so
 * one component serves both and .credit* in globals.css carries the geometry.
 */

type ArchitectBadgeProps = {
  name: string;
  /** The practice's own base, not the project's location. */
  base: string;
  portrait: string;
};

export function ArchitectBadge({ name, base, portrait }: ArchitectBadgeProps) {
  return (
    <p className="credit">
      <span aria-hidden className="credit-marks">
        {/* One exported wreath (node 94:564), mirrored for the left — the two
            Figma exports are the same geometry, mirrored about x=20.5. Served
            as a file rather than inlined: it is ~4.8KB of path data and
            carries clipPath ids that would collide once repeated per slide. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/laurel.svg"
          alt=""
          width={40}
          height={40}
          className="credit-wreath-left"
        />
        <span className="credit-avatar">
          <Image
            src={portrait}
            alt=""
            width={40}
            height={40}
            loading="eager"
            fetchPriority="low"
            className="size-full object-cover"
          />
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/laurel.svg" alt="" width={40} height={40} />
      </span>
      <span className="credit-text">
        <span className="credit-name">{name}</span>
        <span className="credit-role">{base}</span>
      </span>
    </p>
  );
}
