"use client";

import { useActionState } from "react";
import { saveContent, type FormResult } from "@/app/actions/dashboard";
import { BusyLabel } from "@/components/BusyLabel";
import { useResultToast } from "@/lib/useResultToast";

const labels: Record<string, string> = {
  "home.hero.eyebrow": "Home: small line above the headline",
  "home.hero.title": "Home: headline",
  "home.hero.subtitle": "Home: sub-headline",
  "home.about.title": "Home: jobsite positioning heading",
  "home.intro": "Home: job matching introduction",
  "home.locations": "Home: service area and job location text",
  "home.careers": "Home: tradesperson recruitment text",
  "about.story": "How it works: customer and tradesperson flow",
  "sustainability.intro": "Worksite standards: introduction",
};

export function ContentForm({ values }: { values: Record<string, string> }) {
  const [state, action, pending] = useActionState<FormResult, FormData>(saveContent, {});
  useResultToast(state, "Website content saved");
  return (
    <form action={action} className="max-w-3xl space-y-5">
      {Object.entries(values).map(([key, v]) => (
        <div key={key}>
          <label htmlFor={key} className="label">{labels[key] ?? key}</label>
          <textarea id={key} name={key} rows={key.endsWith("title") ? 2 : 4} defaultValue={v} maxLength={2000} className="field" />
        </div>
      ))}
      <div className="flex items-center gap-4">
        <button className="btn btn-primary" disabled={pending}><BusyLabel pending={pending} busy="Saving…">Save content</BusyLabel></button>
        {state.ok && <p role="status" className="text-sm text-forest-700">Saved.</p>}
        {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      </div>
    </form>
  );
}
