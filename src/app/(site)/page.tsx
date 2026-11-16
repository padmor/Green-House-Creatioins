import Link from "next/link";
import { ArchImage } from "@/components/ArchImage";
import { CareersBand } from "@/components/CareersBand";
import { GetInTouch } from "@/components/GetInTouch";
import { TeamTeaser } from "@/components/People";
import { ProjectMapLazy } from "@/components/ProjectMapLazy";
import { ProjectTabs } from "@/components/ProjectTabs";
import { Heading, delay } from "@/components/ui";
import { projectCategories } from "@/lib/content";
import { getContent, getPeople, getProjects } from "@/lib/data";
import { toMapProjects } from "@/lib/map";

export const revalidate = 60;

const btn = "group inline-flex items-center gap-2 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors";

export default async function HomePage() {
  const [content, projects, { founder, team }] = await Promise.all([getContent(), getProjects(), getPeople()]);
  const featured = projects.filter((p) => p.featured);
  const shown = featured.length ? featured : projects;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[640px] items-center justify-center overflow-hidden bg-bone text-black lg:h-svh lg:max-h-[720px]">
        <ArchImage
          alt="Modern glass building at dusk with palm trees and a reflecting pool"
          variant={1}
          priority
          sizes="100vw"
          position="center 60%"
          className="absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-bone/65" />
        <div className="container-gbc pb-20 pt-[calc(72px+4rem)] text-center">
          <p className="rise text-[11px] font-semibold uppercase tracking-[0.32em] text-black/70" style={delay(0.2)}>{content["home.hero.eyebrow"]}</p>
          <h1 className="rise mx-auto mt-5 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-bold uppercase leading-[1.02] tracking-tight text-black" style={delay(0.35)}>
            We plan. We design.
            <br />
            We build.
          </h1>
          <p className="rise mx-auto mt-6 max-w-[48ch] text-base leading-relaxed text-black/80 sm:text-lg" style={delay(0.45)}>
            {content["home.hero.subtitle"]}
          </p>
          <div className="rise mt-9 flex flex-wrap items-center justify-center gap-4" style={delay(0.55)}>
            <Link href="/projects" className={`${btn} bg-black text-white hover:bg-black/85`}>
              Our work
            </Link>
            <Link href="/contact#enquiry" className={`${btn} border border-black/55 text-black hover:bg-black hover:text-white`}>
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* About GBC */}
      <section className="bg-bone py-20 lg:py-32" aria-labelledby="about-heading">
        <div className="container-gbc grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="max-w-md">
            <Heading id="about-heading" eyebrow="About GBC" title={content["home.about.title"]} />
            <p data-reveal style={delay(0.12)} className="text-lead mt-7">{content["home.intro"]}</p>
            <Link data-reveal style={delay(0.24)} href="/about" className="group mt-8 inline-flex items-center gap-2 border-b border-forest-900 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">
              Learn more
            </Link>
          </div>
          <div className="relative pb-3 pr-3">
            <div aria-hidden data-reveal style={delay(0.6)} className="absolute bottom-0 left-3 right-0 top-3 border-[3px] border-sage" />
            <div data-reveal className="relative">
              <ArchImage
                alt="Two GBC engineers in hard hats reviewing building plans on site"
                variant={4}
                position="center 35%"
                className="relative aspect-[16/9] w-full"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Documented project experience */}
      <section className="bg-white py-20 lg:py-32" aria-labelledby="projects-heading">
        <div className="container-gbc">
          <ProjectTabs
            projects={shown}
            categories={projectCategories}
            heading={<Heading id="projects-heading" eyebrow="Selected work & project briefs" title="Documented Project Experience" />}
          />
        </div>
      </section>

      {/* Project locations */}
      <section className="grid bg-bone lg:grid-cols-2" aria-labelledby="locations-heading">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-20 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-12">
          <div className="max-w-md">
            <Heading id="locations-heading" eyebrow="Project locations" title="Cape Coast, Ghana" />
            <p data-reveal style={delay(0.12)} className="text-body mt-6">{content["home.locations"]}</p>
            <Link data-reveal style={delay(0.24)} href="/map" className={`${btn} mt-8 bg-ink text-bone hover:bg-ink-soft`}>
              View project map
            </Link>
          </div>
        </div>
        <div className="relative h-[320px] lg:h-auto lg:min-h-[400px]">
          <ProjectMapLazy projects={toMapProjects(projects)} zoom={12} interactive={false} />
        </div>
      </section>

      {(founder || team.length > 0) && <TeamTeaser founder={founder} team={team} />}
      <CareersBand text={content["home.careers"]} />
      <GetInTouch />
    </>
  );
}
