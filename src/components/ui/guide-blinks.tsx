/** Light traces that sit on the page's existing guide rails and rules. */
export function GuideRailBlinks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden max-[700px]:hidden motion-reduce:hidden">
      <span className="absolute inset-y-0 left-[40px] w-px overflow-hidden">
        <span className="absolute left-0 h-[64px] w-px animate-[guide-rail-blink_7s_linear_infinite] bg-gradient-to-b from-transparent via-[#91ff9b]/75 to-transparent" />
      </span>
      <span className="absolute inset-y-0 right-[40px] w-px overflow-hidden">
        <span className="absolute left-0 h-[64px] w-px animate-[guide-rail-blink_8.3s_linear_infinite] bg-gradient-to-b from-transparent via-[#91ff9b]/75 to-transparent [animation-delay:-3.2s]" />
      </span>
    </div>
  );
}

export function GuideRuleBlink({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute h-px overflow-hidden motion-reduce:hidden ${className}`}>
      <span className="absolute top-0 h-px w-[120px] animate-[guide-rule-blink_5.4s_linear_infinite] bg-gradient-to-r from-transparent via-[#91ff9b]/75 to-transparent" />
    </span>
  );
}
