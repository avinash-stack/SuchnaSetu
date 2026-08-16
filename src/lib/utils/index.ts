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
