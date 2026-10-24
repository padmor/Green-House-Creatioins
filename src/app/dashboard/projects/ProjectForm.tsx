"use client";

import { useActionState } from "react";
import { clearRatings, deleteProject, saveProject, type FormResult } from "@/app/actions/dashboard";

export function ClearRatingsButton({ id }: { id: string }) {
  return (
    <form action={clearRatings}>
      <input type="hidden" name="id" value={id} />
      <PendingButton pendingText="Working…" className="text-sm text-red-700 underline underline-offset-4" onClick={(e) => { if (!confirm("Remove all visitor ratings for this project?")) e.preventDefault(); }}>
            Clear ratings
          </PendingButton>
    </form>
  );
}
import { projectCategories } from "@/lib/content";
import { BusyLabel } from "@/components/BusyLabel";
import { PendingButton } from "@/components/PendingButton";
import { useResultToast } from "@/lib/useResultToast";

export type ProjectValues = {
  id?: string; title?: string; slug?: string; category?: string; location?: string; year?: number | null;
  summary?: string; body?: string; client?: string | null; scope?: string | null; image_urls?: string[];
  is_placeholder?: boolean; featured?: boolean; published?: boolean;
  latitude?: number | null; longitude?: number | null;
};

export function ProjectForm({ p }: { p: ProjectValues }) {
  const [state, action, pending] = useActionState<FormResult, FormData>(saveProject, {});
  useResultToast(state, "Project saved");
  const text = (name: string, label: string, v: string | number | null | undefined, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <input id={name} name={name} defaultValue={v ?? ""} className="field" {...extra} />
    </div>
  );
  return (
    <div className="max-w-3xl">
      <form action={action} className="space-y-5">
        <input type="hidden" name="id" value={p.id ?? ""} />
        {state.error && <p role="alert" className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          {text("title", "Title", p.title, { required: true })}
          {text("slug", "URL slug (e.g. riverside-house)", p.slug, { required: true, pattern: "[a-z0-9]+(-[a-z0-9]+)*" })}
          <div>
            <label htmlFor="category" className="label">Category</label>
            <input id="category" name="category" list="cats" defaultValue={p.category ?? ""} className="field" required />
            <datalist id="cats">{projectCategories.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          {text("location", "Location", p.location, { required: true })}
          {text("year", "Year completed", p.year, { type: "number", min: 1950, max: 2100 })}
          {text("client", "Client (only if they agree to be named)", p.client)}
        </div>
        {text("scope", "GBC scope (e.g. Design and construction)", p.scope)}
        <div className="grid gap-5 sm:grid-cols-2">
          {text("latitude", "Map latitude (e.g. 5.1053)", p.latitude, { type: "number", step: "any", min: -90, max: 90 })}
          {text("longitude", "Map longitude (e.g. -1.2466)", p.longitude, { type: "number", step: "any", min: -180, max: 180 })}
        </div>
        <div>
          <label htmlFor="summary" className="label">Summary</label>
          <textarea id="summary" name="summary" rows={2} defaultValue={p.summary} className="field" required maxLength={500} />
        </div>
        <div>
          <label htmlFor="body" className="label">Description (blank line = new paragraph)</label>
          <textarea id="body" name="body" rows={8} defaultValue={p.body} className="field" />
        </div>
        <div>
          <label htmlFor="image_urls" className="label">Image URLs (https, one per line; first is the cover)</label>
          <textarea id="image_urls" name="image_urls" rows={4} defaultValue={(p.image_urls ?? []).join("\n")} className="field" />
        </div>
        <fieldset className="flex flex-wrap gap-6 text-sm">
          <legend className="label">Status</legend>
          <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p.published} className="accent-forest-800" /> Published</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={p.featured} className="accent-forest-800" /> Featured on home page</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_placeholder" defaultChecked={p.is_placeholder ?? false} className="accent-forest-800" /> Placeholder (not a real project)</label>
        </fieldset>
        <button className="btn btn-primary" disabled={pending}><BusyLabel pending={pending} busy="Saving…">Save project</BusyLabel></button>
      </form>

      {p.id && (
        <form action={deleteProject} className="mt-10 border-t border-stone pt-6">
          <input type="hidden" name="id" value={p.id} />
          <PendingButton pendingText="Working…" className="text-sm text-red-700 underline underline-offset-4" onClick={(e) => { if (!confirm("Delete this project permanently?")) e.preventDefault(); }}>
            Delete project
          </PendingButton>
        </form>
      )}
    </div>
  );
}
