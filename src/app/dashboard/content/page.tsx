import type { Metadata } from "next";
import { can, requireStaff } from "@/lib/auth";
import { getContent } from "@/lib/data";
import { ContentForm } from "./ContentForm";

export const metadata: Metadata = { title: "Website content" };

export default async function ContentPage() {
  await requireStaff((r) => can.editContent(r));
  const values = await getContent();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-forest-900">Website content</h1>
      <p className="max-w-2xl text-sm text-muted">Edit approved headline and introduction text. Changes appear on the public site within about a minute.</p>
      <ContentForm values={values} />
    </div>
  );
}
