"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { can, requireStaff } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const trades = ["Tiler", "Electrician", "Plumber", "Carpenter", "Mason"] as const;
const qualificationTypes = [
  "CTVET / TVET qualification",
  "Apprenticeship / master craftsperson training",
  "Trade test certificate",
  "Work portfolio and references",
  "Other relevant training",
] as const;

const applicationSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name.").max(120),
  public_name: z.string().trim().min(2, "Enter the name customers may see.").max(80),
  phone: z.string().trim().regex(/^[+\d][\d\s()\-]{6,29}$/, "Enter a valid phone number."),
  email: z.email("Enter a valid email address."),
  trade: z.enum(trades, { error: "Choose your trade." }),
  service_area: z.string().trim().min(2, "Tell us your town or service area.").max(160),
  experience_years: z.preprocess((v) => Number(v), z.number().int().min(0).max(60)),
  qualification_type: z.enum(qualificationTypes, { error: "Choose your training or evidence type." }),
  qualification_details: z.string().trim().max(1000).optional().default(""),
  qualification_reference: z.string().trim().max(160).optional().default(""),
  cewp_reference: z.string().trim().max(160).optional().default(""),
  portfolio_url: z.union([z.literal(""), z.string().trim().regex(/^https:\/\/\S+$/, "Use a complete HTTPS link.")]).optional().default(""),
  bio: z.string().trim().max(1200).optional().default(""),
  consent: z.literal("on", { error: "Please agree that GBC can review and contact you about this application." }),
  website: z.string().max(0).optional().default(""),
});

export type TradeApplicationState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

const applicationHits = new Map<string, number[]>();
function isThrottled(ip: string) {
  const now = Date.now();
  const recent = (applicationHits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  applicationHits.set(ip, recent);
  return recent.length > 3;
}

export async function submitTradespersonApplication(
  _previous: TradeApplicationState,
  formData: FormData,
): Promise<TradeApplicationState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([key, value]) => typeof value === "string" && !key.startsWith("$ACTION")),
  ) as Record<string, string>;

  if (raw.website) return { ok: true, message: "Application received." };

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    const { consent: _consent, website: _website, ...values } = raw;
    return { errors, values, message: "Please check the highlighted fields." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isThrottled(ip)) {
    return { values: raw, message: "Too many applications from this connection. Please try again later." };
  }

  const db = createAdminClient();
  if (!db) {
    console.error("[tradespeople] Supabase service credentials are not configured");
    return { values: raw, message: "We could not save your application. Please contact GBC directly." };
  }

  const v = parsed.data;
  const { error } = await db.from("tradespeople").insert({
    full_name: v.full_name,
    public_name: v.public_name,
    phone: v.phone,
    email: v.email,
    trade: v.trade,
    service_area: v.service_area,
    experience_years: v.experience_years,
    qualification_type: v.qualification_type,
    qualification_details: v.qualification_details,
    qualification_reference: v.qualification_reference,
    cewp_reference: v.cewp_reference,
    portfolio_url: v.portfolio_url || null,
    bio: v.bio,
    consent: true,
    application_status: "pending",
    published: false,
  });

  if (error) {
    console.error("[tradespeople] application insert failed", error.message);
    return { values: raw, message: "We could not save your application. Please try again or contact GBC." };
  }

  return {
    ok: true,
    message: "Your application has been received. It is pending review and will not appear in the public directory until verification is complete.",
  };
}

/** Only GBC admins and managers can make a verification decision. */
export async function reviewTradesperson(formData: FormData): Promise<void> {
  await requireStaff((role) => can.verifyTradespeople(role));

  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/dashboard/tradespeople?error=invalid");

  const decision = formData.get("decision") === "reject" ? "reject" : "review";
  const identityChecked = formData.get("identity_checked") === "on";
  const qualificationChecked = formData.get("qualification_checked") === "on";
  const referencesChecked = formData.get("references_checked") === "on";
  const practicalAssessment = formData.get("practical_assessment") === "on";
  const cewpVerified = formData.get("cewp_verified") === "on";
  const notes = String(formData.get("verification_notes") ?? "").trim().slice(0, 2000);

  const db = createAdminClient();
  if (!db) redirect("/dashboard/tradespeople?error=database");

  const { data: applicant, error: readError } = await db
    .from("tradespeople")
    .select("id,trade,cewp_reference")
    .eq("id", id.data)
    .single();

  if (readError || !applicant) redirect("/dashboard/tradespeople?error=not-found");

  const electricianReady =
    applicant.trade !== "Electrician" || (cewpVerified && Boolean(String(applicant.cewp_reference ?? "").trim()));
  const ready =
    identityChecked && qualificationChecked && referencesChecked && practicalAssessment && electricianReady;

  const applicationStatus = decision === "reject" ? "rejected" : ready ? "verified" : "pending";
  const published = applicationStatus === "verified";

  const { error } = await db.from("tradespeople").update({
    identity_checked: identityChecked,
    qualification_checked: qualificationChecked,
    references_checked: referencesChecked,
    practical_assessment: practicalAssessment,
    cewp_verified: cewpVerified,
    verification_notes: notes,
    application_status: applicationStatus,
    published,
  }).eq("id", id.data);

  if (error) {
    console.error("[tradespeople] review update failed", error.message);
    redirect("/dashboard/tradespeople?error=save");
  }

  revalidatePath("/dashboard/tradespeople");
  revalidatePath("/projects");
  redirect(published ? "/dashboard/tradespeople?verified=1" : decision === "reject" ? "/dashboard/tradespeople?rejected=1" : "/dashboard/tradespeople?reviewed=1");
}
