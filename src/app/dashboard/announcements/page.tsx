import type { Metadata } from "next";
import { can, requireStaff } from "@/lib/auth";
import { getAnnouncementItems } from "@/lib/data";
import { AnnouncementsForm } from "./AnnouncementsForm";

export const metadata: Metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  await requireStaff((r) => can.editContent(r));
  const items = await getAnnouncementItems();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-forest-900">Announcements</h1>
      <p className="max-w-2xl text-sm text-muted">
        Visitors see a megaphone in the website header with a count of announcements they haven&apos;t read; clicking it opens them in a pop-up,
        newest first. Use it for real, approved news only, such as holiday hours or a project handover. When nothing is published, the pop-up
        says there are no announcements right now.
      </p>
      <AnnouncementsForm initial={items} />
    </div>
  );
}
