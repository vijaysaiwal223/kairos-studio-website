/** Figma 250:6260 — the glass section label with its square marker. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p className={`eyebrow ${className}`.trim()}>
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
