import "server-only";
import { Resend } from "resend";
import { company } from "./content";

type EnquiryEmail = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  project_type: string;
  location: string;
  message: string;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Email is best-effort: the enquiry is already stored, so a mail failure must never lose it.
export async function sendEnquiryEmails(e: EnquiryEmail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.warn("[notify] RESEND_API_KEY / EMAIL_FROM not set; skipping emails for", e.reference);
    return;
  }
  const resend = new Resend(key);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const managers = (process.env.ENQUIRY_NOTIFY_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const jobs: Promise<unknown>[] = [];

  if (managers.length) {
    jobs.push(
      resend.emails.send({
        from,
        to: managers,
        replyTo: e.email,
        subject: `New job request ${e.reference}: ${e.service} in ${e.location}`,
        html: `<p><strong>${esc(e.name)}</strong> sent a new job request (${esc(e.reference)}).</p>
<p>${esc(e.service)} · ${esc(e.project_type)} · ${esc(e.location)}<br>${esc(e.email)} · ${esc(e.phone)}</p>
<blockquote>${esc(e.message).replace(/\n/g, "<br>")}</blockquote>
<p><a href="${siteUrl}/dashboard/enquiries">Open job desk</a></p>`,
      }),
    );
  }

  jobs.push(
    resend.emails.send({
      from,
      to: e.email,
      subject: `We have received your job request (${e.reference})`,
      html: `<p>Dear ${esc(e.name)},</p>
<p>Thank you for contacting ${esc(company.name)}. We have received your job request, reference <strong>${esc(e.reference)}</strong>, and a member of our team will be in touch.</p>
<p>${esc(company.tagline)}</p>`,
    }),
  );

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("[notify] email failed", r.reason));
}
