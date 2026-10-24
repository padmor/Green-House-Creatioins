// Small tracked uppercase eyebrow above section headings (e.g. "ABOUT GBC").
export function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${light ? "text-sage" : "text-forest-900"}`}>
      {children}
    </p>
  );
}
