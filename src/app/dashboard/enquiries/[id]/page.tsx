import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { EnquiryControls, NoteForm } from "./Forms";

export const metadata: Metadata = { title: "Job Request" };

const kindLabel: Record<string, string> = {
  note: "Note", call: "Call", email: "Email", meeting: "Meeting", status_change: "Status", assignment: "Assignment",
};

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff((r) => can.workEnquiries(r));
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await createClient();

  const { data: e } = await db.from("enquiries").select("*").eq("id", id).single();
  if (!e) notFound();
  const [{ data: notes }, { data: team }] = await Promise.all([
    db.from("enquiry_notes").select("id,kind,body,created_at,author:profiles(full_name,email)").eq("enquiry_id", id).order("created_at", { ascending: false }),
    db.from("profiles").select("id,full_name,email,role").eq("active", true).in("role", ["admin", "manager", "staff"]).order("full_name"),
  ]);

  const details: [string, string | null][] = [
    ["Email", e.email], ["Phone", e.phone], ["Trade needed", e.service],
    ["Job type", e.project_type], ["Job location", e.location], ["Budget / quote preference", e.budget_range], ["When needed", e.timeline],
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/enquiries" className="text-sm text-muted hover:text-forest-900">← Job requests</Link>
        <h1 className="mt-2 text-3xl text-forest-900">{e.name}</h1>
        <p className="text-sm text-muted">{e.reference} · received {new Date(e.created_at).toLocaleString("en-GB")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section className="border border-stone bg-white p-6">
            <h2 className="text-xl text-forest-900">Customer and job details</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {details.filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-0.5 break-words">
                    {k === "Email" ? <a className="underline underline-offset-4" href={`mailto:${v}`}>{v}</a>
                      : k === "Phone" ? <a className="underline underline-offset-4" href={`tel:${v}`}>{v}</a> : v}
                  </dd>
                </div>
              ))}
            </dl>
            <h3 className="eyebrow mt-6">Job description</h3>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{e.message}</p>
          </section>

          <section className="border border-stone bg-white p-6">
            <h2 className="text-xl text-forest-900">Job activity log</h2>
            <NoteForm enquiryId={e.id} />
            <ol className="mt-6 space-y-4">
              {(notes ?? []).map((n) => {
                const author = n.author as unknown as { full_name: string; email: string } | null;
                return (
                  <li key={n.id} className="border-l-2 border-brass pl-4">
                    <p className="text-xs text-muted">
                      {kindLabel[n.kind]} · {author?.full_name || author?.email || "System"} · {new Date(n.created_at).toLocaleString("en-GB")}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
                  </li>
                );
              })}
              {(notes ?? []).length === 0 && <li className="text-sm text-muted">No activity yet.</li>}
            </ol>
          </section>
        </div>

        <aside className="h-fit border border-stone bg-sand p-6">
          <h2 className="text-xl text-forest-900">Manage</h2>
          <EnquiryControls
            enquiry={{ id: e.id, status: e.status, assigned_to: e.assigned_to, follow_up_at: e.follow_up_at, lost_reason: e.lost_reason }}
            team={team ?? []}
            canAssign={can.assign(staff.role)}
          />
        </aside>
      </div>
    </div>
  );
}
