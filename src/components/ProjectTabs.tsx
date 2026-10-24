"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/content";

// Homepage project grid with underline category tabs (client-side filter).
export function ProjectTabs({ projects, categories, heading }: { projects: Project[]; categories: readonly string[]; heading: React.ReactNode }) {
  const [active, setActive] = useState<string>("All");
  const list = active === "All" ? projects : projects.filter((p) => p.category === active);
  const tabs = ["All", ...categories];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        {heading}
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-x-8 gap-y-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={active === t}
              onClick={() => setActive(t)}
              className={`border-b-2 pb-2 text-sm transition-colors ${
                active === t ? "border-forest-900 font-semibold text-forest-900" : "border-transparent text-ink/70 hover:text-forest-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      {list.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No projects in this category yet.</p>
      ) : (
        // Keyed by tab so the cards replay their entrance when the filter changes.
        // Three projects: a large feature card on the left with two stacked on the right.
        <div
          key={active}
          className={`mt-10 grid gap-5 ${list.length >= 3 ? "lg:h-[620px] lg:grid-cols-[1.35fr_1fr] lg:grid-rows-2" : "sm:grid-cols-2"}`}
        >
          {list.slice(0, 3).map((p, i) => (
            <ProjectCard
              key={p.slug}
              p={p}
              i={i}
              feature={list.length >= 3 && i === 0}
              className={
                list.length >= 3
                  ? i === 0
                    ? "aspect-[4/5] sm:aspect-[16/10] lg:row-span-2 lg:aspect-auto"
                    : "aspect-[16/10] lg:aspect-auto"
                  : "aspect-[4/5] sm:aspect-[4/3]"
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
