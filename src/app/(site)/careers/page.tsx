import type { Metadata } from "next";
import Link from "next/link";
import { ArchImage } from "@/components/ArchImage";
import { Heading, PageHero } from "@/components/ui";
import { company } from "@/lib/content";
import { getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Green-Building Creations Ltd. in Cape Coast, Ghana.",
};
export const revalidate = 60;

export default async function CareersPage() {
  const content = await getContent();
  const subject = encodeURIComponent("Career enquiry");
  return (
    <>
      <PageHero eyebrow="Join our team" title="Build Your Future With Us">
        Planning, design and construction careers in Cape Coast.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="max-w-md">
            <Heading eyebrow="Careers at GBC" title="Work with a team that plans, designs and builds" />
            <p className="text-lead mt-7">{content["home.careers"]}</p>
            <p className="text-body mt-5">
              We don&apos;t have open positions listed here at the moment. If you&apos;d like to be considered for future roles, send your CV and a short note about the work you&apos;re interested in.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`mailto:${company.email}?subject=${subject}`}
                className="group inline-flex items-center gap-2 bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone hover:bg-ink-soft"
              >
                Email your CV
              </a>
              <Link href="/contact" className="inline-flex items-center border border-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink hover:bg-ink hover:text-bone">
                Contact us
              </Link>
            </div>
          </div>
          <div className="relative pb-3 pr-3">
            <div aria-hidden className="absolute bottom-0 left-3 right-0 top-3 border-[3px] border-sage" />
            <ArchImage alt="GBC engineers reviewing plans on a building site" variant={4} position="center 35%" className="relative aspect-[16/10] w-full" />
          </div>
        </div>
      </section>
    </>
  );
}
