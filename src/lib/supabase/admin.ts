import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * Creates an admin/service-role Supabase client.
 * WARNING: NEVER expose SUPABASE_SERVICE_ROLE_KEY to client-side bundles.
 * This client bypasses Row Level Security for administrative tasks.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-token";

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
