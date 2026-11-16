"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitTradespersonApplication, type TradeApplicationState } from "@/app/actions/tradespeople";
import { tradeCategories } from "@/lib/content";
import { BusyLabel } from "@/components/BusyLabel";

const initial: TradeApplicationState = {};
const trainingOptions = [
  "CTVET / TVET qualification",
  "Apprenticeship / master craftsperson training",
  "Trade test certificate",
  "Work portfolio and references",
  "Other relevant training",
] as const;

const inputClass = "field";
const labelClass = "label";

export function TradeApplicationForm() {
  const [state, action, pending] = useActionState(submitTradespersonApplication, initial);
  const values = state.values ?? {};
  const errors = state.errors ?? {};

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl border border-forest-700/20 bg-forest-100 p-7 sm:p-8">
        <p className="font-serif text-2xl font-semibold text-forest-900">Application received</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">
          {state.message ?? "Your application is now in the review queue."} GBC will contact you if further information or an assessment is needed. No profile is published until verification is complete.
        </p>
      </div>
    );
  }

  const error = (key: string) => errors[key] ? <p className="mt-1 text-xs text-red-700">{errors[key]}</p> : null;

  return (
    <form action={action} className="space-y-5">
      {state.message && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.message}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="app-full-name">Full legal name *</label>
          <input id="app-full-name" name="full_name" required maxLength={120} defaultValue={values.full_name ?? ""} className={inputClass} autoComplete="name" />
          {error("full_name")}
        </div>
        <div>
          <label className={labelClass} htmlFor="app-public-name">Name shown on your profile *</label>
          <input id="app-public-name" name="public_name" required maxLength={80} defaultValue={values.public_name ?? ""} className={inputClass} />
          {error("public_name")}
        </div>
        <div>
          <label className={labelClass} htmlFor="app-phone">Phone / WhatsApp *</label>
          <input id="app-phone" name="phone" required type="tel" maxLength={30} defaultValue={values.phone ?? ""} className={inputClass} autoComplete="tel" placeholder="+233…" />
          {error("phone")}
        </div>
        <div>
          <label className={labelClass} htmlFor="app-email">Email address *</label>
          <input id="app-email" name="email" required type="email" maxLength={254} defaultValue={values.email ?? ""} className={inputClass} autoComplete="email" />
          {error("email")}
        </div>
        <div>
          <label className={labelClass} htmlFor="app-trade">Your trade *</label>
          <select id="app-trade" name="trade" required defaultValue={values.trade ?? ""} className={inputClass}>
            <option value="">Choose your trade</option>
            {tradeCategories.map((t) => <option key={t.singular} value={t.singular}>{t.name}</option>)}
          </select>
          {error("trade")}
        </div>
        <div>
          <label className={labelClass} htmlFor="app-area">Town / service area *</label>
          <input id="app-area" name="service_area" required maxLength={160} defaultValue={values.service_area ?? ""} className={inputClass} placeholder="e.g. Cape Coast, Abura" />
          {error("service_area")}
        </div>
        <div>
          <label className={labelClass} htmlFor="app-experience">Years of experience *</label>
          <input id="app-experience" name="experience_years" required type="number" min="0" max="60" step="1" defaultValue={values.experience_years ?? "0"} className={inputClass} />
          {error("experience_years")}
        </div>
        <div>
          <label className={labelClass} htmlFor="app-training">Training / evidence type *</label>
          <select id="app-training" name="qualification_type" required defaultValue={values.qualification_type ?? ""} className={inputClass}>
            <option value="">Select your evidence</option>
            {trainingOptions.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          {error("qualification_type")}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="app-qualification">Training, qualification or work-history details *</label>
        <textarea id="app-qualification" name="qualification_details" rows={3} required maxLength={1000} defaultValue={values.qualification_details ?? ""} className={inputClass} placeholder="Tell us where you trained, who you worked under, or what trade assessment you have completed." />
        {error("qualification_details")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="app-qualification-ref">Certificate / trade-test reference (optional)</label>
          <input id="app-qualification-ref" name="qualification_reference" maxLength={160} defaultValue={values.qualification_reference ?? ""} className={inputClass} />
          {error("qualification_reference")}
        </div>
        <div>
          <label className={labelClass} htmlFor="app-cewp">Energy Commission CEWP reference (electricians)</label>
          <input id="app-cewp" name="cewp_reference" maxLength={160} defaultValue={values.cewp_reference ?? ""} className={inputClass} placeholder="Required before electrical wiring work can be listed" />
          {error("cewp_reference")}
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="app-portfolio">Link to work samples (optional)</label>
        <input id="app-portfolio" name="portfolio_url" type="url" maxLength={500} defaultValue={values.portfolio_url ?? ""} className={inputClass} placeholder="https://…" />
        {error("portfolio_url")}
      </div>
      <div>
        <label className={labelClass} htmlFor="app-bio">Short introduction (optional)</label>
        <textarea id="app-bio" name="bio" rows={3} maxLength={1200} defaultValue={values.bio ?? ""} className={inputClass} placeholder="What work do you specialise in? What areas can you cover?" />
        {error("bio")}
      </div>

      <div className="rounded-xl border border-stone bg-bone p-4 text-xs leading-relaxed text-muted">
        We review identity, trade evidence, references and practical work before approving a public profile. Electricians must provide a verified Energy Commission CEWP before being listed for indoor electrical wiring work. Do not submit your Ghana Card number or other sensitive identity numbers in this form.
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone bg-white p-4 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-forest-800" />
        <span>I agree that GBC may contact me, review the information I provide and retain this application for tradesperson verification, as explained in the <Link href="/privacy" className="underline underline-offset-2">privacy policy</Link>. *</span>
      </label>
      {error("consent")}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="app-website">Website</label>
        <input id="app-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
        <BusyLabel pending={pending} busy="Submitting…">Submit for review</BusyLabel>
      </button>
    </form>
  );
}
