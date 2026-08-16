import { createHash } from "crypto";

/**
 * Deterministic JSON stringifier that sorts object keys alphabetically.
 * Ensures consistent cryptographic hashes regardless of key order.
 */
export function canonicalizeJson(obj: any): string {
  if (obj === null || obj === undefined) return "null";
  if (typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return "[" + obj.map((item) => canonicalizeJson(item)).join(",") + "]";
  }

  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map((key) => {
    const val = canonicalizeJson(obj[key]);
    return `"${key}":${val}`;
  });

  return "{" + pairs.join(",") + "}";
}

/**
 * Generates a standard SHA-256 hex digest for arbitrary data.
 */
export function hashData(data: any): string {
  const canonicalString = typeof data === "string" ? data.trim() : canonicalizeJson(data);
  return createHash("sha256").update(canonicalString, "utf8").digest("hex");
}
