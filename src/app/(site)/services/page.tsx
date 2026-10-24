import type { Metadata } from "next";
import { GetInTouch } from "@/components/GetInTouch";
import { Heading, PageHero, delay } from "@/components/ui";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Planning, architectural design and building construction from Green-Building Creations Ltd., Cape Coast.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="What we do" title="Our Services">
        Planning, architectural design and building construction, with one accountable team from first sketch to handover.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc">
          <Heading eyebrow="Services" title="We Plan. We Design. We Build." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <article key={s.slug} id={s.slug} data-reveal style={delay((i % 3) * 0.1)} className="flex flex-col rounded-2xl bg-white p-8 ring-1 ring-stone/70 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(37,41,37,0.45)] sm:p-9">
                <p className="font-serif text-5xl font-semibold tracking-[-0.04em] text-sage">{s.verb}.</p>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-forest-900">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-ink/75">{s.summary}</p>
                <ul className="mt-6 space-y-2.5 border-t border-stone pt-6 text-[15px] text-ink/80">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden className="text-forest-600">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <GetInTouch />
    </>
  );
}
