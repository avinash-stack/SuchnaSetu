/**
 * AI Provider & Module Configuration
 * Single source of truth for Groq and GPT-OSS-120B AI capabilities.
 * Designed with zero-hard-dependency architecture: completely disabled/graceful if env vars are absent.
 */

export interface AiConfig {
  provider: "groq";
  apiKey: string | null;
  model: string;
  endpoint: string;
  isEnabled: boolean;
  timeoutMs: number;
  /** @deprecated Kept for backward compatibility with existing callers */
  searchModel: string;
}

export interface AiConfigValidation {
  isValid: boolean;
  provider: string;
  model: string;
  hasKey: boolean;
  keyMasked: string;
  errors: string[];
  warnings: string[];
}

export function getAiConfig(): AiConfig {
  const apiKey = process.env.GROQ_API_KEY || null;
  const isExplicitlyEnabled = process.env.AI_SEARCH_ENABLED === "true";
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const endpoint =
    process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const timeoutMs = parseInt(process.env.GROQ_TIMEOUT_MS || "10000", 10);

  return {
    provider: "groq",
    apiKey,
    model,
    endpoint,
    // AI capabilities are active if GROQ_API_KEY exists AND AI_SEARCH_ENABLED is "true"
    isEnabled: Boolean(apiKey && isExplicitlyEnabled),
    timeoutMs: isNaN(timeoutMs) ? 10000 : timeoutMs,
    searchModel: model,
  };
}

export function validateAiConfig(): AiConfigValidation {
  const config = getAiConfig();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Key validation
  if (!config.apiKey) {
    errors.push(
      "GROQ_API_KEY is not configured. Add GROQ_API_KEY to your environment variables (.env.local, Vercel)."
    );
  } else if (!config.apiKey.startsWith("gsk_") && config.apiKey.length < 20) {
    warnings.push(
      "GROQ_API_KEY does not start with standard 'gsk_' prefix. Please verify your Groq API key."
    );
  }

  // Model validation
  if (!config.model) {
    errors.push("GROQ_MODEL is empty. Expected: openai/gpt-oss-120b");
  } else if (config.model !== "openai/gpt-oss-120b") {
    warnings.push(
      `GROQ_MODEL is set to '${config.model}'. Expected primary model is 'openai/gpt-oss-120b'.`
    );
  }

  // Check for obsolete OpenRouter variables
  if (process.env.OPENROUTER_API_KEY) {
    warnings.push(
      "Found obsolete OPENROUTER_API_KEY in environment. SuchnaSetu uses Groq for GPT-OSS-120B. You may remove OPENROUTER_API_KEY."
    );
  }
  if (process.env.OPENROUTER_SEARCH_MODEL || process.env.NEWS_AI_MODEL) {
    warnings.push(
      "Found obsolete OPENROUTER_SEARCH_MODEL or NEWS_AI_MODEL. Replaced by GROQ_MODEL."
    );
  }

  const keyMasked = config.apiKey
    ? `${config.apiKey.slice(0, 7)}...${config.apiKey.slice(-4)} (len=${config.apiKey.length})`
    : "NOT_SET";

  return {
    isValid: errors.length === 0,
    provider: "groq",
    model: config.model,
    hasKey: Boolean(config.apiKey),
    keyMasked,
    errors,
    warnings,
  };
}

export function assertAiConfig(): AiConfig {
  const validation = validateAiConfig();
  if (!validation.isValid) {
    throw new Error(
      `[AI Configuration Error] Provider: Groq | Missing configuration:\n${validation.errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }
  return getAiConfig();
}
