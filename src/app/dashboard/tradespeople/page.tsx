import type { Metadata } from "next";
import { BadgeCheck, Clock3, XCircle } from "lucide-react";
import { reviewTradesperson } from "@/app/actions/tradespeople";
import { can, requireStaff } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Tradesperson Verification" };
export const dynamic = "force-dynamic";

type Applicant = {
  id: string;
  full_name: string;
  public_name: string;
  phone: string;
  email: string;
  trade: string;
  service_area: string;
  experience_years: number;
  bio: string;
  qualification_type: string;
  qualification_details: string;
  qualification_reference: string;
  cewp_reference: string;
  portfolio_url: string | null;
  identity_checked: boolean;
  qualification_checked: boolean;
  references_checked: boolean;
  practical_assessment: boolean;
  cewp_verified: boolean;
  application_status: string;
  published: boolean;
  verification_notes: string;
  created_at: string;
};

export default async function TradespeopleReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; rejected?: string; reviewed?: string; error?: string }>;
}) {
  await requireStaff((role) => can.verifyTradespeople(role));
  const query = await searchParams;
  const db = createAdminClient();
  const { data, error } = db
    ? await db.from("tradespeople").select("*").order("created_at", { ascending: false }).limit(200)
    : { data: null, error: { message: "Supabase service credentials are not configured." } };
  const applicants = (data ?? []) as Applicant[];
  const pending = applicants.filter((a) => a.application_status === "pending");
  const verified = applicants.filter((a) => a.application_status === "verified");
  const rejected = applicants.filter((a) => a.application_status === "rejected");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-700">Private review queue</p>
        <h1 className="mt-2 text-3xl text-forest-900">Tradesperson verification</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Applications stay private until the review checks are complete. A profile is published only when identity, trade evidence, references and practical capability have been checked. Electricians also need a verified Energy Commission CEWP before they can be listed for wiring work.
        </p>
      </div>

      {query.verified && <p role="status" className="rounded-xl border border-forest-700/20 bg-forest-100 px-4 py-3 text-sm text-forest-900">Professional approved and published in the public directory.</p>}
      {query.rejected && <p role="status" className="rounded-xl border border-stone bg-white px-4 py-3 text-sm text-muted">Application marked as rejected.</p>}
      {query.reviewed && <p role="status" className="rounded-xl border border-stone bg-white px-4 py-3 text-sm text-muted">Review saved. The application remains private until every required check is complete.</p>}
      {query.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">Could not complete that action. Check the application and try again.</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">Could not load applications: {error.message}</p>}

      <section className="grid grid-cols-3 gap-3">
        <div className="border border-stone bg-white p-4"><p className="text-2xl font-serif text-forest-900">{pending.length}</p><p className="mt-1 text-xs uppercase tracking-wider text-muted">Pending review</p></div>
        <div className="border border-stone bg-white p-4"><p className="text-2xl font-serif text-forest-900">{verified.length}</p><p className="mt-1 text-xs uppercase tracking-wider text-muted">Verified</p></div>
        <div className="border border-stone bg-white p-4"><p className="text-2xl font-serif text-forest-900">{rejected.length}</p><p className="mt-1 text-xs uppercase tracking-wider text-muted">Rejected</p></div>
      </section>

      {applicants.length === 0 ? (
        <p className="border border-stone bg-white px-5 py-8 text-sm text-muted">No tradesperson applications have been received yet.</p>
      ) : (
        <div className="space-y-5">
          {applicants.map((person) => (
            <article key={person.id} className="overflow-hidden border border-stone bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone bg-sand px-5 py-4">
                <div>
                  <p className="text-lg font-semibold text-forest-900">{person.public_name} <span className="text-sm font-normal text-muted">({person.full_name})</span></p>
                  <p className="mt-1 text-sm text-muted">{person.trade} · {person.service_area} · {person.experience_years} years' experience</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${person.application_status === "verified" ? "bg-forest-100 text-forest-900" : person.application_status === "rejected" ? "bg-stone text-ink" : "bg-amber-50 text-amber-900"}`}>
                  {person.application_status === "verified" ? <BadgeCheck size={14} /> : person.application_status === "rejected" ? <XCircle size={14} /> : <Clock3 size={14} />}
                  {person.application_status}
                </span>
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-3 text-sm">
                  <div><span className="text-muted">Phone:</span> <a className="font-medium text-forest-900 underline underline-offset-4" href={`tel:${person.phone}`}>{person.phone}</a></div>
                  <div><span className="text-muted">Email:</span> <a className="font-medium text-forest-900 underline underline-offset-4" href={`mailto:${person.email}`}>{person.email}</a></div>
                  <div><span className="text-muted">Training / evidence:</span> <strong>{person.qualification_type}</strong></div>
                  <p className="whitespace-pre-wrap text-ink/75">{person.qualification_details}</p>
                  {person.qualification_reference && <p><span className="text-muted">Certificate / trade-test ref:</span> {person.qualification_reference}</p>}
                  {person.cewp_reference && <p><span className="text-muted">CEWP ref:</span> {person.cewp_reference}</p>}
                  {person.portfolio_url && <p><a href={person.portfolio_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-900 underline underline-offset-4">Open work samples ↗</a></p>}
                  {person.bio && <p className="border-t border-stone pt-3 leading-relaxed text-ink/75">{person.bio}</p>}
                  <p className="text-xs text-muted">Applied {new Date(person.created_at).toLocaleString("en-GB")}</p>
                </div>

                <form action={reviewTradesperson} className="space-y-4 rounded-xl bg-bone p-4">
                  <input type="hidden" name="id" value={person.id} />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">Verification checklist</p>
                  <label className="flex items-start gap-3 text-sm text-ink/80">
                    <input type="checkbox" name="identity_checked" defaultChecked={person.identity_checked} className="mt-0.5 h-4 w-4 accent-forest-800" />
                    <span>Identity checked against appropriate evidence</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm text-ink/80">
                    <input type="checkbox" name="qualification_checked" defaultChecked={person.qualification_checked} className="mt-0.5 h-4 w-4 accent-forest-800" />
                    <span>Training, qualification or trade evidence checked</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm text-ink/80">
                    <input type="checkbox" name="references_checked" defaultChecked={person.references_checked} className="mt-0.5 h-4 w-4 accent-forest-800" />
                    <span>Work references checked</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm text-ink/80">
                    <input type="checkbox" name="practical_assessment" defaultChecked={person.practical_assessment} className="mt-0.5 h-4 w-4 accent-forest-800" />
                    <span>Practical assessment / work evidence reviewed</span>
                  </label>
                  {person.trade === "Electrician" && (
                    <label className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                      <input type="checkbox" name="cewp_verified" defaultChecked={person.cewp_verified} className="mt-0.5 h-4 w-4 accent-forest-800" />
                      <span><strong>CEWP independently verified</strong><span className="mt-1 block text-xs">Required before this electrician can be published for indoor wiring work.</span><a className="mt-2 inline-block text-xs font-semibold underline underline-offset-4" href="https://www.energycom.gov.gh/index.php/initiatives/electrical-wiring" target="_blank" rel="noopener noreferrer">Energy Commission verification guidance ↗</a><a className="mt-1 block text-xs font-semibold underline underline-offset-4" href="https://www.energycom.gov.gh/index.php/documents/category/22-cewp-register?download=74%3Acentral-region" target="_blank" rel="noopener noreferrer">Central Region CEWP register ↗</a></span>
                    </label>
                  )}
                  {person.trade !== "Electrician" && <input type="hidden" name="cewp_verified" value="off" />}
                  <div>
                    <label htmlFor={`notes-${person.id}`} className="label">Private verification notes</label>
                    <textarea id={`notes-${person.id}`} name="verification_notes" rows={3} maxLength={2000} defaultValue={person.verification_notes} className="field" />
                  </div>
                  <p className="text-xs leading-relaxed text-muted">Approving requires every applicable check above. Saving an incomplete checklist keeps the application pending.</p>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" name="decision" value="review" className="btn btn-primary">Save checks / approve if complete</button>
                    <button type="submit" name="decision" value="reject" className="btn btn-outline">Reject application</button>
                  </div>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
