import type { Metadata } from "next";
import Link from "next/link";
import { GetInTouch } from "@/components/GetInTouch";
import { TradeCategoryCard } from "@/components/TradeCategoryCard";
import { Heading, PageHero } from "@/components/ui";
import { tradeCategories } from "@/lib/content";
import { getVerifiedTradespeople } from "@/lib/tradespeople";

export const metadata: Metadata = {
  title: "Find a Trade",
  description: "Find verified tilers, electricians, plumbers, carpenters and masons through Green-Building Creations in Cape Coast, Ghana.",
};
export const revalidate = 60;

export default async function TradesPage({ searchParams }: { searchParams: Promise<{ trade?: string }> }) {
  const { trade } = await searchParams;
  const professionals = await getVerifiedTradespeople();
  const selected = tradeCategories.find((t) => t.slug === trade);
  const list = selected ? tradeCategories.filter((t) => t.slug === selected.slug) : tradeCategories;
  const tab = (active: boolean) =>
    `border-b-2 pb-2 text-[13px] transition-colors ${active ? "border-forest-900 font-semibold text-forest-900" : "border-transparent text-ink/70 hover:text-forest-900"}`;

  return (
    <>
      <PageHero eyebrow="Find a professional" title="Find a Trade">
        Browse the main trade categories. Public profiles appear only after GBC has completed its identity, qualification, reference and work checks. You can still post a job while a category is being onboarded.
      </PageHero>
      <section className="bg-white py-16 lg:py-24" aria-labelledby="available-trades">
        <div className="container-gbc">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Heading id="available-trades" eyebrow="Trade directory" title={selected?.name ?? "Trades we coordinate"} />
            <nav aria-label="Filter by trade" className="flex flex-wrap gap-x-7 gap-y-2">
              <Link href="/projects" className={tab(!selected)} aria-current={!selected ? "page" : undefined}>All trades</Link>
              {tradeCategories.map((item) => (
                <Link key={item.slug} href={`/projects?trade=${item.slug}`} className={tab(selected?.slug === item.slug)} aria-current={selected?.slug === item.slug ? "page" : undefined}>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((category) => (
              <TradeCategoryCard
                key={category.slug}
                category={category}
                professionals={professionals.filter((person) => person.trade === category.singular)}
              />
            ))}
          </div>
          <p className="mt-8 max-w-3xl border-l-2 border-sage pl-4 text-xs leading-relaxed text-muted">
            A “Verified” profile means GBC has completed its stated checks. It is not a government licence or a guarantee of future work quality. Electrical wiring work is subject to the Energy Commission's certification requirements.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact#enquiry" className="btn btn-primary">Post a job</Link>
            <Link href="/careers" className="btn btn-outline">Apply as a tradesperson</Link>
          </div>
        </div>
      </section>
      <GetInTouch />
    </>
  );
}
