import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { VerifiedTradesperson } from "@/lib/content";

/** Only the narrow, verified and published profile fields are exposed by the database RPC. */
export async function getVerifiedTradespeople(): Promise<VerifiedTradesperson[]> {
  const db = createPublicClient();
  if (!db) return [];
  const { data, error } = await db.rpc("get_verified_tradespeople");
  if (error || !data) return [];
  return data as VerifiedTradesperson[];
}
