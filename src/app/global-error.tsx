"use client";

import "./globals.css";

// Last-resort error screen if the whole site shell fails. It replaces the root layout, so it has its own <html>.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-bone p-6 text-center text-ink">
        <title>Something went wrong | GBC</title>
        <div role="alert" className="max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-forest-700">Green-Building Creations Ltd.</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-forest-900">Something went wrong</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/75">The website could not load properly. Please try again in a moment.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-8 rounded-xl bg-ink px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone hover:bg-ink-soft"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
