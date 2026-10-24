"use client";

import { useActionState } from "react";
import { deletePerson, savePerson, type FormResult } from "@/app/actions/dashboard";
import { BusyLabel } from "@/components/BusyLabel";
import { staffRanks } from "@/lib/content";
import { PendingButton } from "@/components/PendingButton";
import { useResultToast } from "@/lib/useResultToast";

export type PersonValues = {
  id?: string; full_name?: string; role_title?: string; rank?: string; bio?: string; photo_url?: string | null; linkedin_url?: string | null;
  qualifications?: string; responsibilities?: string; contributions?: string;
  x_url?: string | null; instagram_url?: string | null; facebook_url?: string | null; public_email?: string | null;
  is_founder?: boolean; sort_order?: number; published?: boolean;
};

export function PersonForm({ p }: { p: PersonValues }) {
  const [state, action, pending] = useActionState<FormResult, FormData>(savePerson, {});
  useResultToast(state, "Saved");
  return (
    <div className="max-w-3xl">
      <form action={action} className="space-y-5">
        <input type="hidden" name="id" value={p.id ?? ""} />
        {state.error && <p role="alert" className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="label">Full name</label>
            <input id="full_name" name="full_name" defaultValue={p.full_name ?? ""} className="field" required maxLength={120} />
          </div>
          <div>
            <label htmlFor="role_title" className="label">Role (e.g. Founder & Managing Director, Site Engineer)</label>
            <input id="role_title" name="role_title" defaultValue={p.role_title ?? ""} className="field" required maxLength={120} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="rank" className="label">Rank (groups people on the About page)</label>
            <select id="rank" name="rank" defaultValue={p.rank ?? "Staff"} className="field">
              {staffRanks.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="linkedin_url" className="label">LinkedIn profile (optional)</label>
            <input id="linkedin_url" name="linkedin_url" defaultValue={p.linkedin_url ?? ""} className="field" placeholder="https://www.linkedin.com/in/…" maxLength={300} />
          </div>
        </div>
        <div>
          <label htmlFor="bio" className="label">Short bio (for the founder, this is shown as their message)</label>
          <textarea id="bio" name="bio" rows={5} defaultValue={p.bio ?? ""} className="field" maxLength={1500} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="qualifications" className="label">Qualifications (one per line)</label>
            <textarea id="qualifications" name="qualifications" rows={4} defaultValue={p.qualifications ?? ""} className="field" maxLength={1500} placeholder={"BSc Civil Engineering\nMember, Ghana Institution of Engineering"} />
          </div>
          <div>
            <label htmlFor="responsibilities" className="label">Role on the job (one duty per line)</label>
            <textarea id="responsibilities" name="responsibilities" rows={4} defaultValue={p.responsibilities ?? ""} className="field" maxLength={1500} />
          </div>
          <div>
            <label htmlFor="contributions" className="label">Contributions (one per line)</label>
            <textarea id="contributions" name="contributions" rows={4} defaultValue={p.contributions ?? ""} className="field" maxLength={1500} />
          </div>
        </div>
        <p className="-mt-2 text-xs text-muted">Only list qualifications and contributions the person actually holds or made, as they have approved.</p>
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="label">Public handles (optional, shown with icons on their profile)</legend>
          <input aria-label="X (Twitter) link" name="x_url" defaultValue={p.x_url ?? ""} className="field" placeholder="https://x.com/…" maxLength={300} />
          <input aria-label="Instagram link" name="instagram_url" defaultValue={p.instagram_url ?? ""} className="field" placeholder="https://instagram.com/…" maxLength={300} />
          <input aria-label="Facebook link" name="facebook_url" defaultValue={p.facebook_url ?? ""} className="field" placeholder="https://facebook.com/…" maxLength={300} />
          <input aria-label="Public work email" name="public_email" type="email" defaultValue={p.public_email ?? ""} className="field" placeholder="name@gbcghana.com" maxLength={254} />
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
          <div>
            <label htmlFor="photo_url" className="label">Photo URL (https://… or /images/…). Leave blank to show initials.</label>
            <input id="photo_url" name="photo_url" defaultValue={p.photo_url ?? ""} className="field" maxLength={1000} />
          </div>
          <div>
            <label htmlFor="sort_order" className="label">Order (0 = first)</label>
            <input id="sort_order" name="sort_order" type="number" min={0} max={999} defaultValue={p.sort_order ?? 0} className="field" />
          </div>
        </div>
        <fieldset className="flex flex-wrap gap-6 text-sm">
          <legend className="label">Display</legend>
          <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p.published} className="accent-forest-800" /> Show on website</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_founder" defaultChecked={p.is_founder} className="accent-forest-800" /> Founder (featured; replaces any current founder)</label>
        </fieldset>
        <p className="text-xs text-muted">Only add real people who have agreed to appear on the website, with photos you have permission to use.</p>
        <button className="btn btn-primary" disabled={pending}><BusyLabel pending={pending} busy="Saving…">Save person</BusyLabel></button>
      </form>

      {p.id && (
        <form action={deletePerson} className="mt-10 border-t border-stone pt-6">
          <input type="hidden" name="id" value={p.id} />
          <PendingButton pendingText="Working…" className="text-sm text-red-700 underline underline-offset-4" onClick={(e) => { if (!confirm("Remove this person from the website permanently?")) e.preventDefault(); }}>
            Delete person
          </PendingButton>
        </form>
      )}
    </div>
  );
}
