import Image from "next/image";

import { Eyebrow } from "@/components/ui/eyebrow";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";
import { WhyKairosEmblem } from "@/components/home/why-kairos-emblem";

const REASONS = {
  expertise: {
    title: "Expertise",
    body: "We bring the right architects and specialists to each brief, combining creative thinking with technical experience and care.",
    icon: "/home/why-kairos/expertise-137-2658.svg",
  },
  network: {
    title: "Network",
    body: "Our international network connects projects with proven collaborators, local knowledge and a fresh perspective.",
    icon: "/home/why-kairos/network-137-2680.svg",
  },
  quality: {
    title: "Quality",
    body: "We carry the design intent from concept to delivery, paying close attention to materials, details and the way spaces feel.",
    icon: "/home/why-kairos/quality-137-2703.svg",
  },
  approach: {
    title: "Approach",
    body: "A personal, transparent process keeps you informed, your team aligned and every decision moving toward a shared vision.",
    icon: "/home/why-kairos/approach-137-2717.svg",
  },
} as const;

function Reason({ reason, divided = false }: { reason: (typeof REASONS)[keyof typeof REASONS]; divided?: boolean }) {
  return (
    <article className={`flex min-h-[272px] flex-col gap-[48px] p-[40px] max-[700px]:min-h-[228px] max-[700px]:gap-[24px] max-[700px]:p-[28px] ${divided ? "border-b border-white/10" : ""}`}>
      <Image src={reason.icon} alt="" width={32} height={32} className="block shrink-0" />
      <div>
        <h3 className="text-[24px] leading-[32px] font-normal tracking-[-0.017em]">{reason.title}</h3>
        <p className="mt-[8px] text-[16px] leading-[24px] tracking-[-0.02em] text-[#a8a8a8]">{reason.body}</p>
      </div>
    </article>
  );
}

/** Figma 137:2470 — Why Kairos. */
export function WhyKairos() {
  return (
    <section id="why-kairos" aria-labelledby="why-kairos-heading" className="relative z-[2] bg-[var(--ink-ground)] px-[40px] font-[family-name:var(--font-geist)] text-white max-[700px]:px-[20px]">
      <GuideRailBlinks />
      <div className="border-x border-white/10">
        <header className="relative flex items-center justify-center border-b border-white/10">
          <GuideRuleBlink className="right-0 bottom-0 left-0 z-[3]" />
          <div className="flex w-[660px] max-w-full flex-col items-center justify-center border-x border-white/10 px-[40px] py-[40px] text-center max-[700px]:border-x-0 max-[700px]:px-[20px]">
            <Eyebrow>Why kai.ros</Eyebrow>
            <SplitText tag="h2" id="why-kairos-heading" className="mt-[12px] max-w-[578px] text-[48px] leading-[56px] font-normal tracking-[-0.02em] max-[700px]:text-[38px] max-[700px]:leading-[44px] max-[480px]:text-[32px] max-[480px]:leading-[38px]">
              kai.ros here to<br className="max-[480px]:hidden" /> make difference
            </SplitText>
            <p className="mt-[12px] max-w-[578px] text-[16px] leading-[24px] max-[480px]:text-[14px] max-[480px]:leading-[21px]">
              We listen to what you want to build, bring together the expertise it needs and keep every decision moving in the same direction.
            </p>
          </div>
        </header>

        <div className="grid min-h-[546px] grid-cols-[minmax(0,1fr)_480px_minmax(0,1fr)] border-b border-white/10 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
          <div className="grid min-w-0 grid-rows-2 border-r border-white/10 max-[1100px]:order-2 max-[700px]:border-r-0 max-[700px]:border-b">
            <Reason reason={REASONS.expertise} divided />
            <Reason reason={REASONS.network} />
          </div>

          <div className="flex min-w-0 items-center justify-center border-r border-white/10 p-[40px] max-[1100px]:order-1 max-[1100px]:col-span-2 max-[1100px]:border-r-0 max-[1100px]:border-b max-[700px]:col-span-1 max-[700px]:p-[24px]">
            <WhyKairosEmblem />
          </div>

          <div className="grid min-w-0 grid-rows-2 max-[1100px]:order-3">
            <Reason reason={REASONS.quality} divided />
            <Reason reason={REASONS.approach} />
          </div>
        </div>
      </div>
    </section>
  );
}
