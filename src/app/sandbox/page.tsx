import type { Metadata } from "next";
import Link from "next/link";

import { ArchitectNetworkBento } from "@/components/sandbox/architect-network-bento";
import { ArchitectShortlistBento } from "@/components/sandbox/architect-shortlist-bento";
import { CollaborationSetupBento } from "@/components/sandbox/collaboration-setup-bento";
import { ConceptDesignBento } from "@/components/sandbox/concept-design-bento";

export const metadata: Metadata = {
  title: "Sandbox | kai.ros Studio",
  description: "Interface experiments for kai.ros Studio.",
  robots: { index: false, follow: false },
};

export default function SandboxPage() {
  return (
    <main className="min-h-svh bg-[#161616] px-[clamp(20px,4vw,64px)] pt-[clamp(32px,6vw,72px)] pb-[120px] font-[family-name:var(--font-geist)] text-white">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex items-end justify-between border-b border-white/15 pb-8">
          <h1 className="text-[48px] leading-none tracking-[-0.04em]">Sandbox</h1>
          <Link href="/" className="text-[14px] text-white/70 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Home ↗</Link>
        </header>

        <section aria-labelledby="architect-network-bento-heading" className="grid gap-8 py-10 lg:grid-cols-[minmax(180px,1fr)_500px] lg:gap-16">
          <h2 id="architect-network-bento-heading" className="text-[28px] leading-[34px] tracking-[-0.03em]">Architect matching</h2>
          <ArchitectNetworkBento />
        </section>
        <section aria-labelledby="architect-shortlist-bento-heading" className="grid gap-8 border-t border-white/15 py-10 lg:grid-cols-[minmax(180px,1fr)_500px] lg:gap-16">
          <h2 id="architect-shortlist-bento-heading" className="text-[28px] leading-[34px] tracking-[-0.03em]">Architect shortlist</h2>
          <ArchitectShortlistBento />
        </section>
        <section aria-labelledby="collaboration-setup-bento-heading" className="grid gap-8 border-t border-white/15 py-10 lg:grid-cols-[minmax(180px,1fr)_500px] lg:gap-16">
          <h2 id="collaboration-setup-bento-heading" className="text-[28px] leading-[34px] tracking-[-0.03em]">Project agreement</h2>
          <CollaborationSetupBento />
        </section>
        <section aria-labelledby="concept-design-bento-heading" className="grid gap-8 border-t border-white/15 py-10 lg:grid-cols-[minmax(180px,1fr)_500px] lg:gap-16">
          <h2 id="concept-design-bento-heading" className="text-[28px] leading-[34px] tracking-[-0.03em]">Concept design</h2>
          <ConceptDesignBento />
        </section>
      </div>
    </main>
  );
}
