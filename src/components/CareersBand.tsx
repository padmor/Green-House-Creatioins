import Link from "next/link";
import { ArchImage } from "./ArchImage";
import { delay } from "./ui";

// Mockup "Join our team" band over a dimmed photo.
export function CareersBand({ text }: { text: string }) {
  return (
    <section className="relative isolate overflow-hidden text-white" aria-labelledby="careers-heading">
      <ArchImage alt="" variant={1} position="center 75%" className="absolute inset-0 -z-10" sizes="100vw" />
      <div className="absolute inset-0 -z-10 bg-forest-950/65" />
      <div className="container-gbc grid items-center gap-6 py-16 md:grid-cols-[1.2fr_1fr_auto] md:gap-10 lg:py-20">
        <div data-reveal>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-sage"><span aria-hidden className="h-px w-8 bg-current opacity-50" />Join our team</p>
          <h2 id="careers-heading" className="mt-4 text-[2rem] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[2.6rem]">Build Your Future With Us</h2>
        </div>
        <p data-reveal style={delay(0.12)} className="max-w-sm text-[15px] leading-[1.7] text-white/85 sm:text-base">{text}</p>
        <Link
          data-reveal
          style={delay(0.24)}
          href="/careers"
          className="group inline-flex w-fit items-center gap-2 border border-white/70 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-forest-900"
        >
          View careers
        </Link>
      </div>
    </section>
  );
}
