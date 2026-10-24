import type { Metadata } from "next";
import { BadgeCheck, CalendarCheck, HardHat, Leaf, type LucideIcon } from "lucide-react";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ArchImage } from "@/components/ArchImage";
import { GetInTouch } from "@/components/GetInTouch";
import { Heading, PageHero, delay } from "@/components/ui";
import { company, values } from "@/lib/content";
import { FounderFeature, TeamGrid } from "@/components/People";
import { getContent, getPeople } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: "Green-Building Creations Ltd. is a nature-inclusive design and build firm in Cape Coast, Central Region, Ghana.",
};
export const revalidate = 60;

// Each value is illustrated with one of GBC's own photos (see lib/images.ts) plus a small icon badge.
const valueArt: Record<string, { icon: LucideIcon; variant: number; position: string; alt: string }> = {
  Quality: { icon: BadgeCheck, variant: 0, position: "center 40%", alt: "A finished GBC residential building" },
  "Timely delivery": { icon: CalendarCheck, variant: 2, position: "center", alt: "A completed GBC office building" },
  "Safe working environments": { icon: HardHat, variant: 4, position: "center 30%", alt: "GBC engineers in hard hats reviewing plans on site" },
  "Environmental responsibility": { icon: Leaf, variant: 1, position: "30% center", alt: "A building set among palms and greenery" },
};

export default async function AboutPage() {
  const [content, { founder, team }] = await Promise.all([getContent(), getPeople()]);
  return (
    <>
      <ScrollProgress />
      <PageHero eyebrow="About GBC" title="About Us">
        A nature-inclusive design and build firm in Cape Coast, Ghana. We plan, design and build.
      </PageHero>

      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="max-w-md">
            <Heading eyebrow="Our story" title={content["home.about.title"]} />
            <p className="text-lead mt-7">{content["home.intro"]}</p>
            <p className="text-body mt-5">{content["about.story"]}</p>
          </div>
          <div className="relative pb-3 pr-3">
            <div aria-hidden className="absolute bottom-0 left-3 right-0 top-3 border-[3px] border-sage" />
            <ArchImage alt="GBC engineers reviewing building plans on site" variant={4} position="center 35%" className="relative aspect-[16/10] w-full" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-gbc grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Heading eyebrow="Our mission" title="What We Are Here To Do" />
          <blockquote data-reveal className="relative border-l-2 border-sage pl-8">
            <p className="font-serif text-2xl font-medium leading-[1.4] tracking-[-0.015em] text-forest-900 sm:text-[1.9rem]">{company.mission}</p>
            <footer className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{company.name}</footer>
          </blockquote>
        </div>
      </section>

      {/* Values: the heading and the reason behind them stay in view on wide screens while the list scrolls past. */}
      <section className="bg-bone py-16 lg:py-28">
        <div className="container-gbc grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Heading eyebrow="Our values" title="What We Stand For" />
            <p className="text-body mt-6 max-w-sm">
              Every client wants a building that is well made, finished when promised and built without putting anyone at risk. These are the
              standards we hold ourselves to on every site, along with care for the place we build in.
            </p>
          </div>
          <ul>
            {values.map((v, i) => {
              const a = valueArt[v.title] ?? valueArt.Quality;
              const Icon = a.icon;
              return (
                <li key={v.title} data-reveal style={delay(i * 0.12)} className="gbc-value group relative flex items-center gap-5 py-7 sm:gap-8">
                  <div className="relative shrink-0">
                    <div className="gbc-value__photo overflow-hidden rounded-xl">
                      <ArchImage
                        alt={a.alt}
                        variant={a.variant}
                        position={a.position}
                        sizes="(min-width: 640px) 176px, 112px"
                        className="aspect-[4/3] w-28 sm:w-44 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.08]"
                      />
                    </div>
                    <span className="gbc-value__icon absolute -bottom-3 -right-3 grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-sage shadow-[0_8px_18px_-8px_rgba(22,39,32,0.7)] ring-4 ring-bone transition-colors duration-300 group-hover:bg-sage group-hover:text-forest-900">
                      <Icon size={17} strokeWidth={1.75} aria-hidden />
                    </span>
                  </div>
                  <div className="min-w-0 transition-transform duration-300 group-hover:translate-x-1">
                    <h3 className="text-xl font-semibold tracking-[-0.015em] text-forest-900 sm:text-[1.4rem]">{v.title}</h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/75">{v.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {founder && <FounderFeature founder={founder} />}
      <TeamGrid team={team} hasFounder={Boolean(founder)} />

      <GetInTouch />
    </>
  );
}
