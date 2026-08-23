import { TinyFishConfig } from "./types";

if (typeof window !== "undefined") {
  throw new Error("TinyFish service must only be executed in a server environment.");
}

/**
 * Resolves runtime configuration for the optional TinyFish service.
 * Server-only: API keys and sensitive configuration are never exposed to client bundles.
 */
export function getTinyFishConfig(): TinyFishConfig {
  const isEnabled = process.env.TINYFISH_ENABLED === "true";
  const apiKey = process.env.TINYFISH_API_KEY?.trim() || null;
  const baseUrl = process.env.TINYFISH_BASE_URL?.trim() || "https://agent.tinyfish.ai";
  const timeoutMs = parseInt(process.env.TINYFISH_TIMEOUT_MS || "8000", 10);

  return {
    isEnabled,
    apiKey,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    timeoutMs: Number.isNaN(timeoutMs) ? 8000 : timeoutMs,
  };
}

/**
 * Safe helper to check if TinyFish integration is enabled.
 */
export function isTinyFishEnabled(): boolean {
  return process.env.TINYFISH_ENABLED === "true";
}
