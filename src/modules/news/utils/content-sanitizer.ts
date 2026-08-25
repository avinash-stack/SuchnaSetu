export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateSummary(text: string, maxLength = 260): string {
  if (!text) return "";
  const cleaned = sanitizeHtml(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

export function extractImageUrl(item: any): string | null {
  if (item.image_url) return item.image_url;
  if (item.enclosure?.url && item.enclosure?.type?.startsWith("image/")) {
    return item.enclosure.url;
  }
  if (item.mediaThumbnail?.url) return item.mediaThumbnail.url;

  // Attempt regex extract from raw HTML content
  const html = item.content || item["content:encoded"] || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1] && (match[1].startsWith("http://") || match[1].startsWith("https://"))) {
    return match[1];
  }

  return null;
}
