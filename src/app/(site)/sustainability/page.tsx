import type { Metadata } from "next";
import { ArchImage } from "@/components/ArchImage";
import { GetInTouch } from "@/components/GetInTouch";
import { Heading, PageHero, delay } from "@/components/ui";
import { getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sustainability",
  description: "How Green-Building Creations Ltd. approaches environmental responsibility in design and construction.",
};
export const revalidate = 60;

const practices = [
  { title: "Design with the site and climate", text: "Orientation, ventilation and shading are considered early, where they cost least and help most." },
  { title: "Responsible materials", text: "Durable materials that suit the building's life, with careful planning and ordering to avoid waste." },
  { title: "Careful site practice", text: "Tidy, safe sites with attention to waste, dust and the neighbours who live around them." },
  { title: "Buildings made to last", text: "Quality construction reduces repairs and rebuilding, a practical form of sustainability." },
];

export default async function SustainabilityPage() {
  const content = await getContent();
  return (
    <>
      <PageHero eyebrow="Sustainable spaces. Lasting impact." title="Sustainability">
        How we think about the site, the materials and the people who use a building long after we leave.
      </PageHero>

      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="max-w-md">
            <Heading eyebrow="Our approach" title="Building a greener, smarter tomorrow." />
            <p className="text-lead mt-7">{content["sustainability.intro"]}</p>
            <p className="text-body mt-5">
              We do not claim formal green-building certifications on this site. Ask us about the environmental measures that suit your project.
            </p>
          </div>
          <div className="relative pb-3 pr-3">
            <div aria-hidden className="absolute bottom-0 left-3 right-0 top-3 border-[3px] border-sage" />
            <ArchImage alt="Landscaped institutional building with planted courtyard" variant={3} className="relative aspect-[16/10] w-full" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-gbc">
          <Heading eyebrow="In practice" title="What It Means On Our Projects" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {practices.map((pr, i) => (
              <article key={pr.title} data-reveal style={delay((i % 4) * 0.1)} className="rounded-2xl bg-bone p-7 ring-1 ring-stone/60">
                <span aria-hidden className="block h-1 w-10 rounded-full bg-sage" />
                <h3 className="mt-6 text-lg font-semibold leading-snug tracking-[-0.01em] text-forest-900">{pr.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-ink/75">{pr.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <GetInTouch />
    </>
  );
}
