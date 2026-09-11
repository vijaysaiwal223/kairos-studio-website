import type { ComponentPropsWithoutRef, CSSProperties } from "react";

const DEFAULT_HREF = "#";

export interface ArrowFillButtonOwnProps {
  btnText?: string;
  href?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  fillBgColor?: string;
  fillTextColor?: string;
  hoverFillBgColor?: string;
  hoverFillTextColor?: string;
  arrowColor?: string;
  hoverArrowColor?: string;
}

export type ArrowFillButtonProps = ArrowFillButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ArrowFillButtonOwnProps>;

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/**
 * CSS-only arrow CTA. Keeping the interaction in selectors lets this remain a
 * Server Component, so each button adds markup but no hydration, state,
 * timers, media-query listeners, or icon-library JavaScript to the page.
 */
function ArrowFillButton({
  btnText = "Hover Me",
  href = DEFAULT_HREF,
  className = "",
  bgColor = "#ff5f00",
  textColor = "#ffffff",
  fillBgColor = "#ffffff",
  fillTextColor = "#ff5f00",
  hoverFillBgColor = "#ffffff",
  hoverFillTextColor = "#ff5f00",
  arrowColor,
  hoverArrowColor,
  ...props
}: ArrowFillButtonProps) {
  const usesUtilityBackground =
    className.includes("bg-") ||
    className.includes("from-") ||
    className.includes("via-") ||
    className.includes("to-");

  return (
    <a
      href={href}
      {...props}
      className={`group relative inline-flex h-[4.2vw] w-fit min-w-fit max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-full border border-(--btn-bg) px-[3vw] pr-[calc(var(--icon-circle)+var(--icon-right)+2vw)] whitespace-nowrap font-medium text-[1.155vw] leading-none [text-rendering:geometricPrecision] [--icon-circle:3.1vw] [--icon-right:0.55vw] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[11vw] max-[1025px]:px-[5vw] max-[1025px]:pr-[calc(var(--icon-circle)+var(--icon-right)+4vw)] max-[1025px]:text-[3.15vw] max-[1025px]:[--icon-circle:8vw] max-[1025px]:[--icon-right:1.5vw] max-md:h-[15vw] max-md:px-[7vw] max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+5vw)] max-md:text-[4.41vw] max-md:[--icon-circle:11vw] max-md:[--icon-right:2vw] ${
        usesUtilityBackground ? "" : "bg-(--btn-bg)"
      } text-(--btn-text) ${className}`}
      style={
        {
          "--btn-bg": bgColor,
          "--btn-text": textColor,
          "--btn-fill-bg": fillBgColor,
          "--btn-fill-text": fillTextColor,
          "--btn-fill-bg-hover": hoverFillBgColor,
          "--btn-fill-text-hover": hoverFillTextColor,
          "--btn-arrow": arrowColor || fillTextColor,
          "--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
        } as CSSProperties & Record<string, string | number>
      }
    >
      <span className="relative z-1 pb-px">{btnText}</span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-2 rounded-full bg-(--btn-fill-bg) inset-[var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))] transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:inset-0 group-hover:bg-(--btn-fill-bg-hover) group-active:inset-0 group-active:bg-(--btn-fill-bg-hover)"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-2 flex items-center px-[3vw] pr-[calc(var(--icon-circle)+var(--icon-right)+2vw)] text-(--btn-fill-text) [clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle)))] transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:text-(--btn-fill-text-hover) group-hover:[clip-path:inset(0_0_0_0)] group-active:text-(--btn-fill-text-hover) group-active:[clip-path:inset(0_0_0_0)] max-[1025px]:px-[5vw] max-[1025px]:pr-[calc(var(--icon-circle)+var(--icon-right)+4vw)] max-md:px-[7vw] max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+5vw)]"
      >
        <span className="relative z-1 pb-px whitespace-nowrap">{btnText}</span>
      </div>

      <span
        className="pointer-events-none absolute right-[var(--icon-right)] top-1/2 z-3 inline-flex h-[var(--icon-circle)] w-[var(--icon-circle)] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-(--btn-fill-bg) text-(--btn-arrow) transition-colors duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:bg-(--btn-fill-bg-hover) group-hover:text-(--btn-arrow-hover) group-active:bg-(--btn-fill-bg-hover) group-active:text-(--btn-arrow-hover)"
        style={{
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          maskImage: "radial-gradient(white, black)",
        }}
        aria-hidden="true"
      >
        <ArrowIcon className="absolute left-1/2 top-1/2 size-[1.5vw] translate-x-[-170%] -translate-y-1/2 origin-center scale-0 text-current transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-100 group-active:-translate-x-1/2 group-active:-translate-y-1/2 group-active:scale-100 max-[1025px]:size-[4vw] max-md:size-[5vw]" />

        <ArrowIcon className="absolute left-1/2 top-1/2 size-[1.5vw] -translate-x-1/2 -translate-y-1/2 origin-center text-current transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:translate-x-[70%] group-hover:-translate-y-1/2 group-hover:scale-0 group-active:translate-x-[70%] group-active:-translate-y-1/2 group-active:scale-0 max-[1025px]:size-[4vw] max-md:size-[5vw]" />
      </span>
    </a>
  );
}

export default ArrowFillButton;
