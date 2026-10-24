import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { ArchImage, artFor } from "./ArchImage";
import { RatingSummary } from "./Stars";
import { delay } from "./ui";
import type { Project } from "@/lib/content";

// Standard Lucide map-pin icon.
export function PinIcon({ className = "" }: { className?: string }) {
  return <MapPin size={13} strokeWidth={1.75} className={`shrink-0 ${className}`} aria-hidden />;
}

// Image-led project card: the photo fills the card; category tag and index sit on top,
// title and location over a soft shade at the bottom, with a round arrow button.
// `className` sets the card's shape (portrait by default; the homepage feature card fills its grid cell).
export function ProjectCard({
  p,
  i = 0,
  className = "aspect-[4/5]",
  feature = false,
}: {
  p: Project;
  i?: number;
  className?: string;
  feature?: boolean;
}) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      data-reveal
      style={delay((i % 3) * 0.12)}
      className={`group relative isolate flex flex-col justify-between overflow-hidden bg-forest-900 p-5 text-white sm:p-6 ${className}`}
    >
      <ArchImage
        src={p.image_urls[0]}
        alt={`${p.title}, ${p.location}`}
        variant={artFor(p.category, i)}
        className="absolute inset-0 -z-10 [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.05]"
        sizes={feature ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950/90 via-forest-950/25 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-forest-950/45 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <span className="bg-bone/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-900">{p.category}</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className={`font-semibold leading-tight tracking-[-0.015em] ${feature ? "text-2xl sm:text-[2rem]" : "text-xl"}`}>{p.title}</h3>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-white/75">
            <PinIcon /> {p.location}
          </p>
          {p.rating && <RatingSummary rating={p.rating} size={12} light className="mt-2.5" />}
        </div>
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/40 transition-colors duration-300 group-hover:border-sage group-hover:bg-sage group-hover:text-forest-900"
        >
          <ArrowUpRight size={18} strokeWidth={1.75} className="transition-transform duration-300 group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  );
}
