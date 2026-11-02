import { GuideRuleBlink } from "@/components/ui/guide-blinks";

/** Figma 130:664 — the narrow striped rule between homepage sections. */
export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="relative z-[2] h-[40px] bg-[var(--ink-ground)] px-[40px] max-[700px]:px-[20px]"
    >
      <div className="h-full border border-[#313131] bg-[repeating-linear-gradient(114deg,#313131_0_4px,transparent_4px_10.5px)]" />
      <GuideRuleBlink className="top-0 right-[40px] left-[40px] z-[3] max-[700px]:right-[20px] max-[700px]:left-[20px]" />
    </div>
  );
}
