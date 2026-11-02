/** Figma 250:6260 — the glass section label with its square marker. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p className={`eyebrow [display:inline-flex] [width:fit-content] [margin:0] [align-items:center] [gap:12px] [padding:8px] [border-radius:8px] [background:rgb(255_255_255_/_8%)] [box-shadow:inset_0_0_0_1px_rgb(255_255_255_/_12%)] [backdrop-filter:blur(10px)] [color:#fff] [font-family:var(--font-geist-mono),_monospace] [font-size:14px] [line-height:20px] [letter-spacing:1.68px] [text-transform:uppercase] [&_span]:[width:8px] [&_span]:[height:8px] [&_span]:[flex:none] [&_span]:[background:#fff] ${className}`.trim()}>
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
