import type { CSSProperties, ReactNode } from "react";
import { ArchImage } from "./ArchImage";

// Stagger offset for .rise and [data-reveal] animations (see globals.css).
export const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

// Inner-page hero: dark photo band with a tracked eyebrow and a centred title.
export function PageHero({
  title,
  eyebrow,
  children,
  image,
  imageAlt = "",
}: {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
  image?: string | null;
  imageAlt?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 pt-[72px] text-white">
      <ArchImage src={image} alt={imageAlt} variant={1} priority sizes="100vw" className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-forest-950/55" />
      <div className="container-gbc flex min-h-[320px] flex-col items-center justify-center py-20 text-center lg:min-h-[440px]">
        {eyebrow && <p className="rise mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-sage">{eyebrow}</p>}
        <h1 className="rise text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]" style={delay(0.12)}>{title}</h1>
        {children && <p className="rise mt-6 max-w-[46ch] text-base leading-relaxed text-white/80 sm:text-lg" style={delay(0.24)}>{children}</p>}
      </div>
    </section>
  );
}

// Section heading pair used across pages: eyebrow + heading.
export function Heading({
  eyebrow,
  title,
  light = false,
  className = "",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  light?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div className={className} data-reveal>
      <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] ${light ? "text-sage" : "text-forest-700"}`}>
        <span aria-hidden className="h-px w-8 bg-current opacity-50" />
        {eyebrow}
      </p>
      <h2 id={id} className={`mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.75rem] lg:text-[3rem] ${light ? "text-white" : "text-forest-900"}`}>
        {title}
      </h2>
    </div>
  );
}
