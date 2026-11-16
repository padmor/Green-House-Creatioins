import "server-only";
import { createPublicClient } from "./supabase/public";
import {
  ANNOUNCEMENTS_KEY,
  editableContent,
  fallbackProjects,
  type Announcement,
  type AnnouncementItem,
  type ContentKey,
  type Project,
  type Rating,
  type StaffRank,
  staffRanks,
} from "./content";

// Public reads. Falls back to approved defaults / clearly-labelled placeholders
// so the site renders before the database is connected or populated.

const retiredStarterProjectSlugs = new Set([
  "the-ridge-residences",
  "harbour-view-office-complex",
  "gbc-training-centre",
]);

export async function getProjects(): Promise<Project[]> {
  const db = createPublicClient();
  if (!db) return fallbackProjects;
  const [{ data, error }, ratings] = await Promise.all([
    db
      .from("projects")
      .select("slug,title,category,location,year,summary,body,client,scope,image_urls,is_placeholder,featured,latitude,longitude")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("year", { ascending: false, nullsFirst: false }),
    getRatings(),
  ]);
  if (error || !data) return fallbackProjects;

  // Remove the old unverified starter records, enrich any matching database rows with the
  // sourced copy/disclosure, and append the documented references if the database has not
  // been populated with them yet. Manager-added projects remain intact.
  const published = (data as Project[])
    .filter((p) => !retiredStarterProjectSlugs.has(p.slug))
    .map((p) => {
      const reference = fallbackProjects.find((candidate) => candidate.slug === p.slug);
      const merged = reference
        ? { ...p, ...reference, year: p.year ?? reference.year }
        : p;
      return ratings[p.slug] ? { ...merged, rating: ratings[p.slug] } : merged;
    });
  const additions = fallbackProjects.filter((candidate) => !published.some((p) => p.slug === candidate.slug));
  return [...published, ...additions];
}

/** Visitors can rate only when the server can record ratings (service credentials configured). */
export const ratingsEnabled = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

// Aggregate visitor ratings per published project (average to one decimal, count).
async function getRatings(): Promise<Record<string, Rating>> {
  const db = createPublicClient();
  if (!db) return {};
  const { data, error } = await db.rpc("project_rating_summary");
  if (error || !data) return {};
  return Object.fromEntries(
    (data as { slug: string; average: number | string; total: number | string }[]).map((r) => [r.slug, { average: Number(r.average), total: Number(r.total) }]),
  );
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export type Person = {
  id: string;
  full_name: string;
  role_title: string;
  rank: StaffRank;
  bio: string;
  photo_url: string | null;
  linkedin_url: string | null;
  /** One item per line. */
  qualifications: string;
  /** Duties on the job, one per line. */
  responsibilities: string;
  /** Contributions to GBC's work, one per line. */
  contributions: string;
  x_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  public_email: string | null;
  is_founder: boolean;
  /** Placeholder profile from lib/sampleTeam.ts (never stored in the database). */
  sample?: boolean;
};

// Published founder & team profiles. No fallback: real people only, so the sections hide until added.
export async function getPeople(): Promise<{ founder: Person | null; team: Person[] }> {
  const db = createPublicClient();
  if (!db) return { founder: null, team: [] };
  const { data, error } = await db
    .from("people")
    .select(
      "id,full_name,role_title,rank,bio,photo_url,linkedin_url,qualifications,responsibilities,contributions,x_url,instagram_url,facebook_url,public_email,is_founder",
    )
    .eq("published", true)
    .order("sort_order")
    .order("created_at");
  if (error || !data) return { founder: null, team: [] };
  // Team listed by rank first (Leadership → Trainee), then by the dashboard order.
  const people = (data as Person[]).sort((a, b) => staffRanks.indexOf(a.rank) - staffRanks.indexOf(b.rank));
  return { founder: people.find((p) => p.is_founder) ?? null, team: people.filter((p) => !p.is_founder) };
}

/** Every announcement, published or not (for the dashboard). */
export async function getAnnouncementItems(): Promise<AnnouncementItem[]> {
  const db = createPublicClient();
  if (!db) return [];
  const { data } = await db.from("site_content").select("value").eq("key", ANNOUNCEMENTS_KEY).maybeSingle();
  try {
    const list = JSON.parse(data?.value ?? "[]");
    return Array.isArray(list) ? (list as AnnouncementItem[]) : [];
  } catch {
    return [];
  }
}

/** Published announcements that haven't passed their end date (end of that day, Ghana time = UTC), newest first. */
export async function getAnnouncements(): Promise<Announcement[]> {
  const today = new Date().toISOString().slice(0, 10);
  return (await getAnnouncementItems())
    .filter((a) => a.enabled && a.title.trim() && (!a.ends_on || a.ends_on >= today))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ id, title, message, link_label, link_url, date }) => ({ id, title, message, link_label, link_url, date }));
}

export async function getContent(): Promise<Record<ContentKey, string>> {
  const out: Record<string, string> = { ...editableContent };
  const db = createPublicClient();
  if (!db) return out as Record<ContentKey, string>;
  const { data } = await db.from("site_content").select("key,value");
  for (const row of data ?? []) {
    if (row.key in editableContent && row.value?.trim()) out[row.key] = row.value;
  }
  return out as Record<ContentKey, string>;
}
