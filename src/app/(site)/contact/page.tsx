import type { Metadata } from "next";
import { CopyButton } from "@/components/CopyButton";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ProjectMapLazy } from "@/components/ProjectMapLazy";
import { Heading, PageHero } from "@/components/ui";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project enquiry with Green-Building Creations Ltd. in Cape Coast, Ghana.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact Us">
        Tell us about your project and a member of the team will get back to you.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div id="enquiry" className="scroll-mt-24">
            <Heading eyebrow="Project enquiry" title="Let's Build Something Great" />
            <p className="text-body mb-10 mt-5">
              Tell us about your project and a member of the GBC team will get back to you.
            </p>
            <EnquiryForm />
          </div>
          <aside className="space-y-8">
            <div className="h-[280px] overflow-hidden border border-stone">
              <ProjectMapLazy zoom={12} interactive={false} />
            </div>
            <dl className="space-y-5 text-sm">
              {[
                ["Phone", <span key="p" className="flex items-center justify-between gap-3"><a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-forest-600">{company.phone}</a><CopyButton value={company.phone} label="Phone number" /></span>],
                ["Email", <span key="e" className="flex items-center justify-between gap-3"><a href={`mailto:${company.email}`} className="hover:text-forest-600">{company.email}</a><CopyButton value={company.email} label="Email address" /></span>],
                ["Location", company.address],
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
