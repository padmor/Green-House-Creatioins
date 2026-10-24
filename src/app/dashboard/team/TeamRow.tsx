"use client";

import { useActionState } from "react";
import { updateTeamMember, type FormResult } from "@/app/actions/dashboard";
import { BusyLabel } from "@/components/BusyLabel";
import { useResultToast } from "@/lib/useResultToast";

export function TeamRow({ m }: { m: { id: string; full_name: string; email: string; role: string; active: boolean } }) {
  const [state, action, pending] = useActionState<FormResult, FormData>(updateTeamMember, {});
  useResultToast(state, "Staff account updated");
  return (
    <li className="px-4 py-3">
      <form action={action} className="flex flex-wrap items-center justify-between gap-3">
        <input type="hidden" name="id" value={m.id} />
        <div>
          <p className="font-medium text-forest-900">{m.full_name || m.email}</p>
          <p className="text-xs text-muted">{m.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="sr-only" htmlFor={`role-${m.id}`}>Role</label>
          <select id={`role-${m.id}`} name="role" defaultValue={m.role} className="field !w-auto">
            <option value="admin">Admin</option><option value="manager">Manager</option>
            <option value="staff">Staff (own enquiries)</option><option value="editor">Editor (portfolio/content)</option>
          </select>
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={m.active} className="accent-forest-800" /> Active</label>
          <button className="btn btn-outline !py-2" disabled={pending}><BusyLabel pending={pending} busy="Saving…">Save</BusyLabel></button>
          {state.ok && <span role="status" className="text-forest-700">Saved</span>}
          {state.error && <span role="alert" className="text-red-700">{state.error}</span>}
        </div>
      </form>
    </li>
  );
}
