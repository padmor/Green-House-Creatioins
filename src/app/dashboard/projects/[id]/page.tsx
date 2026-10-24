import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ClearRatingsButton, ProjectForm } from "../ProjectForm";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff((r) => can.managePortfolio(r));
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await createClient();
  const [{ data }, { data: ratings }] = await Promise.all([
    db.from("projects").select("*").eq("id", id).single(),
    db.from("project_ratings").select("rating").eq("project_id", id),
  ]);
  if (!data) notFound();
  const n = ratings?.length ?? 0;
  const avg = n ? ratings!.reduce((s, r) => s + r.rating, 0) / n : 0;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-forest-900">Edit project</h1>
      <div className="flex max-w-3xl flex-wrap items-center justify-between gap-4 border border-stone bg-white px-4 py-3 text-sm">
        <p>
          <span className="font-semibold text-forest-900">Visitor rating:</span>{" "}
          {n ? `★ ${avg.toFixed(1)} out of 5 from ${n} ${n === 1 ? "rating" : "ratings"}` : "No ratings yet (hidden on the website)."}
        </p>
        {n > 0 && <ClearRatingsButton id={id} />}
      </div>
      <ProjectForm p={data} />
    </div>
  );
}
