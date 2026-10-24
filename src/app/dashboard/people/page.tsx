import type { Metadata } from "next";
import Link from "next/link";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Founder & team" };

export default async function PeopleAdmin() {
  await requireStaff((r) => can.editContent(r));
  const db = await createClient();
  const { data } = await db.from("people").select("id,full_name,role_title,rank,is_founder,published,sort_order").order("sort_order").order("created_at");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl text-forest-900">Founder & team</h1>
        <Link href="/dashboard/people/new" className="btn btn-primary">Add person</Link>
      </div>
      <p className="max-w-2xl text-sm text-muted">
        People shown on the About page and the homepage. The sections stay hidden on the website until at least one person is published.
      </p>
      {(data ?? []).length === 0 ? (
        <p className="border border-stone bg-white px-4 py-6 text-sm text-muted">No one added yet. Start with the founder.</p>
      ) : (
        <ul className="divide-y divide-stone border border-stone bg-white">
          {data!.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <Link href={`/dashboard/people/${p.id}`} className="font-medium text-forest-900 underline-offset-4 hover:underline">{p.full_name}</Link>
                <p className="text-xs text-muted">{p.role_title} · {p.rank} · order {p.sort_order}</p>
              </div>
              <div className="flex gap-2 text-xs">
                {p.is_founder && <span className="rounded-sm bg-forest-100 px-2 py-0.5">Founder</span>}
                <span className={`rounded-sm px-2 py-0.5 ${p.published ? "bg-forest-800 text-bone" : "bg-stone"}`}>{p.published ? "Shown" : "Hidden"}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
