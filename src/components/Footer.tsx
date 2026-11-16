import Link from "next/link";
import { company, social } from "@/lib/content";
import { Logo } from "./Logo";

const icons: Record<string, React.ReactNode> = {
  linkedin: <path d="M4.5 8.5v8M4.5 5.2v.1M8.5 16.5v-5c0-1.7 1.2-3 2.8-3s2.7 1.3 2.7 3v5M8.5 8.5v8" />,
  instagram: (
    <>
      <rect x="3" y="3" width="14" height="14" rx="4" />
      <circle cx="10" cy="10" r="3.2" />
      <path d="M14 6v.1" />
    </>
  ),
  facebook: <path d="M11.5 17v-6.5h2.2l.3-2.5h-2.5V6.6c0-.7.2-1.2 1.2-1.2H14V3.2c-.3 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V8H6.8v2.5h2.1V17" />,
};

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "How it works" },
      { href: "/services", label: "Trades & Services" },
      { href: "/sustainability", label: "Worksite standards" },
      { href: "/contact", label: "Post a job" },
    ],
  },
  {
    title: "For tradespeople",
    links: [
      { href: "/projects", label: "Find a trade" },
      { href: "/careers", label: "Join the network" },
      { href: "/map", label: "Trust & verification" },
    ],
  },
];

const heading = "text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-700";
const link = "text-[15px] text-ink/75 transition-colors hover:text-forest-900";

// Site footer on ivory: brand, two link columns and the office details, then a slim legal bar.
export function Footer() {
  return (
    <footer className="border-t border-stone bg-bone text-ink">
      <div className="container-gbc grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr] lg:gap-12 lg:py-16">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" aria-label={`${company.name} home`} className="inline-block">
            <Logo />
          </Link>
          <p className="mt-5 max-w-[32ch] text-[15px] leading-[1.7] text-ink/65">
            Connecting customers with skilled tradespeople and helping professionals access genuine job opportunities in {company.city}, {company.country}.
          </p>
          {social.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-full text-ink/70 ring-1 ring-stone transition-colors hover:bg-ink hover:text-bone hover:ring-ink"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {icons[s.icon]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className={heading}>{col.title}</p>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="col-span-2 lg:col-span-1">
          <p className={heading}>GBC contact</p>
          <address className="mt-5 space-y-3 text-[15px] not-italic leading-[1.6] text-ink/75">
            <p>{company.address}</p>
            <p className="text-ink/55">{company.postal}</p>
            <p className="pt-2">
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className={link}>{company.phone}</a>
            </p>
            <p>
              <a href={`mailto:${company.email}`} className={`break-all ${link}`}>{company.email}</a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-stone">
        <div className="container-gbc flex flex-col gap-3 pb-24 pt-6 text-[13px] sm:pb-6 text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {company.name} All rights reserved.</p>
          <ul className="flex gap-6">
            <li><Link href="/privacy" className="transition-colors hover:text-ink">Privacy policy</Link></li>
            <li><Link href="/dashboard" className="transition-colors hover:text-ink">Staff sign in</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
