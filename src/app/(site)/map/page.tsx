import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ClipboardCheck, FileCheck2, ShieldCheck } from "lucide-react";
import { Heading, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Trust & Verification",
  description: "How GBC reviews trade identity, experience, qualifications and work evidence before publishing verified profiles.",
};

const checks = [
  { icon: ShieldCheck, title: "Identity review", text: "GBC checks that the applicant is the person represented in the application before a public profile is approved." },
  { icon: FileCheck2, title: "Trade evidence", text: "Training records, trade-test evidence or other relevant credentials are reviewed where provided. Certificate claims are checked against the issuing body where possible." },
  { icon: ClipboardCheck, title: "References and work samples", text: "Work history, customer or supervisor references and portfolio examples are reviewed. A practical assessment may be arranged." },
  { icon: BadgeCheck, title: "Approval before publishing", text: "Only profiles that meet GBC's review checklist can be shown with a verified label. Verification is not a government licence or a guarantee of future performance." },
];

export default function TrustPage() {
  return (
    <>
      <PageHero eyebrow="Trust & verification" title="How We Review Tradespeople">
        A verified label should mean something. GBC checks applicants before their details are made visible to customers.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc">
          <Heading eyebrow="Our review process" title="Four checks before a profile goes live" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {checks.map((item, i) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-stone/70 bg-white p-7 sm:p-8">
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-forest-100 text-forest-900"><Icon size={21} aria-hidden /></span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">0{i + 1}</span>
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-forest-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-white py-16 lg:py-20">
        <div className="container-gbc grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Heading eyebrow="Electrical work" title="Additional checks for electricians" />
            <p className="text-body mt-5">
              Ghana's Energy Commission states that indoor electrical wiring work must be carried out by appropriately certified Electrical Wiring Professionals. GBC therefore requires a verified CEWP credential before an electrician profile can be approved for wiring work.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p><a className="font-semibold text-forest-900 underline underline-offset-4" href="https://energycom.gov.gh/index.php/initiatives/electrical-wiring" target="_blank" rel="noopener noreferrer">Energy Commission — Electrical Wiring</a></p>
              <p><a className="font-semibold text-forest-900 underline underline-offset-4" href="https://www.ctvet.gov.gh/" target="_blank" rel="noopener noreferrer">CTVET — Certificate verification and TVET services</a></p>
            </div>
          </div>
          <div className="rounded-2xl bg-bone p-7 sm:p-8">
            <h2 className="text-xl font-semibold text-forest-900">For customers</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">Share a clear job description, location and timeframe. GBC will check availability and confirm the next step before you proceed.</p>
            <Link href="/contact#enquiry" className="btn btn-primary mt-6">Post a job</Link>
          </div>
        </div>
      </section>
    </>
  );
}
