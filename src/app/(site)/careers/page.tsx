import type { Metadata } from "next";
import { ArchImage } from "@/components/ArchImage";
import { TradeApplicationForm } from "@/components/TradeApplicationForm";
import { Heading, PageHero } from "@/components/ui";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Join as a Tradesperson",
  description: "Apply to join GBC's network of tilers, electricians, plumbers, carpenters and masons.",
};

export default function TradespersonPage() {
  return (
    <>
      <PageHero eyebrow="For skilled professionals" title="Join the Trade Network">
        Get considered for genuine job opportunities. Apply with your trade, service area and work background. Every profile is reviewed before it can be listed as verified.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="max-w-md">
            <Heading eyebrow="For tradespeople" title="Put your skills in front of customers" />
            <p className="text-lead mt-7">
              GBC is building a trusted network of tilers, electricians, plumbers, carpenters and masons, starting from {company.city}.
            </p>
            <p className="text-body mt-5">
              Share your experience, the areas you can cover and evidence of your work. Our team will review your application, check references and may arrange a practical assessment before any public profile is approved.
            </p>
            <ul className="mt-7 space-y-3 text-sm text-ink/75">
              <li className="flex gap-3"><span className="text-forest-700">01</span> Submit your details and trade background.</li>
              <li className="flex gap-3"><span className="text-forest-700">02</span> GBC reviews identity, qualifications, references and work evidence.</li>
              <li className="flex gap-3"><span className="text-forest-700">03</span> Only approved profiles are published as verified.</li>
            </ul>
            <div className="relative mt-10 pb-3 pr-3">
              <div aria-hidden className="absolute bottom-0 left-3 right-0 top-3 border-[3px] border-sage" />
              <ArchImage alt="Illustrative image of a tradesperson at a worksite" variant={4} position="center 35%" className="relative aspect-[16/10] w-full" />
              <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.12em] text-muted">Illustrative worksite image</p>
            </div>
          </div>
          <div className="rounded-2xl border border-stone/70 bg-white p-6 sm:p-8">
            <Heading eyebrow="Apply to join" title="Tradesperson application" />
            <p className="mb-7 mt-3 text-sm leading-relaxed text-muted">
              Complete the details below. Your information is sent privately to GBC for review and is not added to the public directory automatically.
            </p>
            <TradeApplicationForm />
          </div>
        </div>
      </section>
    </>
  );
}
