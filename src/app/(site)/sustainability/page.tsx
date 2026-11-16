import type { Metadata } from "next";
import { ShieldCheck, ClipboardCheck, HardHat, Recycle } from "lucide-react";
import { GetInTouch } from "@/components/GetInTouch";
import { Heading, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Worksite Standards",
  description: "How GBC approaches clear job scopes, worksite safety, trade verification and responsible work practices.",
};

const standards = [
  { icon: ShieldCheck, title: "Review before listing", text: "Trade applicants are checked for identity, relevant trade evidence, references and practical capability before a public verified profile is approved." },
  { icon: HardHat, title: "Safety comes first", text: "Customers and tradespeople should agree on the work scope, site access, protective equipment and safety expectations before work begins." },
  { icon: ClipboardCheck, title: "Clear job details", text: "Good job requests describe the task, location, timeframe and known site conditions so the right skill can be considered." },
  { icon: Recycle, title: "Responsible work practices", text: "We encourage tidy sites, sensible materials planning and proper waste handling as part of good trade work." },
];

export default function WorksiteStandardsPage() {
  return (
    <>
      <PageHero eyebrow="Trust, safety and good practice" title="Worksite Standards">
        Clear expectations and suitable skills help make every job safer and easier to coordinate.
      </PageHero>
      <section className="bg-bone py-16 lg:py-24">
        <div className="container-gbc">
          <Heading eyebrow="Our approach" title="The standards behind a better job site" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {standards.map((standard) => {
              const Icon = standard.icon;
              return (
                <article key={standard.title} className="rounded-2xl border border-stone/70 bg-white p-7 sm:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-900"><Icon size={22} aria-hidden /></span>
                  <h2 className="mt-6 text-xl font-semibold text-forest-900">{standard.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{standard.text}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">
            The verified label describes checks recorded by GBC. It is not a government licence or a guarantee of future work quality. Electrical wiring work is subject to Energy Commission certification requirements.
          </p>
        </div>
      </section>
      <GetInTouch />
    </>
  );
}
