import type { Metadata } from "next";
import { GetInTouch } from "@/components/GetInTouch";
import { TradeCategoryCard } from "@/components/TradeCategoryCard";
import { Heading, PageHero } from "@/components/ui";
import { tradeCategories } from "@/lib/content";
import { getVerifiedTradespeople } from "@/lib/tradespeople";

export const metadata: Metadata = {
  title: "Trades & Services",
  description: "Tilers, electricians, plumbers, carpenters and masons coordinated through Green-Building Creations, Cape Coast.",
};

export default async function ServicesPage() {
  const professionals = await getVerifiedTradespeople();
  return (
    <>
      <PageHero eyebrow="What you can request" title="Trades & Services">
        Tell us what needs doing and where. We coordinate job requests across five core trade categories, then confirm availability and next steps with you.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc">
          <Heading eyebrow="Choose a trade" title="The right skill for the work" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
      <GetInTouch />
    </>
  );
}
