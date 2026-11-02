import { Eyebrow } from "@/components/ui/eyebrow";
import { ArchitectGlobeStage } from "@/components/home/architect-globe-stage";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";

/** Figma 134:2195 — the architect network introduction and globe. */
export function HomeArchitectSpotlight() {
  return (
    <section id="projects" aria-labelledby="hp-architect-heading" className="relative z-[3] h-[100svh] min-h-[640px] bg-[var(--ink-ground)] px-[40px] font-[family-name:var(--font-geist)] text-white max-[700px]:px-[20px]">
      <GuideRailBlinks />
      <div className="flex h-full flex-col border-x border-white/10">
        <div className="relative flex shrink-0 items-center justify-center border-b border-white/10 px-[20px] py-[40px] text-center">
          <GuideRuleBlink className="right-0 bottom-0 left-0 z-[3]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[660px] -translate-x-1/2 border-x border-white/10 max-[700px]:hidden" />
          <div className="relative z-10 flex max-w-[660px] flex-col items-center">
            <Eyebrow>Our architect network</Eyebrow>
            <SplitText tag="h2" id="hp-architect-heading" className="mt-[12px] max-w-[578px] text-[48px] leading-[56px] font-normal tracking-[-0.02em] max-[700px]:text-[38px] max-[700px]:leading-[44px] max-[480px]:text-[32px] max-[480px]:leading-[38px]">
              International expertise,<br className="max-[480px]:hidden" /> chosen for you.
            </SplitText>
            <p className="mt-[12px] max-w-[578px] text-[16px] leading-[24px] max-[480px]:text-[14px] max-[480px]:leading-[21px]">
              Every project deserves the right point of view. We connect your brief with architects whose approach suits its place, purpose and ambition.
            </p>
          </div>
        </div>

        <ArchitectGlobeStage />
      </div>
    </section>
  );
}
