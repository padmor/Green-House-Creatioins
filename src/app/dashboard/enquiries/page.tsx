import type { Metadata } from "next";
import Link from "next/link";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { statusLabels, statusOrder } from "@/lib/content";
import { EnquiryTable, type EnquiryRow } from "../EnquiryTable";

export const metadata: Metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; mine?: string }> }) {
  const staff = await requireStaff((r) => can.workEnquiries(r));
  const { status, mine } = await searchParams;
  const db = await createClient();

  let q = db
    .from("enquiries")
    .select("id,reference,name,project_type,location,status,follow_up_at,created_at,assigned:profiles!enquiries_assigned_to_fkey(full_name,email)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status && (statusOrder as readonly string[]).includes(status)) q = q.eq("status", status);
  if (mine) q = q.eq("assigned_to", staff.id);
  const { data } = await q;

  const tab = (active: boolean) =>
    `rounded-sm border px-3 py-1.5 text-sm ${active ? "border-forest-800 bg-forest-800 text-bone" : "border-stone bg-white text-muted hover:border-forest-800"}`;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-forest-900">Enquiries</h1>
      <nav aria-label="Filter" className="flex flex-wrap gap-2">
        <Link href="/dashboard/enquiries" className={tab(!status && !mine)}>All</Link>
        {can.viewAllEnquiries(staff.role) && <Link href="/dashboard/enquiries?mine=1" className={tab(Boolean(mine))}>Assigned to me</Link>}
        {statusOrder.map((s) => (
          <Link key={s} href={`/dashboard/enquiries?status=${s}`} className={tab(status === s)}>{statusLabels[s]}</Link>
        ))}
      </nav>
      <EnquiryTable rows={(data ?? []) as unknown as EnquiryRow[]} empty="No enquiries match this filter." />
    </div>
  );
}
