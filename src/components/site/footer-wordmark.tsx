const WORDS = ["KAI.R0S", "STUDI0"];

/** Oversized studio wordmark. */
export function FooterWordmark() {
  return (
    <div className="flex h-[max(180px,12vw)] items-center justify-center gap-[clamp(20px,2.6vw,48px)] overflow-hidden font-[family-name:var(--font-geist-mono)] text-[calc(12.487vw_-_11px)] leading-none font-semibold text-white/20 whitespace-nowrap max-[700px]:h-[96px] max-[700px]:text-[10vw] max-[480px]:h-[64px]" aria-label="kai.ros Studio">
      {WORDS.map((word) => (
        <span key={word} aria-hidden="true">{word}</span>
      ))}
    </div>
  );
}
