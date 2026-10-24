import type { Metadata } from "next";
import Link from "next/link";
import { GetInTouch } from "@/components/GetInTouch";
import { ProjectCard } from "@/components/ProjectCard";
import { Heading, PageHero } from "@/components/ui";
import { projectCategories } from "@/lib/content";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Featured Projects",
  description: "Residential, commercial and institutional projects by Green-Building Creations Ltd. in Cape Coast, Ghana.",
};
export const revalidate = 60;

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const all = await getProjects();
  const categories = [...new Set([...projectCategories, ...all.map((p) => p.category)])];
  const list = category ? all.filter((p) => p.category === category) : all;
  const tab = (active: boolean) =>
    `border-b-2 pb-2 text-[13px] transition-colors ${active ? "border-forest-900 font-semibold text-forest-900" : "border-transparent text-ink/70 hover:text-forest-900"}`;

  return (
    <>
      <PageHero eyebrow="Our work" title="Featured Projects">
        Residential, commercial and institutional buildings by Green-Building Creations.
      </PageHero>
      <section className="bg-white py-16 lg:py-24" aria-labelledby="all-projects">
        <div className="container-gbc">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Heading id="all-projects" eyebrow="Featured projects" title={category ?? "All Projects"} />
            <nav aria-label="Project categories" className="flex flex-wrap gap-x-8 gap-y-2">
              <Link href="/projects" className={tab(!category)} aria-current={!category ? "page" : undefined}>All</Link>
              {categories.map((c) => (
                <Link key={c} href={`/projects?category=${encodeURIComponent(c)}`} className={tab(category === c)} aria-current={category === c ? "page" : undefined}>
                  {c}
                </Link>
              ))}
            </nav>
          </div>
          {list.length === 0 ? (
            <p className="mt-10 text-sm text-muted">No projects in this category yet.</p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <ProjectCard key={p.slug} p={p} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>
      <GetInTouch />
    </>
  );
}
