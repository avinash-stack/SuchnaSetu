import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

let cachedBrowserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;
let cachedUrl: string | null = null;
let cachedAnonKey: string | null = null;

/**
 * Creates or retrieves a browser-compatible Supabase client instance.
 * Accepts optional customUrl and customAnonKey to support dynamic runtime injection
 * in environments like Cloudflare Workers where build-time inlining may be absent.
 */
export function createClient(customUrl?: string, customAnonKey?: string) {
  const supabaseUrl =
    customUrl ||
    cachedUrl ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://placeholder-project.supabase.co";

  const supabaseAnonKey =
    customAnonKey ||
    cachedAnonKey ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-token";

  if (cachedBrowserClient && cachedUrl === supabaseUrl && cachedAnonKey === supabaseAnonKey) {
    return cachedBrowserClient;
  }

  cachedUrl = supabaseUrl;
  cachedAnonKey = supabaseAnonKey;
  cachedBrowserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

  return cachedBrowserClient;
}

/**
 * Sets the browser client configuration dynamically at runtime.
 */
export function setBrowserClientConfig(supabaseUrl: string, supabaseAnonKey: string) {
  if (supabaseUrl && supabaseAnonKey) {
    cachedUrl = supabaseUrl;
    cachedAnonKey = supabaseAnonKey;
    cachedBrowserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
}
