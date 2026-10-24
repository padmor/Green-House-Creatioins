"use client";

import { useEffect } from "react";

// Shown inside the dashboard if a page or a save fails unexpectedly (for example a lost connection).
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  const message = error instanceof Error ? error.message : "";
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="max-w-lg rounded-lg border border-red-200 bg-red-50 p-6">
      <h1 className="font-serif text-xl text-red-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-red-900/80">
        The page or your last action could not be completed. Check your connection and try again. Nothing you saved before this was lost.
      </p>
      {process.env.NODE_ENV === "development" && message && <p className="mt-3 font-mono text-xs text-red-900/70">{message}</p>}
      <button type="button" onClick={() => retry()} className="btn btn-primary mt-5">
        Try again
      </button>
    </div>
  );
}
