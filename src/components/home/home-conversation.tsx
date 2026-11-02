import Image from "next/image";

import { Eyebrow } from "@/components/ui/eyebrow";
import { GuideRailBlinks } from "@/components/ui/guide-blinks";
import { SplitText } from "@/components/ui/split-text";

/** Figma 140:3509 — the homepage closing invitation. */
export function HomeConversation() {
  return (
    <section
      id="contact"
      aria-labelledby="home-conversation-heading"
      className="relative bg-[var(--ink-ground)] px-[40px] font-[family-name:var(--font-geist)] text-white max-[700px]:px-[20px]"
    >
      <GuideRailBlinks />
      <div className="relative flex h-[651px] items-center justify-center overflow-hidden border border-white/10 max-[700px]:h-[620px]">
        <Image
          src="/home/conversation-outline.png"
          alt=""
          fill
          sizes="(max-width: 700px) calc(100vw - 40px), calc(100vw - 80px)"
          className="object-fill [filter:brightness(3)] max-[700px]:object-cover opacity-20"
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(26,26,26,0.95)_0%,rgba(26,26,26,0.8)_28%,rgba(26,26,26,0)_75%)]"
        />

        <div className="relative z-10 flex h-[300px] w-[660px] max-w-full flex-col items-center justify-center px-[40px] py-[40px] text-center max-[700px]:h-auto max-[700px]:px-[24px] max-[700px]:py-[48px]">
          <Eyebrow className="tracking-[1px]">Start a conversation</Eyebrow>
          <SplitText
            tag="h2"
            id="home-conversation-heading"
            className="mt-[12px] text-[48px] leading-[56px] font-normal tracking-[-0.02em] max-[700px]:text-[38px] max-[700px]:leading-[44px] max-[480px]:text-[32px] max-[480px]:leading-[38px]"
          >
            Every great build begins
            <br />
            with understanding
          </SplitText>
          <p className="mt-[12px] max-w-[578px] text-[16px] leading-[24px] max-[480px]:text-[14px] max-[480px]:leading-[21px]">
            We listen to what you want to build, bring together the expertise it needs and keep every decision moving in the same direction.
          </p>
        </div>
      </div>
    </section>
  );
}
