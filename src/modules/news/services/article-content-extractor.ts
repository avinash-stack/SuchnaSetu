/**
 * Robust article content extraction service.
 * Fetches original news article pages and extracts authentic readable article paragraphs.
 */
export class ArticleContentExtractor {
  /**
   * Fetches the web page at targetUrl and extracts authentic readable article body paragraphs.
   */
  static async extractFullContent(targetUrl: string): Promise<string | null> {
    if (!targetUrl || !targetUrl.startsWith("http")) return null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SuchnaSetu-Reader/1.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
          "Cache-Control": "no-cache",
        },
        signal: controller.signal,
        redirect: "follow",
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
   * Parses HTML and extracts clean, authentic readable article paragraphs.
   */
  static parseArticleTextFromHtml(html: string): string | null {
    if (!html || html.length < 250) return null;

    // 1. Strip non-content, navigation, and layout blocks
    const clean = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    // 2. Extract all paragraph tags from the clean HTML
    const pMatches = [...clean.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];

    const boilerplateKeywords = [
      "subscribe to our",
      "subscription",
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
      "unlock these with",
      "express photo by",
      "whatsapp channel",
      "epaper",
      "today’s paper",
      "todays paper",
      "premium stories",
      "the view from india",
      "newsletter",
    ];

    const paragraphs: string[] = [];

    for (const match of pMatches) {
      const rawText = match[1]
        .replace(/<[^>]*>/g, "") // strip inner tags
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&#8217;/gi, "'")
        .replace(/&#8216;/gi, "'")
        .replace(/&#8220;/gi, '"')
        .replace(/&#8221;/gi, '"')
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();

      if (rawText.length < 45) continue;

      const lower = rawText.toLowerCase();
      const isBoilerplate = boilerplateKeywords.some((kw) => lower.includes(kw));
      if (!isBoilerplate) {
        paragraphs.push(rawText);
      }
    }

    if (paragraphs.length >= 2) {
      return paragraphs.slice(0, 15).join("\n\n");
    }

    return null;
  }
}
