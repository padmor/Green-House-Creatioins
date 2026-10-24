import type { Metadata } from "next";
import { ScrollProgress } from "@/components/ScrollProgress";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GetInTouch } from "@/components/GetInTouch";
import { ProjectGallery } from "@/components/ProjectGallery";
import { RateProject } from "@/components/RateProject";
import { RatingSummary } from "@/components/Stars";
import { Heading, PageHero } from "@/components/ui";
import { getProjects, ratingsEnabled } from "@/lib/data";
import { coverFor } from "@/lib/images";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProjects()).find((x) => x.slug === slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title,
    description: p.summary,
    openGraph: { images: [coverFor(p)] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const all = await getProjects();
  const index = all.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const p = all[index];
  const prev = all.length > 1 ? all[(index - 1 + all.length) % all.length] : null;
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;

  const canRate = ratingsEnabled();
  const images = p.image_urls.length ? p.image_urls : [coverFor(p, index)];
  const text = (p.body || p.summary).split(/\n{2,}/).map((t) => t.trim()).filter(Boolean);
  const facts = [
    ["Category", p.category],
    ["Location", p.location],
    ["Year", p.year ? String(p.year) : null],
    ["Scope", p.scope],
    ["Client", p.client],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <ScrollProgress />
      <PageHero eyebrow={p.category} title={p.title} image={images[0]} imageAlt={`${p.title}, ${p.location}`} />

      {/* Key facts strip */}
      <section aria-label="Project facts" className="border-b border-stone bg-white">
        <dl className="container-gbc grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
          {facts.map(([k, v]) => (
            <div key={k} className="border-stone py-6 pr-6 [&:not(:last-child)]:sm:border-r sm:pl-6 sm:first:pl-0">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{k}</dt>
              <dd className="mt-2 text-sm font-semibold text-forest-900">{v}</dd>
            </div>
          ))}
          {p.rating && (
            <div className="border-stone py-6 pr-6 sm:pl-6">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Visitor rating</dt>
              <dd className="mt-2">
                <RatingSummary rating={p.rating} size={14} />
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="max-w-md">
            <Heading eyebrow="Project overview" title="About the Project" />
            <div className="text-body mt-6 space-y-4">
              {text.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {canRate && (
              <div className="mt-8">
                <RateProject slug={p.slug} title={p.title} initial={p.rating} />
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <Link href="/projects" className="group inline-flex items-center gap-2 border-b border-forest-900 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">
                <span aria-hidden className="transition-transform group-hover:-translate-x-1">←</span> All projects
              </Link>
              <Link href="/map" className="group inline-flex items-center gap-2 border-b border-forest-900 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">
                See on project map
              </Link>
            </div>
          </div>
          <div>
            <ProjectGallery images={images} title={p.title} />
          </div>
        </div>
      </section>

      {/* Previous / next project */}
      {prev && next && (
        <nav aria-label="More projects" className="border-t border-stone bg-white">
          <div className="container-gbc grid sm:grid-cols-2">
            {[
              { label: "Previous project", q: prev, i: (index - 1 + all.length) % all.length, align: "" },
              { label: "Next project", q: next, i: (index + 1) % all.length, align: "sm:flex-row-reverse sm:text-right" },
            ].map(({ label, q, i, align }) => (
              <Link
                key={label}
                href={`/projects/${q.slug}`}
                className={`group flex items-center gap-5 border-stone py-8 first:border-b sm:first:border-b-0 sm:first:border-r sm:first:pr-8 sm:last:pl-8 ${align}`}
              >
                <span className="relative h-20 w-28 shrink-0 overflow-hidden bg-forest-900">
                  <Image src={coverFor(q, i)} alt="" fill sizes="112px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {label === "Previous project" ? "← " : ""}{label}{label === "Next project" ? " →" : ""}
                  </span>
                  <span className="mt-1.5 block text-base font-semibold text-forest-900 group-hover:text-forest-600">{q.title}</span>
                  <span className="mt-1 block text-xs text-muted">{q.category}</span>
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      <GetInTouch />
    </>
  );
}
