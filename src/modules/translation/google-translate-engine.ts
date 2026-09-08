/**
 * Production-grade Google Translate Engine for SuchnaSetu.
 * Features:
 * - Direct HTTP POST to translate.googleapis.com (no URL length limits)
 * - Strict token preservation (URLs, email addresses, notification numbers, recruitment acronyms)
 * - Safe paragraph-aware chunking for long articles
 * - In-flight promise deduplication (prevents duplicate concurrent requests)
 * - In-memory LRU cache for sub-millisecond repeated lookups
 * - Automatic timeout + exponential backoff retry for transient failures
 * - Complete non-destructive fallback (always returns original English text on failure)
 */

interface CacheEntry {
  value: string;
  timestamp: number;
}

const MEMORY_CACHE_LIMIT = 2000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const memoryCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<string>>();

/**
 * Simple fast hash function for cache keys
 */
function fastHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36) + "_" + str.length;
}

/**
 * Pre-processes text by replacing protected tokens with non-translatable placeholders:
 * {{SS_TOKEN_0}}, {{SS_TOKEN_1}}, etc.
 */
function protectTokens(text: string): { protectedText: string; tokenMap: Map<string, string> } {
  const tokenMap = new Map<string, string>();
  let tokenCounter = 0;

  // 1. Protect URLs (e.g. https://suchnasetu.in/jobs/rrb-alp)
  const urlRegex = /(https?:\/\/[^\s\)\"\'>]+)/gi;
  let processed = text.replace(urlRegex, (match) => {
    const placeholder = `{{SS_TOKEN_${tokenCounter++}}}`;
    tokenMap.set(placeholder, match);
    return placeholder;
  });

  // 2. Protect email addresses
  const emailRegex = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gi;
  processed = processed.replace(emailRegex, (match) => {
    const placeholder = `{{SS_TOKEN_${tokenCounter++}}}`;
    tokenMap.set(placeholder, match);
    return placeholder;
  });

  // 3. Protect Notification / Advt IDs (e.g. CEN 01/2026, Advt No. 04/2026, Advt-02/2026)
  const noticeRegex = /\b(CEN\s*\d+\/\d+|Advt\.?\s*No\.?\s*[\w\/-]+|EN\s*\d+\/\d+)\b/gi;
  processed = processed.replace(noticeRegex, (match) => {
    const placeholder = `{{SS_TOKEN_${tokenCounter++}}}`;
    tokenMap.set(placeholder, match);
    return placeholder;
  });

  return { protectedText: processed, tokenMap };
}

/**
 * Restores protected tokens from {{SS_TOKEN_n}} back to their original values.
 * Handles potential whitespace variations inserted by translation engines (e.g. {{ SS_TOKEN_0 }}).
 */
function restoreTokens(text: string, tokenMap: Map<string, string>): string {
  if (!text || tokenMap.size === 0) return text;

  let restored = text;
  for (const [placeholder, original] of tokenMap.entries()) {
    // Exact match
    restored = restored.replaceAll(placeholder, original);
    
    // Looser match in case Google Translate adds internal spaces like {{ SS_TOKEN_0 }}
    const tokenIndex = placeholder.replace(/[{}\s]/g, "");
    const looseRegex = new RegExp(`\\{\\{\\s*${tokenIndex}\\s*\\}\\}`, "g");
    restored = restored.replace(looseRegex, original);
  }

  return restored;
}

/**
 * Translates a single text segment using Google Translate API with retry and backoff
 */
async function translateSegmentWithRetry(
  text: string,
  targetLang: "hi" | "en",
  sourceLang: "en" | "hi" | "auto" = "en",
  maxRetries = 3
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Protect sensitive tokens (URLs, notification IDs, emails)
  const { protectedText, tokenMap } = protectTokens(trimmed);

  const endpoint = "https://translate.googleapis.com/translate_a/single";
  const params = new URLSearchParams();
  params.append("client", "gtx");
  params.append("sl", sourceLang);
  params.append("tl", targetLang);
  params.append("dt", "t");
  params.append("q", protectedText);

  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5s timeout

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
        },
        body: params.toString(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const rawTranslated = data[0]
            .map((item: any) => (item && item[0] ? item[0] : ""))
            .join("");
          if (rawTranslated) {
            return restoreTokens(rawTranslated, tokenMap);
          }
        }
      } else if (res.status === 429) {
        // Rate limit: back off exponentially
        const retryAfter = res.headers.get("retry-after");
        const backoffMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : attempt * 1200;
        console.warn(`[Google Translate Engine HTTP 429] Rate limit hit. Backing off ${backoffMs}ms (attempt ${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      } else {
        lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err;
    }

    if (attempt < maxRetries) {
      const delayMs = attempt * 600;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  console.warn(`[Google Translate Engine Warning] Translation segment failed after ${maxRetries} attempts: ${lastError?.message}. Falling back to original.`);
  return text; // Graceful fallback
}

/**
 * Translates arbitrary text into target language (Hindi or English).
 * Supports automatic paragraph chunking, token preservation, in-flight deduplication, and memory caching.
 */
export async function translateTextWithGoogle(
  text: string,
  targetLang: "hi" | "en" = "hi",
  sourceLang: "en" | "hi" | "auto" = "en"
): Promise<string> {
  if (!text || text.trim().length === 0) return text;
  if (targetLang === "en" && sourceLang === "en") return text; // Canonical base is already English

  const cacheKey = `${sourceLang}:${targetLang}:${fastHash(text)}`;

  // 1. Check in-memory cache
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.value;
  }

  // 2. Check in-flight deduplication
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  // 3. Initiate translation execution
  const translationPromise = (async () => {
    try {
      // Chunk text safely if it exceeds 2,500 characters
      const MAX_CHUNK_LENGTH = 2500;
      if (text.length <= MAX_CHUNK_LENGTH) {
        const translated = await translateSegmentWithRetry(text, targetLang, sourceLang);
        saveToCache(cacheKey, translated);
        return translated;
      }

      // Long article / content chunking: split by paragraphs (\n\n)
      const paragraphs = text.split(/\n\s*\n/);
      const translatedParagraphs: string[] = [];
      let currentChunk = "";

      for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i].trim();
        if (!para) continue;

        if (currentChunk.length + para.length + 2 > MAX_CHUNK_LENGTH) {
          if (currentChunk) {
            const translatedChunk = await translateSegmentWithRetry(currentChunk, targetLang, sourceLang);
            translatedParagraphs.push(translatedChunk);
            currentChunk = "";
          }
        }

        if (currentChunk.length > 0) {
          currentChunk += "\n\n" + para;
        } else {
          currentChunk = para;
        }
      }

      if (currentChunk) {
        const translatedChunk = await translateSegmentWithRetry(currentChunk, targetLang, sourceLang);
        translatedParagraphs.push(translatedChunk);
      }

      const finalTranslated = translatedParagraphs.join("\n\n");
      saveToCache(cacheKey, finalTranslated);
      return finalTranslated;
    } catch (err: any) {
      console.warn(`[Google Translate Engine Error]: ${err.message}. Retaining original English.`);
      return text; // Fail-safe
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, translationPromise);
  return translationPromise;
}

/**
 * Saves item to LRU-style memory cache
 */
function saveToCache(key: string, value: string) {
  if (memoryCache.size >= MEMORY_CACHE_LIMIT) {
    // Delete oldest 100 entries
    let count = 0;
    for (const k of memoryCache.keys()) {
      memoryCache.delete(k);
      if (++count > 100) break;
    }
  }
  memoryCache.set(key, { value, timestamp: Date.now() });
}

/**
 * Clears in-memory translation cache (useful for testing or cache resets)
 */
export function clearTranslationCache(): void {
  memoryCache.clear();
  inFlightRequests.clear();
}

/**
 * Inspects cache statistics
 */
export function getTranslationCacheStats(): { size: number; inFlight: number } {
  return {
    size: memoryCache.size,
    inFlight: inFlightRequests.size,
  };
}
