"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { company } from "@/lib/content";

// Shown if a page fails to load (for example a database hiccup). The header and footer stay in place.
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  const [retrying, setRetrying] = useState(false);
  const digest = error instanceof Error && "digest" in error ? String((error as Error & { digest?: string }).digest ?? "") : "";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-bone pt-[72px]">
      <div role="alert" className="container-gbc flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">
          <TriangleAlert size={24} strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="mt-7 text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl">Something went wrong</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/75">
          This page could not be loaded just now. Please try again. If it keeps happening, call us on{" "}
          <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="font-medium text-forest-900 underline underline-offset-2">{company.phone}</a>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setRetrying(true);
              retry();
              window.setTimeout(() => setRetrying(false), 1500);
            }}
            disabled={retrying}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone transition-colors hover:bg-ink-soft disabled:opacity-70"
          >
            <RotateCw size={14} strokeWidth={2} className={retrying ? "animate-spin" : ""} aria-hidden /> {retrying ? "Retrying" : "Try again"}
          </button>
          <Link href="/" className="inline-flex items-center rounded-xl border border-ink px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-bone">
            Back to home
          </Link>
        </div>
        {digest && <p className="mt-8 text-[11px] text-muted">Reference: {digest}</p>}
      </div>
    </section>
  );
}
