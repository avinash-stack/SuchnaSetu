import crypto from "crypto";

export function generateNewsSlug(title: string, dateStr?: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const hash = crypto
    .createHash("md5")
    .update(title + (dateStr || ""))
    .digest("hex")
    .slice(0, 6);

  return `${base}-${hash}`;
}

export function computeContentHash(title: string, contentOrSummary: string): string {
  const clean = (title + contentOrSummary)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\w]/g, "");
  return crypto.createHash("sha256").update(clean).digest("hex");
}
