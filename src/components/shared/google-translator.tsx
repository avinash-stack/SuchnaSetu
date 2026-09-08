"use client";

/**
 * Legacy GoogleTranslator component:
 * Client-side DOM-mutation widget (element.js) has been decommissioned
 * in favor of server-side / API-backed Google Translate JSON rendering.
 *
 * This clean no-op stub ensures zero third-party script injections,
 * zero iframe DOM conflicts, and 100% React virtual DOM stability.
 */
export function GoogleTranslator() {
  return null;
}

export function applyGoogleLanguage(_lang: "en" | "hi") {
  // No-op: DOM mutation is disabled in favor of structured data translation
}
