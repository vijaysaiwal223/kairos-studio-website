import { ArchitectGlobeStage } from "@/components/home/architect-globe-stage";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GuideRailBlinks, GuideRuleBlink } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";

/** The interactive globe that previously followed the architect network introduction. */
export function ArchitectNetworkGlobe() {
  return (
    <section
      id="architect-network-globe"
      aria-labelledby="architect-network-globe-heading"
      className="relative z-[3] h-svh min-h-[640px] bg-[var(--ink-ground)] px-[40px] font-[family-name:var(--font-geist)] text-white max-[700px]:px-[20px]"
    >
      <GuideRailBlinks tone="neutral" />
      <div className="flex h-full flex-col border-x border-white/10">
        <div className="relative flex shrink-0 items-center justify-center border-b border-white/10 px-[20px] py-[40px] text-center">
          <GuideRuleBlink tone="neutral" className="right-0 bottom-0 left-0 z-[3]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[660px] -translate-x-1/2 border-x border-white/10 max-[700px]:hidden" />
          <div className="relative z-10 flex max-w-[660px] flex-col items-center">
            <Eyebrow>Connected by design</Eyebrow>
            <SplitText tag="h2" id="architect-network-globe-heading" className="mt-[12px] max-w-[578px] text-[48px] leading-[56px] font-normal tracking-[-0.02em] max-[700px]:text-[38px] max-[700px]:leading-[44px] max-[480px]:text-[32px] max-[480px]:leading-[38px]">
              Global perspective. A project that feels yours.
            </SplitText>
            <p className="mt-[12px] max-w-[578px] text-[16px] leading-[24px] max-[480px]:text-[14px] max-[480px]:leading-[21px]">
              Our international network brings new ideas to the table. kai.ros keeps them grounded in your brief, your site and the people who will use the space.
            </p>
          </div>
        </div>
        <ArchitectGlobeStage />
      </div>
    </section>
  );
}
