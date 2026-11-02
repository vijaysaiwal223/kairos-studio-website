import Image from "next/image";
import { GuideRailBlinks } from "@/components/ui/guide-blinks";

const CORNERS = [
  { src: "/home/founder/corner-top-left.svg", position: "top-0 left-0" },
  { src: "/home/founder/corner-top-right.svg", position: "top-0 right-0" },
  { src: "/home/founder/corner-bottom-left.svg", position: "bottom-0 left-0" },
  { src: "/home/founder/corner-bottom-right.svg", position: "bottom-0 right-0" },
] as const;

const COLUMNS = Array.from({ length: 80 }, (_, index) => index);
const ROWS = Array.from({ length: 90 }, (_, index) => index);

function FounderGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-[400%] left-1/2 -z-10 h-[1000%] w-[1000%] -translate-x-1/2"
    >
      <div className="flex h-full w-full">
        {COLUMNS.map((column) => (
          <span key={column} className="h-full w-[1.25%] shrink-0 border-l border-dotted border-[#313131]" />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col">
        {ROWS.map((row) => (
          <span key={row} className="h-[1.111111111%] shrink-0 border-t border-dotted border-[#313131]" />
        ))}
      </div>
    </div>
  );
}

/** Figma 131:1601 — founder portrait between a short statement and attribution. */
export function Founder() {
  return (
    <section
      aria-label="Founder"
      className="relative h-[800px] bg-[var(--ink-ground)] px-[40px] font-sans text-white max-[1000px]:h-auto max-[700px]:px-[20px]"
    >
      <GuideRailBlinks />
      <div className="relative flex h-full items-center justify-around overflow-hidden border-x border-white/10 max-[1000px]:flex-col max-[1000px]:gap-[36px] max-[1000px]:px-[40px] max-[1000px]:py-[64px] max-[700px]:px-[24px]">
        <p className="relative z-[1] m-0 max-w-[399px] min-w-0 flex-[1_1_0] text-[16px] leading-[24px] tracking-[1px] max-[1000px]:order-2 max-[1000px]:w-full max-[1000px]:flex-none max-[1000px]:text-center">
          “Better spaces begin with the right people. We bring them together around one shared vision, then guide every decision with clarity and care.”
        </p>

        <div className="relative z-0 h-[450px] w-[400px] max-w-full shrink-0 border border-white/10 max-[1000px]:order-1 max-[700px]:aspect-[400/450] max-[700px]:h-auto">
          <FounderGrid />
          <div className="absolute inset-x-[15px] inset-y-[16.5px] overflow-hidden">
            <Image
              src="/home/founder/portrait.png"
              alt="Portrait accompanying the founder statement"
              fill
              sizes="(max-width: 700px) calc(100vw - 118px), 370px"
              className="object-cover object-center"
            />
          </div>
          {CORNERS.map((corner) => (
            <Image
              key={corner.src}
              src={corner.src}
              alt=""
              width={17}
              height={17}
              className={`pointer-events-none absolute ${corner.position}`}
            />
          ))}
        </div>

        <p className="relative z-[1] m-0 flex max-w-[400px] min-w-0 flex-[1_1_0] items-start gap-[8px] font-mono text-[14px] leading-[24px] tracking-[1px] uppercase max-[1000px]:order-3 max-[1000px]:w-full max-[1000px]:flex-none max-[700px]:flex-wrap max-[700px]:justify-center max-[700px]:text-center">
          <span className="shrink-0 text-[#ff9152]">Lovenish Jindal</span>
          <span aria-hidden="true">/</span>
          <span>Founder &amp; CEO kai.ros Studio</span>
        </p>

      </div>
    </section>
  );
}
