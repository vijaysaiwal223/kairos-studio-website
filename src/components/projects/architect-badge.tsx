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
    <p className="credit  [display:flex] [align-items:flex-end] [gap:4px] [padding:8px_12px_8px_0] [border-radius:8px] [background:rgba(0,_0,_0,_0.5)]">
      <span aria-hidden className="credit-marks  [display:flex] [align-items:center] [&_>_*]:[display:block] [&_>_*]:[width:40px] [&_>_*]:[height:40px] [&_>_*]:[flex:none] [&_>_:not(:last-child)]:[margin-right:-12px]">
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
          className="credit-wreath-left  [transform:scaleX(-1)]"
        />
        <span className="credit-avatar  [overflow:hidden] [border-radius:99px] [background:#d9d9d9]">
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
      <span className="credit-text  [display:flex] [flex-direction:column] [align-items:flex-start] [white-space:nowrap]">
        <span className="credit-name  [font-size:var(--type-body)] [line-height:var(--type-body-lh)] [font-weight:600]">{name}</span>
        <span className="credit-role  [font-size:var(--type-caption)] [line-height:var(--type-caption-lh)] [font-weight:500] [color:#dfdfdf]">{base}</span>
      </span>
    </p>
  );
}
