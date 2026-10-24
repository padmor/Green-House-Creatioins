import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient, isSupabaseConfigured } from "./supabase/server";

export type Role = "admin" | "manager" | "staff" | "editor";
export type Staff = { id: string; email: string; full_name: string; role: Role };

// Capability matrix. Mirrors the RLS policies in supabase/schema.sql; the database is the
// real enforcement point, this keeps the UI and server actions honest and gives clear errors.
export const can = {
  viewAllEnquiries: (r: Role) => r === "admin" || r === "manager",
  workEnquiries: (r: Role) => r === "admin" || r === "manager" || r === "staff",
  assign: (r: Role) => r === "admin" || r === "manager",
  managePortfolio: (r: Role) => r === "admin" || r === "manager" || r === "editor",
  editContent: (r: Role) => r === "admin" || r === "manager" || r === "editor",
  manageTeam: (r: Role) => r === "admin",
};

// Verified against Supabase Auth on every call (getUser validates the JWT with the server).
export const getStaff = cache(async (): Promise<Staff | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,active")
    .eq("id", auth.user.id)
    .single();
  if (!profile || !profile.active) return null;
  return { id: profile.id, email: profile.email, full_name: profile.full_name, role: profile.role };
});

export async function requireStaff(check?: (r: Role) => boolean): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect("/login");
  if (check && !check(staff.role)) redirect("/dashboard?denied=1");
  return staff;
}
