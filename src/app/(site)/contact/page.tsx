import type { Metadata } from "next";
import { CopyButton } from "@/components/CopyButton";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Heading, PageHero } from "@/components/ui";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Post a Job",
  description: "Post a trade job request with Green-Building Creations in Cape Coast, Ghana.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="For customers" title="Post a Job">
        Tell us what needs doing, which trade you need and where the work is. The GBC team will review your request and confirm the next step.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div id="enquiry" className="scroll-mt-24">
            <Heading eyebrow="Job request" title="Describe the work you need" />
            <p className="text-body mb-10 mt-5">
              Include the location, the type of work, how soon you need it and any useful details. Do not include passwords or sensitive identity numbers.
            </p>
            <EnquiryForm />
          </div>
          <aside className="space-y-8">
            <div className="rounded-2xl border border-stone bg-white p-7 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-700">What happens next</p>
              <ol className="mt-6 space-y-5">
                {[
                  ["01", "Request received", "Your job request is recorded with a reference."],
                  ["02", "Details checked", "The team may contact you to clarify the scope, location or timing."],
                  ["03", "Professional match", "We check whether a suitable verified tradesperson is available."],
                  ["04", "Quote and schedule", "You discuss the quote and timing before work is agreed."],
                ].map(([n, title, text]) => (
                  <li key={n} className="flex gap-4">
                    <span className="text-xs font-semibold text-forest-700">{n}</span>
                    <span><strong className="block text-sm text-forest-900">{title}</strong><span className="mt-1 block text-sm text-muted">{text}</span></span>
                  </li>
                ))}
              </ol>
            </div>
            <dl className="space-y-5 text-sm">
              {[
                ["Phone", <span key="p" className="flex items-center justify-between gap-3"><a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-forest-600">{company.phone}</a><CopyButton value={company.phone} label="Phone number" /></span>],
                ["Email", <span key="e" className="flex items-center justify-between gap-3"><a href={`mailto:${company.email}`} className="hover:text-forest-600">{company.email}</a><CopyButton value={company.email} label="Email address" /></span>],
                ["Office", company.address],
                ["Postal address", company.postal],
              ].map(([k, v]) => (
                <div key={String(k)} className="border-b border-stone pb-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-900">{k}</dt>
                  <dd className="mt-1 text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
