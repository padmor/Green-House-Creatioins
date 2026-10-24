"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { PinIcon } from "./ProjectCard";
import { ProjectMapLazy } from "./ProjectMapLazy";
import type { Selection } from "./ProjectMap";
import { Heading } from "./ui";
import type { MapProject } from "@/lib/map";

// /map: filterable project list beside the interactive map. List and pins stay in sync.
export function MapExplorer({
  projects,
  categories,
  title,
  intro,
}: {
  projects: MapProject[];
  categories: readonly string[];
  title: string;
  intro: string;
}) {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Selection>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const mapBox = useRef<HTMLDivElement>(null);

  const shown = useMemo(() => (category === "All" ? projects : projects.filter((p) => p.category === category)), [category, projects]);
  const anyApprox = shown.some((p) => p.approximate);

  const pickFromList = (slug: string) => {
    setSelected({ slug, from: "list" });
    // On small screens the map sits below the list, so bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) mapBox.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const pickFromMap = (s: Selection) => {
    setSelected(s);
    if (s) document.getElementById(`map-item-${s.slug}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section className="mt-[72px] grid bg-bone lg:h-[calc(100svh-72px)] lg:min-h-[600px] lg:grid-cols-[420px_1fr]" aria-labelledby="map-heading">
      <div className="overflow-y-auto px-5 py-10 sm:px-8 lg:px-10">
        <Heading id="map-heading" eyebrow="Interactive project map" title={title} />
        <p className="text-body mt-5">{intro}</p>

        <div role="group" aria-label="Filter projects by category" className="mt-7 flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => {
                setCategory(c);
                setSelected(null);
              }}
              className={`border px-3.5 py-1.5 text-xs transition-colors ${
                category === c ? "border-ink bg-ink text-bone" : "border-stone text-ink/75 hover:border-ink hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted" aria-live="polite">
          {shown.length} {shown.length === 1 ? "project" : "projects"}
        </p>

        {shown.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No projects in this category yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {shown.map((p) => {
              const active = selected?.slug === p.slug;
              return (
                <li
                  key={p.slug}
                  id={`map-item-${p.slug}`}
                  onMouseEnter={() => setHovered(p.slug)}
                  onMouseLeave={() => setHovered(null)}
                  className={`group relative flex gap-4 border bg-white p-2.5 transition-[border-color,box-shadow] duration-300 ${
                    active ? "border-forest-900 shadow-[0_14px_30px_-20px_rgba(22,41,31,0.7)]" : "border-transparent hover:border-stone"
                  }`}
                >
                  <div className="relative h-[72px] w-[96px] shrink-0 overflow-hidden bg-forest-900">
                    <Image src={p.image} alt="" fill sizes="96px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{p.category}</p>
                    {/* The whole card selects the pin; the arrow link opens the project page. */}
                    <button
                      type="button"
                      onClick={() => pickFromList(p.slug)}
                      aria-pressed={active}
                      className="mt-1 block text-left text-sm font-semibold text-forest-900 after:absolute after:inset-0 hover:text-forest-600"
                    >
                      {p.title}
                      <span className="sr-only"> (show on map)</span>
                    </button>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <PinIcon /> {p.location}
                    </p>
                  </div>
                  <Link
                    href={`/projects/${p.slug}`}
                    aria-label={`View ${p.title}`}
                    className="relative z-10 self-center px-2 text-xs font-semibold uppercase tracking-[0.16em] text-forest-900 underline-offset-4 hover:underline"
                  >
                    View
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div ref={mapBox} className="relative isolate h-[480px] lg:h-auto">
        <ProjectMapLazy projects={shown} selected={selected} hovered={hovered} onSelect={pickFromMap} />
        <div className="pointer-events-none absolute bottom-7 left-3 z-[500] space-y-1.5 bg-bone/95 px-3.5 py-2.5 text-[11px] text-ink/80 shadow-sm">
          <p className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-3 w-3 border-2 border-forest-900 bg-white" /> Project (tap a photo for details)
          </p>
          {anyApprox && (
            <p className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-3 w-3 border-2 border-dashed border-forest-900 bg-white" /> Approximate position, exact site to be added
            </p>
          )}
          <p className="flex items-center gap-2">
            <svg aria-hidden width="12" height="14" viewBox="0 0 28 36" className="text-forest-900"><path d="M14 35s12-11 12-21A12 12 0 0 0 2 14c0 10 12 21 12 21Z" fill="currentColor" /></svg> GBC office
          </p>
        </div>
      </div>
    </section>
  );
}
