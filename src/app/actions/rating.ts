"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export type RateResult = { ok: boolean; message?: string; average?: number; total?: number };

// Best-effort per-instance throttle (20 ratings / 10 min / IP), as for enquiries.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

const input = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(100),
  rating: z.number().int().min(1).max(5),
});

export async function rateProject(slug: string, rating: number): Promise<RateResult> {
  const parsed = input.safeParse({ slug, rating });
  if (!parsed.success) return { ok: false, message: "Please choose between 1 and 5 stars." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) return { ok: false, message: "Too many ratings from this connection. Please try again later." };

  const db = createAdminClient();
  if (!db) return { ok: false, message: "Ratings are not available right now." };

  const { data: project } = await db.from("projects").select("id").eq("slug", parsed.data.slug).eq("published", true).maybeSingle();
  if (!project) return { ok: false, message: "This project cannot be rated." };

  // One rating per visitor per project. Salted one-way hash: the IP itself is never stored.
  const salt = process.env.RATING_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const voter_hash = createHash("sha256")
    .update(`${salt}|${ip}|${h.get("user-agent") ?? ""}`)
    .digest("hex");

  const { error } = await db
    .from("project_ratings")
    .upsert({ project_id: project.id, rating: parsed.data.rating, voter_hash }, { onConflict: "project_id,voter_hash" });
  if (error) {
    console.error("[rating] save failed", error.message);
    return { ok: false, message: "Could not save your rating. Please try again." };
  }

  const { data: rows } = await db.from("project_ratings").select("rating").eq("project_id", project.id);
  const list = rows ?? [];
  const total = list.length;
  const average = total ? Math.round((list.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10 : 0;

  revalidatePath(`/projects/${parsed.data.slug}`);
  revalidatePath("/projects");
  revalidatePath("/");
  return { ok: true, average, total };
}
