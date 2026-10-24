"use client";

import { useActionState, useState } from "react";
import { saveAnnouncements, type FormResult } from "@/app/actions/dashboard";
import { BusyLabel } from "@/components/BusyLabel";
import type { AnnouncementItem } from "@/lib/content";
import { useResultToast } from "@/lib/useResultToast";

const newId = () => crypto.randomUUID().slice(0, 18);

// Edit the whole list in the browser, then save it in one go (sent as JSON in a hidden field).
export function AnnouncementsForm({ initial }: { initial: AnnouncementItem[] }) {
  const [state, action, pending] = useActionState<FormResult, FormData>(saveAnnouncements, {});
  useResultToast(state, "Announcements saved");
  const [items, setItems] = useState(initial);
  const [today] = useState(() => new Date().toISOString().slice(0, 10)); // Ghana time is UTC

  const update = (id: string, patch: Partial<AnnouncementItem>) => setItems((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const add = () =>
    setItems((list) => [{ id: newId(), enabled: true, title: "", message: "", link_label: "", link_url: "", date: today, ends_on: "" }, ...list]);
  const remove = (id: string) => {
    if (confirm("Remove this announcement? It disappears from the website when you save.")) setItems((list) => list.filter((a) => a.id !== id));
  };
  const statusOf = (a: AnnouncementItem) =>
    !a.enabled ? "Hidden" : a.ends_on && a.ends_on < today ? "Ended" : a.title.trim().length < 3 ? "Needs a title" : "Live";

  return (
    <form action={action} className="max-w-3xl space-y-5">
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={add} className="btn btn-outline" disabled={items.length >= 12}>
          + New announcement
        </button>
        <span className="text-xs text-muted">{items.filter((a) => statusOf(a) === "Live").length} live · up to 12 in total</span>
      </div>

      {items.length === 0 && <p className="rounded-lg border border-dashed border-stone bg-white p-6 text-sm text-muted">No announcements yet. Visitors who open the megaphone see “No announcements right now”.</p>}

      {items.map((a) => {
        const status = statusOf(a);
        return (
          <fieldset key={a.id} className="space-y-4 rounded-lg border border-stone bg-white p-5">
            <legend className="sr-only">{a.title || "New announcement"}</legend>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-forest-900">
                <input type="checkbox" checked={a.enabled} onChange={(e) => update(a.id, { enabled: e.target.checked })} className="h-4 w-4 accent-forest-800" />
                Published
              </label>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === "Live" ? "bg-forest-100 text-forest-900" : "bg-stone/50 text-muted"}`}>{status}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
              <div>
                <label className="label" htmlFor={`t-${a.id}`}>Title</label>
                <input id={`t-${a.id}`} value={a.title} maxLength={80} onChange={(e) => update(a.id, { title: e.target.value })} className="field" placeholder="e.g. Office closed for the holidays" />
              </div>
              <div>
                <label className="label" htmlFor={`d-${a.id}`}>Date shown</label>
                <input id={`d-${a.id}`} type="date" value={a.date} onChange={(e) => update(a.id, { date: e.target.value })} className="field" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor={`m-${a.id}`}>Details (optional)</label>
              <textarea id={`m-${a.id}`} rows={3} value={a.message} maxLength={600} onChange={(e) => update(a.id, { message: e.target.value })} className="field" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor={`ll-${a.id}`}>Link text (optional)</label>
                <input id={`ll-${a.id}`} value={a.link_label} maxLength={30} onChange={(e) => update(a.id, { link_label: e.target.value })} className="field" placeholder="Learn more" />
              </div>
              <div>
                <label className="label" htmlFor={`lu-${a.id}`}>Link address</label>
                <input id={`lu-${a.id}`} value={a.link_url} onChange={(e) => update(a.id, { link_url: e.target.value })} className="field" placeholder="/projects or https://…" />
              </div>
              <div>
                <label className="label" htmlFor={`e-${a.id}`}>Hide after (optional)</label>
                <input id={`e-${a.id}`} type="date" value={a.ends_on} onChange={(e) => update(a.id, { ends_on: e.target.value })} className="field" />
              </div>
            </div>
            <button type="button" onClick={() => remove(a.id)} className="text-sm text-red-700 underline underline-offset-4">
              Remove
            </button>
          </fieldset>
        );
      })}

      <div className="flex items-center gap-4">
        <button className="btn btn-primary" disabled={pending}>
          <BusyLabel pending={pending} busy="Saving…">Save announcements</BusyLabel>
        </button>
        {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      </div>
    </form>
  );
}
