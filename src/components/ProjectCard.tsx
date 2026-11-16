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

// Project cards disclose record status and label illustrative category images clearly.
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
        alt={p.imageNote ? `${p.category} illustrative architecture visual` : `${p.title}, ${p.location}`}
        variant={artFor(p.category, i)}
        className="absolute inset-0 -z-10 [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.05]"
        sizes={feature ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950/95 via-forest-950/35 to-forest-950/10 transition-opacity duration-500 group-hover:opacity-95" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-forest-950/45 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <span className="bg-bone/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-900">{p.category}</span>
        {p.portfolioStatus && (
          <span className="max-w-[58%] bg-white/90 px-2 py-1 text-right text-[9px] font-semibold uppercase leading-4 tracking-[0.08em] text-forest-900">
            {p.portfolioStatus}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className={`font-semibold leading-tight tracking-[-0.015em] ${feature ? "text-2xl sm:text-[2rem]" : "text-xl"}`}>{p.title}</h3>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
            <PinIcon /> {p.location}
          </p>
          <p className="mt-2 line-clamp-2 max-w-[48ch] text-xs leading-relaxed text-white/85">{p.summary}</p>
          {p.imageNote && (
            <p className="mt-2 inline-block bg-black/55 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-white">
              Illustrative visual
            </p>
          )}
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
