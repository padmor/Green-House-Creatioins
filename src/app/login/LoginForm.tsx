"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { BusyLabel } from "@/components/BusyLabel";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      {state.error && <p role="alert" className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      <button className="btn btn-primary w-full" disabled={pending}><BusyLabel pending={pending} busy="Signing in…">Sign in</BusyLabel></button>
    </form>
  );
}
