import Link from "next/link";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { statusLabels, statusOrder } from "@/lib/content";
import { EnquiryTable, type EnquiryRow } from "./EnquiryTable";

const SELECT = "id,reference,name,service,project_type,location,status,follow_up_at,created_at,assigned:profiles!enquiries_assigned_to_fkey(full_name,email)";

export default async function DashboardHome({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const staff = await requireStaff();
  const { denied } = await searchParams;
  const db = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const open = ["new", "contacted", "consultation", "proposal"];

  const showEnquiries = can.workEnquiries(staff.role);
  const [all, fresh, due] = showEnquiries
    ? await Promise.all([
        db.from("enquiries").select("status"),
        db.from("enquiries").select(SELECT).eq("status", "new").order("created_at", { ascending: false }).limit(8),
        db.from("enquiries").select(SELECT).in("status", open).not("follow_up_at", "is", null).lte("follow_up_at", today).order("follow_up_at").limit(10),
      ])
    : [null, null, null];

  const counts: Record<string, number> = {};
  all?.data?.forEach((r) => (counts[r.status] = (counts[r.status] ?? 0) + 1));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl text-forest-900">Welcome{staff.full_name ? `, ${staff.full_name.split(" ")[0]}` : ""}</h1>
        {denied && <p role="alert" className="mt-3 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">Your role does not have access to that area.</p>}
        {staff.role === "staff" && <p className="mt-2 text-sm text-muted">You can see job requests assigned to you.</p>}
      </div>

      {showEnquiries ? (
        <>
          <section aria-label="Pipeline" className="grid grid-cols-2 gap-px bg-stone sm:grid-cols-3 lg:grid-cols-6">
            {statusOrder.map((s) => (
              <Link key={s} href={`/dashboard/enquiries?status=${s}`} className="bg-white p-4 hover:bg-sand">
                <p className="text-3xl font-serif text-forest-900">{counts[s] ?? 0}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted">{statusLabels[s]}</p>
              </Link>
            ))}
          </section>

          <section>
            <h2 className="mb-3 text-xl text-forest-900">Follow-ups due</h2>
            <EnquiryTable rows={(due?.data ?? []) as unknown as EnquiryRow[]} empty="No follow-ups due. Nice work." showFollowUp />
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl text-forest-900">New job requests</h2>
              <Link href="/dashboard/enquiries" className="text-sm underline underline-offset-4">All job requests</Link>
            </div>
            <EnquiryTable rows={(fresh?.data ?? []) as unknown as EnquiryRow[]} empty="No new job requests." />
          </section>
        </>
      ) : (
        <p className="text-muted">Use the menu above to manage website content.</p>
      )}
    </div>
  );
}
