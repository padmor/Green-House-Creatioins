import type { Metadata } from "next";
import { ScrollProgress } from "@/components/ScrollProgress";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Green-Building Creations Ltd. handles customer job requests and tradesperson application information.",
};

const UPDATED = "16 November 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        This website is run by {company.name} (&ldquo;GBC&rdquo;, &ldquo;we&rdquo;), based in {company.address} (postal address: {company.postal}). For questions about your
        personal information, contact us at <a href={`mailto:${company.email}`} className="underline underline-offset-4">{company.email}</a> or{" "}
        <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="underline underline-offset-4">{company.phone}</a>.
      </p>
    ),
  },
  {
    title: "What customers send us",
    body: (
      <>
        <p>When you post a job request, we collect the details you choose to provide:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>your name and email address;</li>
          <li>your phone number and organisation, where provided;</li>
          <li>the trade you need, type of job, work location, timing, budget preference and your description of the work.</li>
        </ul>
      </>
    ),
  },
  {
    title: "What tradespeople send us",
    body: (
      <>
        <p>When you apply to join the trade network, we collect:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>your legal name and the public name you choose for your profile;</li>
          <li>your phone number, email address, trade and service area;</li>
          <li>years of experience, training or trade-evidence details, and any certificate or trade-test reference you choose to provide;</li>
          <li>a CEWP reference for electrician applicants, where applicable;</li>
          <li>an optional work-sample link and short professional introduction.</li>
        </ul>
        <p>
          GBC staff also record private review decisions and notes, such as whether identity, trade evidence, references and practical capability have been checked. These notes are not shown in the public directory.
        </p>
        <p>
          Do not submit your Ghana Card number, password or other sensitive identity numbers through the application form. If GBC needs to inspect supporting evidence, the team will explain how to provide it separately.
        </p>
      </>
    ),
  },
  {
    title: "Why we use the information",
    body: (
      <p>
        We use customer job details to review requests, contact customers and coordinate the next steps. We use tradesperson application details to assess eligibility, verify relevant trade experience and decide whether a profile can be published. We do not sell personal information or use it for unrelated marketing.
      </p>
    ),
  },
  {
    title: "What appears publicly",
    body: (
      <p>
        A tradesperson is not listed automatically after applying. Only after GBC records the required review checks and approves publication may the public directory show the person's chosen display name, trade, service area, years of experience, short bio and optional work-sample link. Private contact details, qualification references and review notes are not displayed on the public profile.
      </p>
    ),
  },
  {
    title: "Who can see the information",
    body: (
      <>
        <p>Private job requests and tradesperson applications are available to authorised GBC staff who handle requests and verification. We use service providers to operate the website:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Supabase, which stores job requests and private tradesperson applications;</li>
          <li>Resend, which sends job-request acknowledgements and notifications to GBC;</li>
          <li>Vercel, which hosts the website.</li>
        </ul>
        <p>
          These providers may process or store data outside Ghana. Public directory profiles expose only the limited fields described above. Customer job details are handled by the GBC team; this website does not automatically publish customer contact details to tradespeople.
        </p>
      </>
    ),
  },
  {
    title: "How long we keep information",
    body: (
      <p>
        We keep job requests and applications for as long as they are needed to respond, coordinate work, review trade applications and maintain appropriate business records. Public profiles remain visible while GBC keeps them approved and published. You may contact us to request access, correction or deletion, subject to records we must retain by law.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        Under Ghana&apos;s Data Protection Act, 2012 (Act 843), you can ask to see personal information we hold about you, ask us to correct it, or ask us to delete it. Email{" "}
        <a href={`mailto:${company.email}`} className="underline underline-offset-4">{company.email}</a> and we will respond as soon as we can. If you are unhappy with how we have handled your information, you can contact the Data Protection Commission of Ghana.
      </p>
    ),
  },
  {
    title: "Changes",
    body: <p>If our data handling changes, we will update this page and the date below.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <ScrollProgress />
      <PageHero eyebrow="Legal" title="Privacy Policy">
        How we handle customer job requests and tradesperson application information.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc max-w-3xl">
          <p className="text-body">
            This policy explains what personal information is collected when you post a job or apply to join the GBC trade network, why it is used and the choices you have.
          </p>
          <div className="mt-10 divide-y divide-stone border-y border-stone">
            {sections.map((section, i) => (
              <div key={section.title} className="grid gap-3 py-8 sm:grid-cols-[200px_1fr] sm:gap-10">
                <h2 className="text-base font-semibold text-forest-900">
                  <span className="mr-2 text-[11px] font-semibold tracking-[0.2em] text-muted">0{i + 1}</span>
                  {section.title}
                </h2>
                <div className="text-body space-y-3">{section.body}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">Last updated {UPDATED}.</p>
          <Link href="/contact" className="group mt-8 inline-flex items-center gap-2 border-b border-forest-900 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">
            Post a job
          </Link>
        </div>
      </section>
    </>
  );
}
