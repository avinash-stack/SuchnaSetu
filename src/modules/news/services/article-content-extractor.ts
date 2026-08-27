import { sanitizeHtml } from "../utils/content-sanitizer";

/**
 * Robust article content extraction service.
 * Fetches original news article pages and extracts readable article paragraphs.
 */
export class ArticleContentExtractor {
  /**
   * Fetches the web page at targetUrl and extracts readable article body paragraphs.
   */
  static async extractFullContent(targetUrl: string): Promise<string | null> {
    if (!targetUrl || !targetUrl.startsWith("http")) return null;

    try {
      const resolvedUrl = await this.resolveDestinationUrl(targetUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(resolvedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SuchnaSetu-Reader/1.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return null;

      const html = await res.text();
      return this.parseArticleTextFromHtml(html);
    } catch {
      return null;
    }
  }

  /**
   * Resolves Google News aggregator URLs or redirect links to canonical publisher URLs.
   */
  private static async resolveDestinationUrl(url: string): Promise<string> {
    if (!url.includes("news.google.com")) {
      return url;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.url && !res.url.includes("news.google.com")) {
        return res.url;
      }
      return url;
    } catch {
      return url;
    }
  }

  /**
   * Parses HTML and extracts clean readable article paragraphs.
   */
  static parseArticleTextFromHtml(html: string): string | null {
    if (!html || html.length < 200) return null;

    // 1. Remove non-content blocks
    let clean = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    // 2. Locate main article container if present
    const articleContainerRegex = /<(?:article|main|div[^>]*class=["'][^"']*(?:article|story|post-content|entry-content|news-detail|content-area)[^"']*["'])[^>]*>([\s\S]*?)<\/(?:article|main|div)>/i;
    const containerMatch = clean.match(articleContainerRegex);
    const searchHtml = containerMatch ? containerMatch[1] : clean;

    // 3. Extract all paragraph tags
    const pMatches = [...searchHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const boilerplateKeywords = [
      "subscribe to our newsletter",
      "download our app",
      "follow us on",
      "all rights reserved",
      "terms of service",
      "privacy policy",
      "click here to read",
      "advertisement",
      "also read",
      "read more:",
      "sign in to continue",
      "copyright ©",
    ];

    const paragraphs: string[] = [];

    for (const match of pMatches) {
      const rawText = match[1]
        .replace(/<[^>]*>/g, "") // strip inner tags
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();

      if (rawText.length < 40) continue;

      const lower = rawText.toLowerCase();
      const isBoilerplate = boilerplateKeywords.some((kw) => lower.includes(kw));
      if (!isBoilerplate) {
        paragraphs.push(rawText);
      }
    }

    if (paragraphs.length >= 2) {
      return paragraphs.join("\n\n");
    }

    // Fallback: If <p> matching didn't yield enough, try extracting text chunks
    if (searchHtml) {
      const rawBody = searchHtml
        .replace(/<[^>]*>/g, "\n")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length >= 60 && !boilerplateKeywords.some((kw) => s.toLowerCase().includes(kw)));

      if (rawBody.length >= 2) {
        return rawBody.join("\n\n");
      }
    }

    return null;
  }
}
