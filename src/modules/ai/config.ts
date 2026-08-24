/**
 * AI Module Configuration
 * Single source of truth for OpenRouter and AI-assisted capabilities.
 * Designed with zero-hard-dependency architecture: completely disabled/replaceable if env vars are absent.
 */

export interface AiConfig {
  apiKey: string | null;
  isEnabled: boolean;
  searchModel: string;
  timeoutMs: number;
}

export function getAiConfig(): AiConfig {
  const apiKey = process.env.OPENROUTER_API_KEY || null;
  const isExplicitlyEnabled = process.env.AI_SEARCH_ENABLED === "true";
  const searchModel =
    process.env.OPENROUTER_SEARCH_MODEL || "google/gemini-2.5-flash";
  const timeoutMs = parseInt(process.env.OPENROUTER_TIMEOUT_MS || "3500", 10);

  return {
    apiKey,
    // AI search is only active if an API key exists AND it is explicitly enabled (or key exists and not explicitly set to false)
    isEnabled: Boolean(apiKey && isExplicitlyEnabled),
    searchModel,
    timeoutMs: isNaN(timeoutMs) ? 3500 : timeoutMs,
  };
}
