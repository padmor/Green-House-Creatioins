"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company, nav, type Announcement } from "@/lib/content";
import { Announcements } from "./Announcements";
import { Logo } from "./Logo";

// Pages that open with a full-width photo; the header sits transparently over it until the page scrolls.
const solidRoutes = ["/map"];

export function Header({ solid = false, announcements = [] }: { solid?: boolean; announcements?: Announcement[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isActive = (href: string) => pathname.startsWith(href);
  const overlay = !solid && !solidRoutes.includes(pathname) && !scrolled;

  // Switch from transparent to frosted glass once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and support Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 h-[72px] border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        overlay
          ? "border-white/15 bg-gradient-to-b from-forest-950/40 to-transparent text-white"
          : `border-stone/50 bg-bone/80 text-ink backdrop-blur-xl backdrop-saturate-150 ${scrolled ? "shadow-[0_12px_30px_-22px_rgba(22,39,32,0.55)]" : ""}`
      }`}
    >
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label={`${company.name} home`}>
          <Logo light={overlay} />
        </Link>

        <nav aria-label="Main" className="hidden items-center justify-center gap-10 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative py-1 text-[13px] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:transition-transform after:duration-300 ${
                isActive(n.href) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
              } ${overlay ? "after:bg-white" : "after:bg-forest-900"} ${
                overlay
                  ? isActive(n.href)
                    ? "font-semibold text-white"
                    : "text-white/80 hover:text-white"
                  : isActive(n.href)
                    ? "font-semibold text-forest-900"
                    : "text-ink/80 hover:text-forest-600"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <Announcements items={announcements} light={overlay} />
          <Link
            href="/contact#enquiry"
            className={`hidden items-center gap-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors sm:inline-flex ${
              overlay ? "bg-bone text-ink hover:bg-white" : "bg-ink text-bone hover:bg-ink-soft"
            }`}
          >
            Enquire now
          </Link>
          <button
            type="button"
            className={`grid h-10 w-10 place-items-center border lg:hidden ${overlay ? "border-white/40 text-white" : "border-stone"}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M2 5h14M2 9h14M2 13h14" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-forest-950 text-white lg:hidden">
          <div className="flex h-[72px] items-center justify-between px-5 sm:px-8">
            <Logo light />
            <button
              type="button"
              autoFocus
              className="grid h-10 w-10 place-items-center border border-white/30"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M3 3l12 12M15 3L3 15" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-6 px-8">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`flex items-center gap-3 font-serif text-3xl font-medium tracking-tight hover:text-sage ${isActive(n.href) ? "text-sage" : ""}`}
              >
                {isActive(n.href) && <span aria-hidden className="h-px w-6 bg-sage" />}
                {n.label}
              </Link>
            ))}
            <Link
              href="/contact#enquiry"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex w-fit items-center gap-2 bg-bone px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink"
            >
              Enquire now
            </Link>
          </nav>
          <div className="space-y-1 px-8 pb-10 text-sm text-white/70">
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="block">{company.phone}</a>
            <a href={`mailto:${company.email}`} className="block">{company.email}</a>
          </div>
        </div>
      )}
    </header>
  );
}
