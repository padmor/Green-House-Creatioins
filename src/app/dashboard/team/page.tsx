import type { Metadata } from "next";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TeamRow } from "./TeamRow";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  await requireStaff((r) => can.manageTeam(r));
  const db = await createClient();
  const { data } = await db.from("profiles").select("id,full_name,email,role,active").order("created_at");
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-forest-900">Team</h1>
      <p className="max-w-2xl text-sm text-muted">
        Create staff accounts in Supabase Authentication (Users → Add user). New accounts appear here inactive until you activate them and choose a role.
      </p>
      <ul className="divide-y divide-stone border border-stone bg-white">
        {(data ?? []).map((m) => <TeamRow key={m.id} m={m} />)}
      </ul>
    </div>
  );
}
