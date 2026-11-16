import Link from "next/link";
import { statusLabels } from "@/lib/content";

export type EnquiryRow = {
  id: string;
  reference: string;
  name: string;
  service: string;
  project_type: string;
  location: string;
  status: string;
  follow_up_at: string | null;
  created_at: string;
  assigned: { full_name: string; email: string } | null;
};

const badge: Record<string, string> = {
  new: "bg-brass/20 text-forest-900",
  contacted: "bg-forest-100 text-forest-900",
  consultation: "bg-forest-100 text-forest-900",
  proposal: "bg-forest-700 text-bone",
  won: "bg-forest-800 text-bone",
  scheduled: "bg-forest-100 text-forest-900",
  in_progress: "bg-forest-700 text-bone",
  completed: "bg-forest-800 text-bone",
  lost: "bg-stone text-ink",
};

export function EnquiryTable({ rows, empty, showFollowUp }: { rows: EnquiryRow[]; empty: string; showFollowUp?: boolean }) {
  if (rows.length === 0) return <p className="border border-stone bg-white px-4 py-6 text-sm text-muted">{empty}</p>;
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="overflow-x-auto border border-stone bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-stone bg-sand text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Trade / job</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Assigned</th>
            <th className="px-4 py-3 font-medium">{showFollowUp ? "Follow-up" : "Received"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone/60">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-bone">
              <td className="px-4 py-3">
                <Link href={`/dashboard/enquiries/${r.id}`} className="font-medium text-forest-900 underline-offset-4 hover:underline">{r.name}</Link>
                <div className="text-xs text-muted">{r.reference}</div>
              </td>
              <td className="px-4 py-3">{r.service} · {r.project_type}<div className="text-xs text-muted">{r.location}</div></td>
              <td className="px-4 py-3"><span className={`rounded-sm px-2 py-0.5 text-xs ${badge[r.status]}`}>{statusLabels[r.status]}</span></td>
              <td className="px-4 py-3 text-muted">{r.assigned ? r.assigned.full_name || r.assigned.email : "Unassigned"}</td>
              <td className={`px-4 py-3 ${r.follow_up_at && r.follow_up_at < today ? "text-red-700" : ""}`}>
                {showFollowUp ? r.follow_up_at : new Date(r.created_at).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
