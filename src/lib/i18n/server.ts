import { LanguageCode } from "./config";

/**
 * Resolves requested language for public server components.
 * Priority:
 * 1. Explicit URL search parameter (?lang=hi / ?lang=en)
 * 2. Default fallback ("en")
 *
 * NOTE: We deliberately do NOT call await cookies() here.
 * Calling cookies() in Next.js Server Components opts the route into
 * dynamic server rendering (ƒ Dynamic) on every request, completely breaking
 * Incremental Static Regeneration (ISR) and Edge Caching.
 * User language preference is maintained client-side in LanguageProvider
 * via localStorage and document.cookie.
 */
export async function getRequestedLanguage(
  searchParams?: { lang?: string } | Record<string, string | string[] | undefined>
): Promise<LanguageCode> {
  // 1. Explicit search param has highest precedence
  if (searchParams) {
    const langParam = typeof searchParams.lang === "string" ? searchParams.lang : undefined;
    if (langParam === "hi") return "hi";
    if (langParam === "en") return "en";
  }

  // 2. Default fallback is English (no request-time cookies)
  return "en";
}

