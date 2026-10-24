import type { Metadata } from "next";
import { can, requireStaff } from "@/lib/auth";
import { ProjectForm } from "../ProjectForm";

export const metadata: Metadata = { title: "Add project" };

export default async function NewProject() {
  await requireStaff((r) => can.managePortfolio(r));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-forest-900">Add project</h1>
      <ProjectForm p={{}} />
    </div>
  );
}
