import { cookies } from "next/headers";
import { LanguageCode, LANGUAGE_COOKIE_NAME } from "./config";

/**
 * Resolves requested language for server components.
 * Priority:
 * 1. Explicit URL search parameter (?lang=hi / ?lang=en)
 * 2. User preference cookie (suchnasetu_lang=hi / suchnasetu_lang=en)
 * 3. Default fallback ("en")
 */
export async function getRequestedLanguage(searchParams?: { lang?: string } | Record<string, string | string[] | undefined>): Promise<LanguageCode> {
  // 1. Explicit search param has highest precedence
  if (searchParams) {
    const langParam = typeof searchParams.lang === "string" ? searchParams.lang : undefined;
    if (langParam === "hi") return "hi";
    if (langParam === "en") return "en";
  }

  // 2. Cookie fallback for persistent language preference across all routes
  try {
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
    if (cookieLang === "hi") return "hi";
    if (cookieLang === "en") return "en";
  } catch {
    // cookies() unavailable in non-request contexts
  }

  return "en";
}
