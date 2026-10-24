import type { Metadata } from "next";
import { ScrollProgress } from "@/components/ScrollProgress";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Green-Building Creations Ltd. handles the personal information you send through this website.",
};

// Describes what this website actually does with personal data. Update it if the site's data handling changes.
const UPDATED = "22 October 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        This website is run by {company.name} (&ldquo;GBC&rdquo;, &ldquo;we&rdquo;), a design and build firm based in {company.address} (postal address: {company.postal}). For
        anything about your personal information, contact us at <a href={`mailto:${company.email}`} className="underline underline-offset-4">{company.email}</a> or{" "}
        <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="underline underline-offset-4">{company.phone}</a>.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <>
        <p>We only collect what you choose to send us. Through the enquiry forms, that is:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>your name and email address;</li>
          <li>optionally, your phone or WhatsApp number and organisation;</li>
          <li>details of your project: the service and project type, location, timeline, budget range and your message.</li>
        </ul>
        <p>
          If you rate a project, we store your star rating together with a scrambled code made from your connection details (IP address and
          browser type). The code lets us count one rating per visitor; it cannot be turned back into your IP address, and we do not store the
          address itself. Your browser also remembers your own rating on your device so it can show it to you again.
        </p>
        <p>
          We do not use advertising or analytics trackers, and we do not set cookies for visitors. Cookies are only used to keep GBC staff signed in to the
          private staff dashboard.
        </p>
      </>
    ),
  },
  {
    title: "Why we use it",
    body: (
      <p>
        We use your details to reply to your enquiry, discuss your project, and keep a record of our conversation with you. We will not sell your
        information or use it for unrelated marketing.
      </p>
    ),
  },
  {
    title: "Who can see it",
    body: (
      <>
        <p>Your enquiry is seen only by GBC staff who handle enquiries. To run the website we use a small number of service providers:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Supabase, which stores enquiries in a secure database;</li>
          <li>Resend, which sends the acknowledgement email to you and the notification email to our team;</li>
          <li>Vercel, which hosts the website.</li>
        </ul>
        <p>
          These providers may store data outside Ghana. The project map loads map images from OpenStreetMap, which receives your device&apos;s IP
          address in order to send them.
        </p>
      </>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        We keep enquiry records only for as long as we need them to respond to you, carry out any work we agree, and keep proper business records.
        After that we delete them.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        Under Ghana&apos;s Data Protection Act, 2012 (Act 843) you can ask to see the personal information we hold about you, ask us to correct it, or
        ask us to delete it. Email <a href={`mailto:${company.email}`} className="underline underline-offset-4">{company.email}</a> and we will
        respond as soon as we can. If you are unhappy with how we have handled your information, you can contact the Data Protection Commission of
        Ghana.
      </p>
    ),
  },
  {
    title: "Changes",
    body: <p>If we change how we handle personal information, we will update this page and the date below.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <ScrollProgress />
      <PageHero eyebrow="Legal" title="Privacy Policy">
        How we handle the personal information you send through this website.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc max-w-3xl">
          <p className="text-body">
            This policy explains what personal information we collect through this website, why, and the choices you have.
          </p>
          <div className="mt-10 divide-y divide-stone border-y border-stone">
            {sections.map((s, i) => (
              <div key={s.title} className="grid gap-3 py-8 sm:grid-cols-[200px_1fr] sm:gap-10">
                <h2 className="text-base font-semibold text-forest-900">
                  <span className="mr-2 text-[11px] font-semibold tracking-[0.2em] text-muted">0{i + 1}</span>
                  {s.title}
                </h2>
                <div className="text-body space-y-3">{s.body}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">Last updated {UPDATED}.</p>
          <Link href="/contact" className="group mt-8 inline-flex items-center gap-2 border-b border-forest-900 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
