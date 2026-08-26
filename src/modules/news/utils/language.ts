/**
 * Pure language and script detection utilities for news articles.
 * Decoupled from database and server APIs to ensure 100% safe imports across client and server components.
 */

export function detectArticleLanguage(text?: string | null): "hi" | "en" {
  if (!text) return "en";
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  return devanagariCount > 5 ? "hi" : "en";
}
