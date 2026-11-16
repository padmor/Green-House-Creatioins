import type { Metadata } from "next";
import Link from "next/link";
import { GetInTouch } from "@/components/GetInTouch";
import { ProjectCard } from "@/components/ProjectCard";
import { Heading, PageHero } from "@/components/ui";
import { projectCategories } from "@/lib/content";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Selected Project Experience",
  description: "Publicly documented project references and company-stated portfolio experience from Green-Building Creations Ltd. in Ghana.",
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
      <PageHero eyebrow="Our work" title="Selected Project Experience">
        Public project references and building types GBC identifies in its company profile. Each entry distinguishes a documented built-work contribution, a published project brief and broader company-stated experience. Exact client and site details are shown only where publicly available.
      </PageHero>
      <section className="bg-white py-16 lg:py-24" aria-labelledby="all-projects">
        <div className="container-gbc">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Heading id="all-projects" eyebrow="Portfolio references" title={category ?? "All Projects"} />
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
          <p className="mt-8 max-w-3xl border-l-2 border-sage pl-4 text-xs leading-relaxed text-muted">
            Portfolio note: some entries describe experience stated in GBC's public company profile rather than separately named case studies. Published project briefs are not presented as completed buildings. Illustrative images are labelled and should not be mistaken for project photographs.
          </p>
        </div>
      </section>
      <GetInTouch />
    </>
  );
}
