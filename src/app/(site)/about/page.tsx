import type { Metadata } from "next";
import Link from "next/link";
import { ScrollProgress } from "@/components/ScrollProgress";
import { GetInTouch } from "@/components/GetInTouch";
import { Heading, PageHero } from "@/components/ui";
import { company, values } from "@/lib/content";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How Green-Building Creations connects customers with skilled, reviewed tradespeople in Ghana.",
};

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <PageHero eyebrow="A practical route to skilled work" title="How It Works">
        GBC brings customers and tradespeople together through a clear job request, professional review and matching process.
      </PageHero>

      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="max-w-md">
            <Heading eyebrow="About GBC" title="A job site built around real trade skills" />
            <p className="text-lead mt-7">
              Green-Building Creations Ltd. is based in {company.city}, Ghana. We are developing a service that helps customers find skilled tilers, electricians, plumbers, carpenters and masons, while giving qualified professionals a way to be considered for genuine work.
            </p>
            <p className="text-body mt-5">
              The website keeps the job request and follow-up process in one place. Customers share what needs doing; tradespeople submit their work background; and GBC reviews applications before publishing verified profiles.
            </p>
          </div>
          <div className="rounded-2xl border border-stone/70 bg-white p-7 sm:p-9">
            <h2 className="text-xl font-semibold text-forest-900">For customers</h2>
            <ol className="mt-5 space-y-4 text-sm text-ink/75">
              <li><strong className="text-forest-900">1. Post the job.</strong> Select the trade, share the job location and explain the work.</li>
              <li><strong className="text-forest-900">2. Confirm the details.</strong> GBC may contact you to clarify the work, timing and budget.</li>
              <li><strong className="text-forest-900">3. Get a suitable match.</strong> The team checks for an appropriate verified professional and availability.</li>
              <li><strong className="text-forest-900">4. Agree the next step.</strong> Discuss the quote and schedule before work starts.</li>
            </ol>
            <Link href="/contact#enquiry" className="btn btn-primary mt-7">Post a job</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-gbc grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Heading eyebrow="For professionals" title="How to join the network" />
          <div className="border-l-2 border-sage pl-7">
            <ol className="space-y-5 text-sm text-ink/75">
              <li><strong className="text-forest-900">Apply with your trade.</strong> Add your service area, experience and training or work evidence.</li>
              <li><strong className="text-forest-900">Complete the review.</strong> GBC checks identity, qualifications or trade evidence, references and practical capability.</li>
              <li><strong className="text-forest-900">Get approved.</strong> Only profiles that meet the review standard can appear publicly as verified.</li>
            </ol>
            <Link href="/careers" className="btn btn-outline mt-7">Apply as a tradesperson</Link>
          </div>
        </div>
      </section>

      <section className="bg-bone py-16 lg:py-28">
        <div className="container-gbc grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <Heading eyebrow="What we stand for" title="The standards behind every connection" />
            <p className="text-body mt-6 max-w-sm">Every job should start with clear expectations and a suitable skill match. These are the principles that guide the way we review, coordinate and follow up.</p>
          </div>
          <ul className="divide-y divide-stone border-y border-stone">
            {values.map((value) => (
              <li key={value.title} className="py-6">
                <h3 className="text-xl font-semibold text-forest-900">{value.title}</h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/75">{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <GetInTouch />
    </>
  );
}
