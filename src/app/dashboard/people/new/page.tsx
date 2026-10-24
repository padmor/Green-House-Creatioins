import type { Metadata } from "next";
import { can, requireStaff } from "@/lib/auth";
import { PersonForm } from "../PersonForm";

export const metadata: Metadata = { title: "Add person" };

export default async function NewPerson() {
  await requireStaff((r) => can.editContent(r));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-forest-900">Add person</h1>
      <PersonForm p={{}} />
    </div>
  );
}
