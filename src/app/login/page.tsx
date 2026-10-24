import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { getStaff } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false } };

export default async function LoginPage() {
  if (await getStaff()) redirect("/dashboard");
  return (
    <main className="grid min-h-dvh place-items-center bg-forest-900 px-5">
      <div className="w-full max-w-sm bg-bone p-8">
        <p className="eyebrow">GBC staff</p>
        <h1 className="mt-2 text-3xl text-forest-900">Sign in</h1>
        {!isSupabaseConfigured() && (
          <p className="mt-4 border border-brass/50 bg-sand px-3 py-2 text-sm">
            Supabase is not configured. Copy <code>.env.example</code> to <code>.env.local</code> and fill it in.
          </p>
        )}
        <LoginForm />
        <Link href="/" className="mt-6 block text-center text-sm text-muted hover:text-forest-900">← Back to website</Link>
      </div>
    </main>
  );
}
