"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/content";

// Homepage project grid with category tabs. All documented entries remain visible.
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
        <div key={active} className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <ProjectCard
              key={p.slug}
              p={p}
              i={i}
              className="aspect-[4/5] sm:aspect-[4/3] xl:aspect-[4/5]"
            />
          ))}
        </div>
      )}
    </>
  );
}
