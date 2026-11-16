import Link from "next/link";
import { delay } from "./ui";
import { company } from "@/lib/content";

const contacts = [
  { label: "Phone", value: company.phone, href: `tel:${company.phone.replace(/\s/g, "")}` },
  { label: "Email", value: company.email, href: `mailto:${company.email}` },
  { label: "Office", value: company.address, href: "/map" },
];

// "Get a job moving" band: a short invitation with the "Post a job" button on one line, then the
// three ways to reach us set as plain text under a hairline.
export function GetInTouch() {
  return (
    <section className="bg-sage text-forest-900" aria-labelledby="touch-heading">
      <div className="container-gbc py-16 lg:py-20">
        <div data-reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-forest-700">Get in touch</p>
            <h2 id="touch-heading" className="mt-4 text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.5rem]">
              Need a skilled tradesperson?
            </h2>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.7] text-forest-900/75 sm:text-base">
              Tell us what needs doing and where. GBC will review your job request and confirm the next step.
            </p>
          </div>
          <Link
            href="/contact#enquiry"
            className="inline-flex shrink-0 items-center justify-center self-start bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone transition-colors hover:bg-ink-soft lg:self-auto"
          >
            Enquire now
          </Link>
        </div>

        <dl data-reveal style={delay(0.12)} className="mt-12 grid gap-8 border-t border-forest-900/15 pt-8 sm:grid-cols-3 sm:gap-6">
          {contacts.map(({ label, value, href }) => (
            <div key={label} className="min-w-0">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-900/55">{label}</dt>
              <dd className="mt-2">
                <a href={href} className="text-lg font-medium text-forest-900 decoration-forest-900/40 underline-offset-[6px] hover:underline">
                  {value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
