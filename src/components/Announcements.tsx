"use client";

import { ArrowUpRight, Megaphone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Announcement } from "@/lib/content";

// Which announcements this visitor has already opened, remembered on their device only.
const SEEN = "gbc-announcements-seen";
const EVENT = "gbc:announcements-seen";
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const readSeen = () => {
  try {
    return localStorage.getItem(SEEN) ?? "";
  } catch {
    return "";
  }
};
const formatDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

// Megaphone button in the header with a count of unread announcements; opens them in a pop-up.
// Always shown; when nothing is published the pop-up says so rather than showing anything made up.
export function Announcements({ items, light = false }: { items: Announcement[]; light?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [freshAtOpen, setFreshAtOpen] = useState<string[]>([]);
  // null on the server and during hydration, so the count appears only once the browser knows what was read
  const seenRaw = useSyncExternalStore(subscribe, readSeen, () => null);
  const seen = seenRaw === null ? null : seenRaw.split(",");
  const unread = seen === null ? [] : items.filter((a) => !seen.includes(a.id)).map((a) => a.id);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const show = () => {
    setFreshAtOpen(unread);
    try {
      localStorage.setItem(SEEN, items.map((a) => a.id).join(","));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-label={unread.length ? `Announcements, ${unread.length} new` : "Announcements"}
        className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors ${
          light ? "border-white/40 text-white hover:bg-white/10" : "border-stone text-ink hover:border-ink hover:bg-ink hover:text-bone"
        }`}
      >
        <Megaphone size={17} strokeWidth={1.75} aria-hidden />
        {unread.length > 0 && (
          <span aria-hidden className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-sage px-1 text-[10px] font-bold leading-none text-forest-900 ring-2 ring-forest-950/10">
            <span className="absolute inset-0 animate-ping rounded-full bg-sage opacity-60 motion-reduce:hidden" />
            <span className="relative">{unread.length}</span>
          </span>
        )}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="announcements-title"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="gbc-modal m-auto max-h-[calc(100dvh-2rem)] w-[min(560px,calc(100%-2rem))] overflow-hidden rounded-2xl bg-white p-0 text-ink shadow-[0_40px_90px_-30px_rgba(22,39,32,0.6)] backdrop:bg-forest-950/55 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
            <header className="relative flex items-center gap-4 bg-forest-950 px-6 py-5 text-white sm:px-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage text-forest-900">
                <Megaphone size={19} strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <h2 id="announcements-title" className="text-xl font-semibold tracking-[-0.015em]">Announcements</h2>
                <p className="text-xs text-white/60">News and updates from Green-Building Creations</p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} strokeWidth={1.75} aria-hidden />
              </button>
            </header>
            {items.length === 0 && (
              <div className="gbc-ann-item px-6 py-12 text-center sm:px-8">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-700">
                  <Megaphone size={20} strokeWidth={1.6} aria-hidden />
                </span>
                <p className="mt-4 font-semibold text-forest-900">No announcements right now</p>
                <p className="mt-1 text-sm text-muted">News and updates from the GBC team will appear here.</p>
              </div>
            )}
            <ol className="divide-y divide-stone/70 overflow-y-auto px-6 sm:px-8">
              {items.map((a, i) => (
                <li key={a.id} className="gbc-ann-item py-6" style={{ animationDelay: `${0.08 + i * 0.07}s` }}>
                  <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                    {freshAtOpen.includes(a.id) && <span className="rounded-full bg-sage px-2 py-0.5 tracking-[0.12em] text-forest-900">New</span>}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug tracking-[-0.01em] text-forest-900">{a.title}</h3>
                  {a.message && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/75">{a.message}</p>}
                  {a.link_url && a.link_label && (
                    <Link
                      href={a.link_url}
                      onClick={() => setOpen(false)}
                      {...(a.link_url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-forest-700 underline decoration-forest-700/30 underline-offset-4 hover:decoration-forest-700"
                    >
                      {a.link_label}
                      <ArrowUpRight size={14} strokeWidth={1.9} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </dialog>
    </>
  );
}
