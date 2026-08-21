import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge multiple className values with tailwind-merge support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format ISO date string into readable Indian standard format (e.g. 15 Aug 2026)
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format currency amount into INR format (e.g. ₹56,100)
 */
export function formatINR(amount?: number | null): string {
  if (amount === undefined || amount === null) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format vacancy numbers with commas (e.g. 14,250)
 */
export function formatNumber(num?: number | null): string {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Convert string into URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Determines whether a URL points to an authentic PDF document
 * rather than an HTML webpage, portal landing page, or root homepage.
 */
export function isPdfUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;

  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname.toLowerCase();

    // Direct .pdf file paths
    if (pathname.endsWith(".pdf") || pathname.includes(".pdf/")) return true;

    // Query parameter containing .pdf or pdf format
    const search = parsed.search.toLowerCase();
    if (search.includes(".pdf") || search.includes("format=pdf") || search.includes("type=pdf") || search.includes("download=pdf")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Format raw application fee string or JSON object into clean, human-readable lines
 * e.g. { sc: 0, st: 0, ews: 100, obc: 100, female: 0, general: 100 }
 * -> • GENERAL / OBC / EWS: ₹100
 *    • SC / ST / FEMALE: Nil (Exempted)
 */
export function formatApplicationFee(feeData?: any): string | null {
  if (!feeData) return null;

  let parsed = feeData;
  if (typeof feeData === "string") {
    const trimmed = feeData.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    } else {
      return trimmed;
    }
  }

  if (typeof parsed === "object" && parsed !== null) {
    const entries = Object.entries(parsed);
    if (entries.length === 0) return null;

    // Group categories with identical fee amounts
    const amountToCats: Record<string, string[]> = {};
    for (const [cat, amt] of entries) {
      const catUpper = cat.toUpperCase();
      const amtStr =
        amt === 0 || amt === "0" || amt === "nil" || amt === "exempted" || amt === null
          ? "Nil (Exempted)"
          : typeof amt === "number"
            ? `₹${amt}`
            : String(amt).startsWith("₹")
              ? String(amt)
              : `₹${amt}`;

      if (!amountToCats[amtStr]) amountToCats[amtStr] = [];
      amountToCats[amtStr].push(catUpper);
    }

    return Object.entries(amountToCats)
      .map(([amt, cats]) => `• ${cats.join(" / ")}: ${amt}`)
      .join("\n");
  }

  return String(feeData);
}
