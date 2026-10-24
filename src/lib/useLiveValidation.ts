"use client";

import { useState, type FormEvent, type SyntheticEvent } from "react";
import type { z } from "zod";
import { enquirySchema } from "./validation";

// Checks enquiry fields in the browser with the same rules the server uses (lib/validation.ts):
// a field is checked when the visitor leaves it, re-checked as they type once it shows an error,
// and the whole form is checked before sending so mistakes show instantly. The server still validates.
const rules = enquirySchema.shape as unknown as Record<string, z.ZodType>;
const skip = new Set(["quick", "website"]);

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function check(name: string, value: string) {
  const r = rules[name]?.safeParse(value);
  return r && !r.success ? r.error.issues[0]?.message : undefined;
}

function valueOf(form: HTMLFormElement, name: string) {
  const el = form.elements.namedItem(name);
  if (!el) return "";
  if (el instanceof RadioNodeList) return el.value;
  if (el instanceof HTMLInputElement && el.type === "checkbox") return el.checked ? "on" : "";
  return (el as Control).value;
}

export function useLiveValidation(server: Record<string, string> | undefined) {
  // undefined = checked and fine (hides any server error for that field)
  const [client, setClient] = useState<Record<string, string | undefined>>({});
  const errors: Record<string, string> = {};
  for (const [k, v] of Object.entries({ ...server, ...client })) if (v) errors[k] = v;

  const fieldOf = (e: SyntheticEvent) => {
    const t = e.target as Control;
    return t.name && !skip.has(t.name) && t.form ? { name: t.name, form: t.form } : null;
  };

  const formProps = {
    onBlur: (e: React.FocusEvent) => {
      const f = fieldOf(e);
      // radios/checkboxes are checked on change instead, so tabbing past an untouched group isn't flagged
      if (!f || (e.target as HTMLInputElement).type === "radio") return;
      setClient((c) => ({ ...c, [f.name]: check(f.name, valueOf(f.form, f.name)) }));
    },
    onChange: (e: React.ChangeEvent) => {
      const f = fieldOf(e);
      if (!f) return;
      const t = e.target as HTMLInputElement;
      if (t.type === "radio" || t.type === "checkbox" || errors[f.name]) {
        setClient((c) => ({ ...c, [f.name]: check(f.name, valueOf(f.form, f.name)) }));
      }
    },
    onSubmit: (e: FormEvent<HTMLFormElement>) => {
      const form = e.currentTarget;
      const names = [...new Set([...form.elements].map((el) => (el as Control).name).filter((n) => n && !skip.has(n)))];
      const found: Record<string, string | undefined> = {};
      for (const n of names) found[n] = check(n, valueOf(form, n));
      setClient(found);
      const first = names.find((n) => found[n]);
      if (!first) return;
      e.preventDefault();
      const el = form.elements.namedItem(first);
      (el instanceof RadioNodeList ? (el[0] as HTMLElement) : (el as HTMLElement | null))?.focus();
    },
  };

  return { errors, formProps };
}
