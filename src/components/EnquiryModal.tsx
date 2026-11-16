"use client";

import { Mail, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ArchImage } from "./ArchImage";
import { EnquiryForm } from "./EnquiryForm";
import { LogoMark } from "./Logo";
import { company } from "@/lib/content";

// Site-wide enquiry pop-up. Any link to /contact#enquiry opens it instead of leaving the page
// (except on /contact itself, which has the full form). Without JavaScript the links still go to
// the contact page. Uses a native <dialog> for focus trapping and Escape-to-close.
// What happens after someone enquires (mirrors the dashboard pipeline: new → contacted → consultation → proposal).
const steps = ["We review your job request", "We confirm the trade, location and timing", "We check availability and discuss the next step"];

export function EnquiryModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState(0); // remounts the form so each opening starts fresh

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/contact" || url.hash !== "#enquiry") return;
      if (window.location.pathname === "/contact") return;
      // Cancelling the click also stops next/link navigating; the link's own onClick (e.g. closing the mobile menu) still runs.
      e.preventDefault();
      setRound((r) => r + 1);
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      closeBtn.current?.focus(); // start on Close rather than the first link in the photo panel
    }
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="enquiry-modal-title"
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      className="gbc-modal m-auto max-h-[calc(100dvh-2rem)] w-[min(1000px,calc(100%-2rem))] overflow-y-auto rounded-2xl bg-transparent p-0 text-ink backdrop:bg-forest-950/55 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="relative grid overflow-hidden rounded-2xl bg-bone shadow-[0_40px_90px_-30px_rgba(22,39,32,0.6)] md:grid-cols-[0.82fr_1.18fr]">
          <button
            type="button"
            ref={closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-forest-900/70 shadow-sm ring-1 ring-stone transition-colors hover:bg-ink hover:text-bone hover:ring-ink"
          >
            <X size={18} strokeWidth={1.75} aria-hidden />
          </button>
          {/* Photo panel: brand, what happens next, direct contacts. Collapses to a short band on phones. */}
          <aside className="relative isolate flex flex-col justify-between gap-8 overflow-hidden p-7 text-white sm:p-9">
            <ArchImage alt="" variant={4} position="center 35%" sizes="(min-width: 768px) 400px, 100vw" className="absolute inset-0 -z-10" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950/80 via-forest-950/85 to-forest-950/95" />
            <div>
              <LogoMark light size={40} />
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.26em] text-sage">Post a job</p>
              <p className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-[-0.015em] sm:text-[1.75rem]">Let&apos;s get your job moving</p>
            </div>
            <ol className="hidden space-y-5 md:block">
              {steps.map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-sage/50 text-[11px] font-semibold text-sage">{i + 1}</span>
                  <span className="pt-1 text-sm leading-snug text-white/80">{t}</span>
                </li>
              ))}
            </ol>
            <div className="hidden space-y-3 border-t border-white/15 pt-6 text-sm md:block">
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-white/85 hover:text-white">
                <Phone size={15} strokeWidth={1.75} className="text-sage" aria-hidden /> {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-white/85 hover:text-white">
                <Mail size={15} strokeWidth={1.75} className="text-sage" aria-hidden /> {company.email}
              </a>
            </div>
          </aside>

          {/* Form panel */}
          <div className="relative bg-white p-7 sm:p-10">
            <h2 id="enquiry-modal-title" className="text-2xl md:pr-12 font-semibold tracking-[-0.015em] text-forest-900 sm:text-3xl">
              Tell us what needs doing
            </h2>
            <p className="mb-8 mt-2 text-sm text-ink/70">Choose the trade you need and describe the job. The GBC team will review your request.</p>
            <EnquiryForm key={round} variant="compact" />
            <p className="mt-7 border-t border-stone pt-5 text-xs text-muted md:hidden">
              Prefer to talk? Call{" "}
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="font-medium text-forest-900">{company.phone}</a> or email{" "}
              <a href={`mailto:${company.email}`} className="font-medium text-forest-900">{company.email}</a>.
            </p>
          </div>
        </div>
      )}
    </dialog>
  );
}
