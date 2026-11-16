"use client";

import { Check, ChevronDown, CircleAlert, Send } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, type FormEvent } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { enquiryOptions } from "@/lib/content";
import { toast } from "@/lib/toast";
import { useLiveValidation } from "@/lib/useLiveValidation";

const initial: EnquiryState = { ok: false };

// Sends the enquiry, turning a lost connection into a friendly message (and keeping what was typed)
// instead of an error screen.
async function send(prev: EnquiryState, fd: FormData): Promise<EnquiryState> {
  const values: Record<string, string> = {};
  for (const [k, v] of fd) if (typeof v === "string" && k !== "consent" && k !== "website") values[k] = v;
  if (!navigator.onLine) return { ok: false, values, message: "You appear to be offline. Check your connection and press Try again." };
  try {
    return await submitEnquiry(prev, fd);
  } catch {
    return { ok: false, values, message: "We couldn't reach our server. Check your connection and press Try again, or call or email us." };
  }
}
const MESSAGE_MAX = 4000;
const MESSAGE_MIN = 10;

// The pop-up form keeps an unsent draft on this device, so closing the pop-up by accident loses nothing.
const DRAFT_KEY = "gbc-enquiry-draft";
const draftFields = ["name", "email", "service", "message"] as const;
type Draft = Partial<Record<(typeof draftFields)[number], string>>;
function readDraft(): Draft {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}") as Draft;
  } catch {
    return {};
  }
}
function saveDraft(form: HTMLFormElement) {
  const d: Draft = {};
  for (const f of draftFields) {
    const el = form.elements.namedItem(f) as HTMLInputElement | RadioNodeList | null;
    if (el?.value.trim()) d[f] = el.value;
  }
  try {
    if (Object.keys(d).length) localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {}
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

/* ---------- Send button ---------- */

// idle → sending (the paper plane drifts like a kite) → sent (it flies away, a tick lands)
// or → failed (it comes back and the button gives a small shake).
type Phase = "idle" | "sending" | "sent" | "failed";
const phaseText: Record<Phase, string> = { idle: "", sending: "Sending", sent: "Sent", failed: "Try again" };

function SendButton({ phase, attempt, label, className = "" }: { phase: Phase; attempt: number; label: string; className?: string }) {
  return (
    <button
      type="submit"
      disabled={phase === "sending" || phase === "sent"}
      aria-busy={phase === "sending"}
      data-phase={phase}
      data-try={attempt % 2 ? "odd" : "even"}
      className={`gbc-send relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-ink px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone shadow-[0_12px_24px_-14px_rgba(37,41,37,0.8)] transition-colors hover:bg-ink-soft disabled:cursor-default disabled:hover:bg-ink ${className}`}
    >
      <span>{phaseText[phase] || label}</span>
      <span aria-hidden className="relative grid h-4 w-4 place-items-center">
        <span key={`${phase}-${attempt}`} className="gbc-send__plane grid place-items-center">
          <Send size={15} strokeWidth={1.9} />
        </span>
        <span className="gbc-send__tick absolute inset-0 grid place-items-center text-sage">
          <Check size={16} strokeWidth={2.4} />
        </span>
      </span>
      <span className="sr-only" role="status">
        {phase === "sending" ? "Sending your job request" : phase === "failed" ? "Your job request was not sent. Please see the message above the form or the highlighted fields." : ""}
      </span>
    </button>
  );
}

/* ---------- Floating-label fields ---------- */

const box = (bad: boolean) =>
  `peer block w-full rounded-xl border bg-white px-4 text-sm text-ink shadow-[0_1px_2px_rgba(22,39,32,0.05)] transition-[border-color,box-shadow] duration-200 placeholder:text-transparent focus:outline-none focus-visible:outline-none focus:ring-4 focus:placeholder:text-muted/50 ${
    bad ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-stone hover:border-forest-700/40 focus:border-forest-700 focus:ring-forest-700/10"
  }`;
// Sits inside the box like a placeholder, then floats up small when the field is focused or filled.
const floatLabel =
  "pointer-events-none absolute left-4 top-[1.05rem] text-sm text-muted transition-all duration-200 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-forest-700 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold";

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
      <CircleAlert size={13} strokeWidth={2} className="shrink-0" aria-hidden /> {error}
    </p>
  );
}

type Base = { id: string; label: string; error?: string; hint?: string };
const a11y = (id: string, error?: string) => ({ "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined });

function FloatInput({ id, label, error, hint, ...rest }: Base & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="relative">
        <input id={id} placeholder={hint ?? " "} className={`${box(Boolean(error))} h-14 pt-5`} {...a11y(id, error)} {...rest} />
        <label htmlFor={id} className={floatLabel}>{label}</label>
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

function FloatTextarea({ id, label, error, hint, after, ...rest }: Base & { after?: React.ReactNode } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <div className="relative">
        <textarea id={id} placeholder={hint ?? " "} className={`${box(Boolean(error))} resize-y pb-3 pt-7`} {...a11y(id, error)} {...rest} />
        <label htmlFor={id} className={floatLabel}>{label}</label>
      </div>
      {error ? <FieldError id={id} error={error} /> : after}
    </div>
  );
}

function FloatSelect({ id, label, error, options, placeholder, defaultValue }: Base & { options: readonly string[]; placeholder: string; defaultValue?: string }) {
  return (
    <div>
      <div className="relative">
        <select id={id} name={id} defaultValue={defaultValue ?? ""} className={`${box(Boolean(error))} h-14 cursor-pointer appearance-none pr-10 pt-5`} {...a11y(id, error)}>
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <label htmlFor={id} className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-muted peer-focus:text-forest-700">{label}</label>
        <ChevronDown size={16} strokeWidth={1.75} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

// "120 / 4000" under the message box, with a nudge until the minimum length is reached.
function MessageCount({ n }: { n: number }) {
  return (
    <p className="mt-1.5 flex justify-between gap-4 px-1 text-[11px] text-muted">
      <span>{n > 0 && n < MESSAGE_MIN ? `${MESSAGE_MIN - n} more characters needed` : ""}</span>
      <span className={n > MESSAGE_MAX ? "text-red-700" : ""}>
        {n} / {MESSAGE_MAX}
      </span>
    </p>
  );
}

function Honeypot({ id }: { id: string }) {
  return (
    <div className="absolute left-[-9999px]" aria-hidden>
      <label htmlFor={id}>Website</label>
      <input id={id} name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

type FormProps = {
  state: EnquiryState;
  action: (fd: FormData) => void;
  phase: Phase;
  attempt: number;
  onSubmitted: (e: FormEvent<HTMLFormElement>) => void;
};

/* ---------- Pop-up form ---------- */

function CompactForm({ state, action, phase, attempt, onSubmitted }: FormProps) {
  const { errors: e, formProps } = useLiveValidation(state.errors);
  // Only rendered inside the pop-up after it opens (never on the server), so reading the draft here is safe.
  const [draft] = useState(readDraft);
  const [restored, setRestored] = useState(() => Object.keys(draft).length > 0);
  const v: Record<string, string | undefined> = state.values ?? draft;
  const [count, setCount] = useState((v.message ?? "").length);

  return (
    <form
      action={action}
      noValidate
      className="space-y-5"
      {...formProps}
      onSubmit={(ev) => {
        formProps.onSubmit(ev);
        onSubmitted(ev);
      }}
      onChange={(ev) => {
        formProps.onChange(ev);
        saveDraft(ev.currentTarget);
      }}
    >
      <input type="hidden" name="quick" value="1" />
      <input type="hidden" name="consent" value="on" />
      {state.message && (
        <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <CircleAlert size={16} strokeWidth={1.9} className="shrink-0" aria-hidden /> {state.message}
        </p>
      )}
      {restored && !state.values && (
        <p className="flex items-center justify-between gap-3 rounded-xl bg-forest-100 px-4 py-2.5 text-xs text-forest-900">
          We kept what you wrote last time.
          <button
            type="button"
            className="font-semibold underline underline-offset-2 hover:no-underline"
            onClick={(ev) => {
              const form = ev.currentTarget.form!;
              for (const el of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([type=hidden]), textarea")) {
                if (el instanceof HTMLInputElement && el.type === "radio") el.checked = false;
                else el.value = "";
              }
              clearDraft();
              setCount(0);
              setRestored(false);
              form.querySelector<HTMLInputElement>("#c-name")?.focus();
            }}
          >
            Start again
          </button>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FloatInput id="c-name" name="name" label="Your name *" autoComplete="name" defaultValue={v.name ?? ""} error={e.name} />
        <FloatInput id="c-email" name="email" type="email" label="Email address *" hint="you@example.com" autoComplete="email" defaultValue={v.email ?? ""} error={e.email} />
      </div>
      <fieldset {...a11y("c-service", e.service)}>
        <legend className="mb-2.5 px-1 text-[11px] font-semibold text-muted">Trade needed *</legend>
        <div className="flex flex-wrap gap-2">
          {enquiryOptions.services.map((o) => (
            <label key={o} className="cursor-pointer">
              <input type="radio" name="service" value={o} defaultChecked={v.service === o} className="peer sr-only" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-stone bg-white px-3.5 py-1.5 text-[12px] text-ink/80 transition-colors hover:border-ink/60 hover:text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest-600">
                {o}
              </span>
            </label>
          ))}
        </div>
        <FieldError id="c-service" error={e.service} />
      </fieldset>
      <FloatTextarea
        id="c-message"
        name="message"
        label="Describe the job *"
        hint="What needs doing, where the job is and when you need it"
        rows={4}
        defaultValue={v.message ?? ""}
        onInput={(ev) => setCount(ev.currentTarget.value.length)}
        error={e.message}
        after={<MessageCount n={count} />}
      />
      <Honeypot id="c-website" />
      <div className="flex flex-col gap-5 border-t border-stone pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[11px] leading-relaxed text-muted">
          By sending this request you agree that GBC may contact you about the job and follow up with you. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-forest-900">privacy policy</Link>.
        </p>
        <SendButton phase={phase} attempt={attempt} label="Post job request" className="min-w-48 shrink-0" />
      </div>
    </form>
  );
}

/* ---------- Contact page form ---------- */

function FullForm({ state, action, phase, attempt, onSubmitted }: FormProps) {
  const { errors: e, formProps } = useLiveValidation(state.errors);
  const [count, setCount] = useState((state.values?.message ?? "").length);
  const v = state.values ?? {};
  const field = (n: string) => ({ id: n, name: n, defaultValue: v[n] ?? "", error: e[n] });

  return (
    <form
      action={action}
      noValidate
      className="space-y-4"
      {...formProps}
      onSubmit={(ev) => {
        formProps.onSubmit(ev);
        onSubmitted(ev);
      }}
    >
      {state.message && (
        <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <CircleAlert size={16} strokeWidth={1.9} className="shrink-0" aria-hidden /> {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FloatInput {...field("name")} label="Full name *" autoComplete="name" />
        <FloatInput {...field("organisation")} label="Organisation (optional)" autoComplete="organization" />
        <FloatInput {...field("email")} type="email" label="Email *" hint="you@example.com" autoComplete="email" />
        <FloatInput {...field("phone")} type="tel" label="Phone / WhatsApp (optional)" hint="+233…" autoComplete="tel" />
        <FloatSelect id="service" label="Trade needed *" options={enquiryOptions.services} defaultValue={v.service} error={e.service} placeholder="Select a service" />
        <FloatSelect id="project_type" label="Job type *" options={enquiryOptions.projectTypes} defaultValue={v.project_type} error={e.project_type} placeholder="Select a type" />
        <FloatInput {...field("location")} label="Job location *" hint="Town / area" />
        <FloatSelect id="timeline" label="When do you need it? (optional)" options={enquiryOptions.timelines} defaultValue={v.timeline} error={e.timeline} placeholder="Select a timeline" />
      </div>

      <FloatSelect id="budget_range" label="Budget / quote preference (optional)" options={enquiryOptions.budgets} defaultValue={v.budget_range} error={e.budget_range} placeholder="Select a range" />

      <FloatTextarea
        {...field("message")}
        label="Describe the job *"
        hint="What needs doing, the location, measurements and any useful details"
        rows={5}
        onInput={(ev) => setCount(ev.currentTarget.value.length)}
        after={<MessageCount n={count} />}
      />

      {/* Honeypot: hidden from people, tempting to bots */}
      <Honeypot id="website" />

      <div className="pt-1">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone bg-white p-4 text-sm text-muted transition-colors hover:border-forest-700/40 has-[:checked]:border-forest-700/50 has-[:checked]:bg-forest-100/50">
          <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 shrink-0 accent-forest-800" {...a11y("consent", e.consent)} />
          <span>
            I agree that GBC may contact me about this job request and store my details for that purpose, as described in the{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-forest-900">privacy policy</Link>. *
          </span>
        </label>
        <FieldError id="consent" error={e.consent} />
      </div>

      <SendButton phase={phase} attempt={attempt} label="Submit job request" className="w-full" />
    </form>
  );
}

/* ---------- Wrapper: sending state, success ---------- */

export function EnquiryForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [state, action, pending] = useActionState(send, initial);
  const [attempt, setAttempt] = useState(0); // every press of Send
  const [blocked, setBlocked] = useState(false); // last press stopped by the in-browser checks
  const [landed, setLanded] = useState(false); // the plane has flown off; show the thank-you panel

  useEffect(() => {
    if (!state.ok) return;
    clearDraft();
    toast(`Job request received. Your reference is ${state.reference}.`);
    const t = window.setTimeout(() => setLanded(true), 1300);
    return () => window.clearTimeout(t);
  }, [state.ok, state.reference]);

  // Tell the visitor about a failed send even if the message at the top of the form is scrolled out of view.
  useEffect(() => {
    if (!state.ok && state.message) toast("Your job request was not sent. " + (state.errors ? "Please check the highlighted fields." : "Please try again."), "error");
  }, [state]);

  const phase: Phase = pending ? "sending" : state.ok ? "sent" : attempt > 0 && (blocked || state !== initial) ? "failed" : "idle";
  const onSubmitted = (e: FormEvent<HTMLFormElement>) => {
    setAttempt((a) => a + 1);
    setBlocked(e.defaultPrevented);
  };

  if (state.ok && landed) {
    return (
      <div role="status" className={`gbc-landed ${variant === "compact" ? "py-6 text-center" : "rounded-2xl border border-forest-700/20 bg-forest-100 p-8"}`}>
        <span aria-hidden className={`grid h-12 w-12 place-items-center rounded-full bg-forest-900 text-sage ${variant === "compact" ? "mx-auto" : ""}`}>
          <Check size={22} strokeWidth={2.2} />
        </span>
        <p className="mt-5 font-serif text-xl font-semibold text-forest-900">Thank you. Your job request has been received.</p>
        <p className="mt-2 text-sm text-ink/75">
          Your reference is <strong className="text-forest-900">{state.reference}</strong>. The GBC team will review the details and contact you
          {variant === "full" ? ". If you provided an email address, an acknowledgement is on its way." : "."}
        </p>
      </div>
    );
  }

  const props = { state, action, phase, attempt, onSubmitted };
  return variant === "compact" ? <CompactForm {...props} /> : <FullForm {...props} />;
}
