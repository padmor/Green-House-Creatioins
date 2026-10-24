// GBC mark: a sage roof line over a squared "G" on a rounded tile (building + Green-Building monogram).
// `light` is the version for dark backgrounds. Temporary until GBC supplies its official logo file.
export function LogoMark({ size = 36, light = false, className = "" }: { size?: number; light?: boolean; className?: string }) {
  const tile = light ? "#f5f3ec" : "#20382f";
  const roof = light ? "#3f6b5a" : "#cad9b9";
  const g = light ? "#20382f" : "#f5f3ec";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`shrink-0 ${className}`} aria-hidden>
      <rect width="40" height="40" rx="9" fill={tile} />
      <path d="M8 17 20 8l12 9" fill="none" stroke={roof} strokeWidth="3.2" strokeLinecap="square" />
      <path d="M27 21H13v10h14v-5h-6" fill="none" stroke={g} strokeWidth="3.2" strokeLinecap="square" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  const ink = light ? "text-white" : "text-forest-900";
  return (
    <span className={`flex items-center gap-3 ${ink}`}>
      <LogoMark light={light} />
      <span className="font-serif text-[23px] font-extrabold leading-none tracking-[0.06em]">GBC</span>
      <span aria-hidden className={`hidden h-7 w-px sm:block ${light ? "bg-white/30" : "bg-forest-900/25"}`} />
      <span className="hidden whitespace-nowrap font-sans text-[9px] font-medium uppercase leading-[1.5] tracking-[0.2em] opacity-80 sm:block">
        Green-Building
        <br />
        Creations Ltd.
      </span>
    </span>
  );
}
