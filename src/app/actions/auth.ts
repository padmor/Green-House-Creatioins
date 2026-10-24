"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const loginSchema = z.object({ email: z.email(), password: z.string().min(1).max(200) });

export async function login(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Authentication is not configured yet." };
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Generic message: do not reveal whether the account exists.
  if (error) return { error: "Incorrect email or password." };
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
