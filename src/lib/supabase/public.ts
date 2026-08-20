import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

let publicClientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Creates or returns a singleton Supabase client for public read-only operations.
 * Unlike `createClient()` in `server.ts`, this does NOT call `cookies()`.
 * This allows Next.js 15 to cache queries and enables instant prefetching.
 */
export function getPublicSupabaseClient() {
  if (publicClientInstance) {
    return publicClientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-token";

  publicClientInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return publicClientInstance;
}

export const createPublicClient = getPublicSupabaseClient;
