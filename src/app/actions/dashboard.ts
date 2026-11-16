"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { can, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ANNOUNCEMENTS_KEY, editableContent, statusLabels } from "@/lib/content";
import { announcementsSchema, noteSchema, personSchema, projectSchema } from "@/lib/validation";

export type FormResult = { ok?: boolean; error?: string };

const STATUSES = ["new", "contacted", "consultation", "proposal", "won", "scheduled", "in_progress", "completed", "lost"] as const;

// ───────── Enquiries ─────────
// All writes run as the signed-in user, so row-level security is the final gate.

export async function updateEnquiry(_p: FormResult, fd: FormData): Promise<FormResult> {
  const staff = await requireStaff((r) => can.workEnquiries(r));
  const parsed = z
    .object({
      id: z.uuid(),
      status: z.enum(STATUSES),
      assigned_to: z.union([z.uuid(), z.literal("")]),
      follow_up_at: z.union([z.iso.date(), z.literal("")]),
      lost_reason: z.string().trim().max(500).optional().default(""),
    })
    .safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Check the status, assignee and follow-up date." };
  const v = parsed.data;

  const db = await createClient();
  const { data: before } = await db.from("enquiries").select("status,assigned_to").eq("id", v.id).single();
  if (!before) return { error: "Enquiry not found or you do not have access." };

  const patch: Record<string, unknown> = {
    status: v.status,
    follow_up_at: v.follow_up_at || null,
    lost_reason: v.status === "lost" ? v.lost_reason || null : null,
  };
  const newAssignee = v.assigned_to || null;
  const assigneeChanged = newAssignee !== before.assigned_to;
  if (assigneeChanged) {
    if (!can.assign(staff.role)) return { error: "Only managers can assign enquiries." };
    patch.assigned_to = newAssignee;
  }

  const { error } = await db.from("enquiries").update(patch).eq("id", v.id);
  if (error) return { error: "Could not save changes." };

  const log: { enquiry_id: string; author_id: string; kind: string; body: string }[] = [];
  if (before.status !== v.status)
    log.push({ enquiry_id: v.id, author_id: staff.id, kind: "status_change", body: `Status: ${statusLabels[before.status]} → ${statusLabels[v.status]}` });
  if (assigneeChanged) {
    const name = newAssignee
      ? ((await db.from("profiles").select("full_name,email").eq("id", newAssignee).single()).data)
      : null;
    log.push({ enquiry_id: v.id, author_id: staff.id, kind: "assignment", body: name ? `Assigned to ${name.full_name || name.email}` : "Unassigned" });
  }
  if (log.length) await db.from("enquiry_notes").insert(log);

  revalidatePath(`/dashboard/enquiries/${v.id}`);
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function addNote(_p: FormResult, fd: FormData): Promise<FormResult> {
  const staff = await requireStaff((r) => can.workEnquiries(r));
  const parsed = noteSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid note." };
  const db = await createClient();
  const { error } = await db.from("enquiry_notes").insert({ ...parsed.data, author_id: staff.id });
  if (error) return { error: "Could not save the note." };
  revalidatePath(`/dashboard/enquiries/${parsed.data.enquiry_id}`);
  return { ok: true };
}

// ───────── Portfolio ─────────
export async function saveProject(_p: FormResult, fd: FormData): Promise<FormResult> {
  await requireStaff((r) => can.managePortfolio(r));
  const id = z.union([z.uuid(), z.literal("")]).parse(fd.get("id") ?? "");
  const parsed = projectSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { error: `${String(i?.path[0] ?? "Form")}: ${i?.message}` };
  }
  const v = parsed.data;
  const urls = v.image_urls
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (urls.some((u) => !/^(https:\/\/|\/)\S+$/i.test(u))) return { error: "Image URLs must start with https:// or /" };

  const row = {
    title: v.title,
    slug: v.slug,
    category: v.category,
    location: v.location,
    year: v.year,
    summary: v.summary,
    body: v.body,
    client: v.client || null,
    scope: v.scope || null,
    image_urls: urls,
    is_placeholder: fd.get("is_placeholder") === "on",
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
    latitude: v.latitude,
    longitude: v.longitude,
  };

  const db = await createClient();
  const q = id ? db.from("projects").update(row).eq("id", id) : db.from("projects").insert(row);
  const { error } = await q;
  if (error) return { error: error.code === "23505" ? "That URL slug is already used." : "Could not save the project." };

  revalidatePath("/", "layout");
  redirect("/dashboard/projects");
}

export async function deleteProject(fd: FormData) {
  await requireStaff((r) => can.managePortfolio(r));
  const id = z.uuid().parse(fd.get("id"));
  const db = await createClient();
  await db.from("projects").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/dashboard/projects");
}

// Remove all visitor ratings for a project (e.g. after spam). RLS limits this to admin/manager/editor.
export async function clearRatings(fd: FormData) {
  await requireStaff((r) => can.managePortfolio(r));
  const id = z.uuid().parse(fd.get("id"));
  const db = await createClient();
  await db.from("project_ratings").delete().eq("project_id", id);
  revalidatePath("/", "layout");
  redirect(`/dashboard/projects/${id}`);
}

// ───────── Website content ─────────
export async function saveContent(_p: FormResult, fd: FormData): Promise<FormResult> {
  const staff = await requireStaff((r) => can.editContent(r));
  const rows = Object.keys(editableContent).map((key) => ({
    key,
    value: String(fd.get(key) ?? "").trim().slice(0, 2000),
    updated_by: staff.id,
    updated_at: new Date().toISOString(),
  }));
  const db = await createClient();
  const { error } = await db.from("site_content").upsert(rows);
  if (error) return { error: "Could not save content." };
  revalidatePath("/", "layout");
  return { ok: true };
}

// ───────── Announcements ─────────
export async function saveAnnouncements(_p: FormResult, fd: FormData): Promise<FormResult> {
  const staff = await requireStaff((r) => can.editContent(r));
  let raw: unknown;
  try {
    raw = JSON.parse(String(fd.get("items") ?? "[]"));
  } catch {
    return { error: "Could not read the announcements. Please try again." };
  }
  const parsed = announcementsSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the announcements." };
  const db = await createClient();
  const { error } = await db.from("site_content").upsert({
    key: ANNOUNCEMENTS_KEY,
    value: JSON.stringify(parsed.data),
    updated_by: staff.id,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: "Could not save the announcements." };
  revalidatePath("/", "layout");
  return { ok: true };
}

// ───────── People (public founder & team profiles) ─────────
export async function savePerson(_p: FormResult, fd: FormData): Promise<FormResult> {
  await requireStaff((r) => can.editContent(r));
  const id = z.union([z.uuid(), z.literal("")]).parse(fd.get("id") ?? "");
  const parsed = personSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  const v = parsed.data;
  const row = {
    full_name: v.full_name,
    role_title: v.role_title,
    rank: v.rank,
    linkedin_url: v.linkedin_url || null,
    x_url: v.x_url || null,
    instagram_url: v.instagram_url || null,
    facebook_url: v.facebook_url || null,
    public_email: v.public_email || null,
    bio: v.bio,
    qualifications: v.qualifications,
    responsibilities: v.responsibilities,
    contributions: v.contributions,
    photo_url: v.photo_url || null,
    sort_order: v.sort_order,
    is_founder: fd.get("is_founder") === "on",
    published: fd.get("published") === "on",
  };

  const db = await createClient();
  // Only one founder feature: hand the flag over from whoever had it.
  if (row.is_founder) {
    const clear = db.from("people").update({ is_founder: false }).eq("is_founder", true);
    await (id ? clear.neq("id", id) : clear);
  }
  const { error } = await (id ? db.from("people").update(row).eq("id", id) : db.from("people").insert(row));
  if (error) return { error: "Could not save this person." };

  revalidatePath("/", "layout");
  redirect("/dashboard/people");
}

export async function deletePerson(fd: FormData) {
  await requireStaff((r) => can.editContent(r));
  const id = z.uuid().parse(fd.get("id"));
  const db = await createClient();
  await db.from("people").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/dashboard/people");
}

// ───────── Team (admin only) ─────────
export async function updateTeamMember(_p: FormResult, fd: FormData): Promise<FormResult> {
  const staff = await requireStaff((r) => can.manageTeam(r));
  const parsed = z
    .object({ id: z.uuid(), role: z.enum(["admin", "manager", "staff", "editor"]) })
    .safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Invalid role." };
  const active = fd.get("active") === "on";
  if (parsed.data.id === staff.id && (!active || parsed.data.role !== "admin"))
    return { error: "You cannot remove your own admin access." };
  const db = await createClient();
  const { error } = await db.from("profiles").update({ role: parsed.data.role, active }).eq("id", parsed.data.id);
  if (error) return { error: "Could not update the team member." };
  revalidatePath("/dashboard/team");
  return { ok: true };
}
