import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client. Server-only: bypasses RLS, so never import from client code
// and only use it for the public enquiry insert and visitor project ratings.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
