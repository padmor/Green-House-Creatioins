"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { enquirySchema } from "@/lib/validation";
import { sendEnquiryEmails } from "@/lib/notify";

export type EnquiryState = {
  ok: boolean;
  reference?: string;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

// Best-effort per-instance throttle (5 enquiries / 10 min / IP). On serverless this is
// per-instance only; add an edge/WAF rate limit for stronger protection.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([k, v]) => typeof v === "string" && !k.startsWith("$ACTION")),
  ) as Record<string, string>;

  // Honeypot: pretend success so bots learn nothing.
  if (raw.website) return { ok: true, reference: "GBC-00-0000" };

  // The compact "Get in touch" form asks only for the project type; record the rest as not yet given.
  if (raw.quick) {
    raw.service ||= "Not sure yet";
    raw.location ||= "To be confirmed";
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      errors[k] ??= issue.message;
    }
    const { consent: _c, website: _w, ...values } = raw;
    return { ok: false, errors, values, message: "Please check the highlighted fields." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return { ok: false, values: raw, message: "Too many enquiries from this connection. Please try again later." };
  }

  const db = createAdminClient();
  if (!db) {
    console.error("[enquiry] Supabase service credentials are not configured");
    return { ok: false, values: raw, message: "We could not save your enquiry right now. Please call or email us instead." };
  }

  const d = parsed.data;
  const { data, error } = await db
    .from("enquiries")
    .insert({
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      organisation: d.organisation || null,
      service: d.service,
      project_type: d.project_type,
      location: d.location,
      budget_range: d.budget_range || null,
      timeline: d.timeline || null,
      message: d.message,
      consent: true,
    })
    .select("reference")
    .single();

  if (error || !data) {
    console.error("[enquiry] insert failed", error?.message);
    return { ok: false, values: raw, message: "We could not save your enquiry right now. Please try again or contact us directly." };
  }

  await sendEnquiryEmails({ ...d, reference: data.reference });
  return { ok: true, reference: data.reference };
}
