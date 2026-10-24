import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PersonForm } from "../PersonForm";

export const metadata: Metadata = { title: "Edit person" };

export default async function EditPerson({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff((r) => can.editContent(r));
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await createClient();
  const { data } = await db.from("people").select("*").eq("id", id).single();
  if (!data) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-forest-900">Edit person</h1>
      <PersonForm p={data} />
    </div>
  );
}
