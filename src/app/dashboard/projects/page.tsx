import type { Metadata } from "next";
import Link from "next/link";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Portfolio" };

export default async function ProjectsAdmin() {
  await requireStaff((r) => can.managePortfolio(r));
  const db = await createClient();
  const [{ data }, { data: ratings }] = await Promise.all([
    db.from("projects").select("id,title,category,location,published,featured,is_placeholder").order("created_at", { ascending: false }),
    db.from("project_ratings").select("project_id,rating"),
  ]);
  const score: Record<string, { sum: number; n: number }> = {};
  for (const r of ratings ?? []) {
    const s = (score[r.project_id] ??= { sum: 0, n: 0 });
    s.sum += r.rating;
    s.n += 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl text-forest-900">Portfolio</h1>
        <Link href="/dashboard/projects/new" className="btn btn-primary">Add project</Link>
      </div>
      {(data ?? []).length === 0 ? (
        <p className="border border-stone bg-white px-4 py-6 text-sm text-muted">
          No projects yet. The public site is showing clearly-labelled placeholders until you publish a real project.
        </p>
      ) : (
        <ul className="divide-y divide-stone border border-stone bg-white">
          {data!.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <Link href={`/dashboard/projects/${p.id}`} className="font-medium text-forest-900 underline-offset-4 hover:underline">{p.title}</Link>
                <p className="text-xs text-muted">{p.category} · {p.location}</p>
              </div>
              <div className="flex gap-2 text-xs">
                {score[p.id] && (
                  <span className="rounded-sm border border-stone px-2 py-0.5" title="Visitor rating">
                    ★ {(score[p.id].sum / score[p.id].n).toFixed(1)} ({score[p.id].n})
                  </span>
                )}
                {p.is_placeholder && <span className="rounded-sm bg-brass/20 px-2 py-0.5">Placeholder</span>}
                {p.featured && <span className="rounded-sm bg-forest-100 px-2 py-0.5">Featured</span>}
                <span className={`rounded-sm px-2 py-0.5 ${p.published ? "bg-forest-800 text-bone" : "bg-stone"}`}>{p.published ? "Published" : "Draft"}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
