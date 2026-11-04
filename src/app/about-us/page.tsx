import type { Metadata } from "next";

import { KairosStory } from "@/components/home/kairos-story";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SectionDivider } from "@/components/ui/section-divider";

export const metadata: Metadata = {
  title: "About us | kai.ros Studio",
  description: "Discover the vision, mission and strategy behind kai.ros Studio.",
};

export default function AboutUs() {
  return (
    <main className="bg-[#1a1a1a] text-white">
      <header className="relative flex min-h-[440px] items-center justify-center overflow-hidden px-[40px] pt-[80px] pb-[100px] text-center max-[700px]:min-h-[360px] max-[700px]:px-[20px]">
        <GuideRailBlinks />
        <div className="relative z-[1] max-w-[660px]">
          <p className="mb-[12px] font-[family-name:var(--font-geist-mono)] text-[13px] tracking-[0.12em] uppercase text-white/65">kai.ros Studio</p>
          <h1 className="m-0 text-[clamp(48px,6vw,80px)] leading-[1.05] font-normal tracking-[-0.04em]">About us</h1>
          <p className="mx-auto mt-[24px] mb-0 max-w-[550px] text-[18px] leading-[28px] text-white/75 max-[700px]:text-[16px] max-[700px]:leading-[24px]">
            We bring the right people and ideas together to create better spaces, from the first conversation to the finished place.
          </p>
        </div>
        <GuideRuleBlink className="right-[40px] bottom-0 left-[40px] max-[700px]:right-[20px] max-[700px]:left-[20px]" />
      </header>
      <SectionDivider />
      <KairosStory />
      <SectionDivider />
    </main>
  );
}
