"use client";

import { LoaderCircle } from "lucide-react";
import { useState, useSyncExternalStore, useTransition } from "react";
import { rateProject } from "@/app/actions/rating";
import type { Rating } from "@/lib/content";
import { toast } from "@/lib/toast";
import { RatingSummary } from "./Stars";

const STAR = "M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8L10 1.5Z";
const words = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const key = (slug: string) => `gbc-rating:${slug}`;
const noop = () => () => {};
function readStored(slug: string) {
  try {
    const v = Number(localStorage.getItem(key(slug)));
    return v >= 1 && v <= 5 ? v : 0;
  } catch {
    return 0;
  }
}

// Visitor star rating. Native radio inputs keep it keyboard- and screen-reader-friendly;
// choosing a star saves immediately. The server allows one rating per visitor per project.
export function RateProject({ slug, title, initial }: { slug: string; title: string; initial?: Rating }) {
  const [summary, setSummary] = useState<Rating | undefined>(initial);
  const [picked, setPicked] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  // This visitor's earlier choice, remembered on their device (a convenience only; the server is the record).
  const stored = useSyncExternalStore(noop, () => readStored(slug), () => 0);
  const mine = picked || stored;

  const choose = (n: number) => {
    setPicked(n);
    setMessage(null);
    start(async () => {
      const r = await rateProject(slug, n).catch(() => ({ ok: false as const, message: "Couldn't reach our server. Check your connection and try again.", average: undefined, total: undefined }));
      if (!r.ok) {
        setPicked(0); // don't show stars as saved when they weren't
        const text = r.message ?? "Could not save your rating.";
        toast(text, "error");
        return setMessage({ ok: false, text });
      }
      try {
        localStorage.setItem(key(slug), String(n));
      } catch {}
      if (r.total) setSummary({ average: r.average!, total: r.total });
      setMessage({ ok: true, text: `Thank you. You rated this project ${n} out of 5.` });
      toast("Thanks for rating this project");
    });
  };

  const shown = hover || mine;
  return (
    <div className="border border-stone bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-900">Rate this project</p>
        {summary && summary.total > 0 && <RatingSummary rating={summary} />}
      </div>
      <fieldset className="mt-3" disabled={pending}>
        <legend className="sr-only">Your rating for {title}</legend>
        <div className="flex items-center gap-4">
          <div className="flex" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} onMouseEnter={() => setHover(n)} className="cursor-pointer p-0.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-forest-600">
                <input type="radio" name={`rate-${slug}`} value={n} checked={mine === n} onChange={() => choose(n)} className="sr-only" />
                <span className="sr-only">{n} {n === 1 ? "star" : "stars"}, {words[n]}</span>
                <svg width="26" height="26" viewBox="0 0 20 20" aria-hidden className={`transition-colors ${n <= shown ? "text-forest-700" : "text-stone"}`} fill="currentColor">
                  <path d={STAR} />
                </svg>
              </label>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted" aria-hidden>
            {pending ? (
              <>
                <LoaderCircle size={13} strokeWidth={2} className="animate-spin" /> Saving…
              </>
            ) : (
              words[shown]
            )}
          </span>
        </div>
      </fieldset>
      <p role="status" className={`mt-2 min-h-4 text-xs ${message?.ok === false ? "text-red-700" : "text-forest-700"}`}>
        {message?.text}
      </p>
      <p className="text-[11px] text-muted">One rating per visitor. Choosing again updates your rating.</p>
    </div>
  );
}
