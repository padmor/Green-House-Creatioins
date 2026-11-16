import Link from "next/link";
import { ArchImage } from "@/components/ArchImage";
import { CareersBand } from "@/components/CareersBand";
import { GetInTouch } from "@/components/GetInTouch";
import { TeamTeaser } from "@/components/People";
import { TradeCategoryCard } from "@/components/TradeCategoryCard";
import { Heading, delay } from "@/components/ui";
import { tradeCategories } from "@/lib/content";
import { getContent, getPeople } from "@/lib/data";
import { getVerifiedTradespeople } from "@/lib/tradespeople";

export const revalidate = 60;

const btn = "group inline-flex items-center gap-2 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors";

export default async function HomePage() {
  const [content, { founder, team }, professionals] = await Promise.all([
    getContent(),
    getPeople(),
    getVerifiedTradespeople(),
  ]);

  return (
    <>
      {/* Hero — same visual structure, now focused on finding skilled tradespeople */}
      <section className="relative isolate flex min-h-[640px] items-center justify-center overflow-hidden bg-bone text-black lg:h-svh lg:max-h-[720px]">
        <ArchImage
          alt="Illustrative image of building and repair work at a job site"
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
            Find the right hands
            <br />
            for the job.
          </h1>
          <p className="rise mx-auto mt-6 max-w-[48ch] text-base leading-relaxed text-black/80 sm:text-lg" style={delay(0.45)}>
            {content["home.hero.subtitle"]}
          </p>
          <div className="rise mt-9 flex flex-wrap items-center justify-center gap-4" style={delay(0.55)}>
            <Link href="/projects" className={`${btn} bg-black text-white hover:bg-black/85`}>
              Find a trade
            </Link>
            <Link href="/contact#enquiry" className={`${btn} border border-black/55 text-black hover:bg-black hover:text-white`}>
              Post a job
            </Link>
          </div>
        </div>
        <p className="absolute bottom-4 right-5 bg-bone/85 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-black/75">
          Illustrative jobsite image
        </p>
      </section>

      {/* About GBC */}
      <section className="bg-bone py-20 lg:py-32" aria-labelledby="about-heading">
        <div className="container-gbc grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="max-w-md">
            <Heading id="about-heading" eyebrow="A better way to get work done" title={content["home.about.title"]} />
            <p data-reveal style={delay(0.12)} className="text-lead mt-7">{content["home.intro"]}</p>
            <Link data-reveal style={delay(0.24)} href="/about" className="group mt-8 inline-flex items-center gap-2 border-b border-forest-900 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">
              How it works
            </Link>
          </div>
          <div className="relative pb-3 pr-3">
            <div aria-hidden data-reveal style={delay(0.6)} className="absolute bottom-0 left-3 right-0 top-3 border-[3px] border-sage" />
            <div data-reveal className="relative">
              <ArchImage
                alt="Illustrative worksite teamwork image"
                variant={4}
                position="center 35%"
                className="relative aspect-[16/9] w-full"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trade directory preview */}
      <section className="bg-white py-20 lg:py-32" aria-labelledby="trades-heading">
        <div className="container-gbc">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Heading id="trades-heading" eyebrow="Find the skill you need" title="Five core trade categories" />
            <Link href="/projects" className="inline-flex items-center border-b border-forest-900 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">
              View trade directory
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tradeCategories.map((category) => (
              <TradeCategoryCard
                key={category.slug}
                category={category}
                professionals={professionals.filter((person) => person.trade === category.singular)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How the job request works */}
      <section className="grid bg-bone lg:grid-cols-2" aria-labelledby="process-heading">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-20 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-12">
          <div className="max-w-md">
            <Heading id="process-heading" eyebrow="From request to completed work" title="A clear path from job post to job done" />
            <p data-reveal style={delay(0.12)} className="text-body mt-6">
              Share what needs doing, where the work is and when you need it. GBC reviews the request and confirms the next step with you.
            </p>
            <ol className="mt-7 space-y-4">
              {[
                ["01", "Post your job", "Choose a trade and describe the work."],
                ["02", "We review the request", "We confirm details, location and timing."],
                ["03", "Get connected", "We identify a suitable verified professional where available."],
                ["04", "Agree and track", "Discuss the quote, schedule and next steps directly with the team."],
              ].map(([number, title, description]) => (
                <li key={number} className="flex gap-4">
                  <span className="pt-0.5 text-xs font-semibold text-forest-700">{number}</span>
                  <span>
                    <strong className="block text-sm text-forest-900">{title}</strong>
                    <span className="mt-1 block text-sm text-muted">{description}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link data-reveal style={delay(0.24)} href="/contact#enquiry" className={`${btn} mt-8 bg-ink text-bone hover:bg-ink-soft`}>
              Post your job
            </Link>
          </div>
        </div>
        <div className="relative h-[320px] lg:h-auto lg:min-h-[520px]">
          <ArchImage
            alt="Illustrative photo of a trade professional working on site"
            variant={2}
            position="center"
            className="absolute inset-0"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-forest-950/10" />
          <p className="absolute bottom-4 right-5 bg-bone/85 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-black/75">Illustrative worksite image</p>
        </div>
      </section>

      {(founder || team.length > 0) && <TeamTeaser founder={founder} team={team} />}
      <CareersBand text={content["home.careers"]} />
      <GetInTouch />
    </>
  );
}
