"use client";

import { useActionState, useRef, useEffect } from "react";
import { addNote, updateEnquiry, type FormResult } from "@/app/actions/dashboard";
import { statusLabels, statusOrder } from "@/lib/content";
import { BusyLabel } from "@/components/BusyLabel";
import { useResultToast } from "@/lib/useResultToast";

const idle: FormResult = {};

function Result({ s }: { s: FormResult }) {
  if (s.error) return <p role="alert" className="text-sm text-red-700">{s.error}</p>;
  if (s.ok) return <p role="status" className="text-sm text-forest-700">Saved.</p>;
  return null;
}

export function EnquiryControls({
  enquiry, team, canAssign,
}: {
  enquiry: { id: string; status: string; assigned_to: string | null; follow_up_at: string | null; lost_reason: string | null };
  team: { id: string; full_name: string; email: string; role: string }[];
  canAssign: boolean;
}) {
  const [state, action, pending] = useActionState(updateEnquiry, idle);
  useResultToast(state, "Enquiry updated");
  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="id" value={enquiry.id} />
      <div>
        <label htmlFor="status" className="label">Status</label>
        <select id="status" name="status" defaultValue={enquiry.status} className="field">
          {statusOrder.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="assigned_to" className="label">Assigned to</label>
        {/* Non-managers keep a hidden copy so the current assignee is unchanged on save. */}
        {!canAssign && <input type="hidden" name="assigned_to" value={enquiry.assigned_to ?? ""} />}
        <select id="assigned_to" name={canAssign ? "assigned_to" : undefined} defaultValue={enquiry.assigned_to ?? ""} disabled={!canAssign} className="field">
          <option value="">Unassigned</option>
          {team.map((t) => <option key={t.id} value={t.id}>{t.full_name || t.email} ({t.role})</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="follow_up_at" className="label">Follow-up date</label>
        <input id="follow_up_at" name="follow_up_at" type="date" defaultValue={enquiry.follow_up_at ?? ""} className="field" />
      </div>
      <div>
        <label htmlFor="lost_reason" className="label">Reason (if lost)</label>
        <input id="lost_reason" name="lost_reason" defaultValue={enquiry.lost_reason ?? ""} className="field" maxLength={500} />
      </div>
      <button className="btn btn-primary w-full" disabled={pending}><BusyLabel pending={pending} busy="Saving…">Save changes</BusyLabel></button>
      <Result s={state} />
    </form>
  );
}

export function NoteForm({ enquiryId }: { enquiryId: string }) {
  const [state, action, pending] = useActionState(addNote, idle);
  useResultToast(state, "Added to the log");
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={action} className="mt-4 space-y-3">
      <input type="hidden" name="enquiry_id" value={enquiryId} />
      <div className="flex gap-3">
        <label htmlFor="kind" className="sr-only">Type</label>
        <select id="kind" name="kind" className="field !w-auto" defaultValue="note">
          <option value="note">Note</option><option value="call">Call</option><option value="email">Email</option><option value="meeting">Meeting</option>
        </select>
      </div>
      <label htmlFor="body" className="sr-only">Note</label>
      <textarea id="body" name="body" rows={3} required maxLength={4000} className="field" placeholder="Record what was discussed or agreed…" />
      <div className="flex items-center gap-4">
        <button className="btn btn-outline" disabled={pending}><BusyLabel pending={pending} busy="Adding…">Add to log</BusyLabel></button>
        <Result s={state} />
      </div>
    </form>
  );
}
