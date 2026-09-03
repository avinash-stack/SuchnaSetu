/**
 * Robust article content extraction service.
 * Fetches original news article pages and extracts authentic readable article paragraphs.
 */
export const KNOWN_BOILERPLATE_PATTERNS: RegExp[] = [
  /subscribed with another email/i,
  /logout and login/i,
  /sign in to continue/i,
  /log in to your account/i,
  /manage your subscription/i,
  /active subscription/i,
  /unlock these with/i,
  /subscriber benefits/i,
  /already a subscriber/i,
  /subscribe to read/i,
  /subscribe now/i,
  /premium stories/i,
  /editorials, opinions and more/i,
  /keep your reading experience uninterrupted/i,
  /get unlimited access/i,
  /become a member/i,
  /comments have to be in english/i,
  /new commenting platform/i,
  /post a comment/i,
  /leave a comment/i,
  /leave a reply/i,
  /all rights reserved/i,
  /copyright ©/i,
  /terms & conditions/i,
  /terms of service/i,
  /privacy policy/i,
  /cookie policy/i,
  /we use cookies/i,
  /download our app/i,
  /follow us on/i,
  /join our whatsapp/i,
  /whatsapp channel/i,
  /telegram channel/i,
  /newsletter/i,
  /also read:/i,
  /read more:/i,
  /click here to/i,
  /photo credit:/i,
  /file photo/i,
  /published\s*-\s*/i,
  /updated\s*-\s*/i,
  /view full coverage/i,
  /\b(?:terms|conditions|subscriber|epaper|today’s paper|todays paper)\b/i,
];

export class ArticleContentExtractor {
  /**
   * Fetches the web page at targetUrl and extracts authentic readable article body paragraphs.
   * Returns null if content cannot be reliably extracted.
   */
  static async extractFullContent(targetUrl: string): Promise<string | null> {
    if (!targetUrl || !targetUrl.startsWith("http")) return null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

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
   * Scopes search to semantic article body containers and filters out page chrome.
   */
  static parseArticleTextFromHtml(html: string): string | null {
    if (!html || html.length < 250) return null;

    // 1. Strip non-content, structural tags
    let doc = html
      .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, "")
      .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    // 2. Strip known boilerplate/chrome containers (paywalls, subscription blocks, login modals, comments)
    const chromeBlockPatterns = [
      /<div[^>]+class=["'][^"']*(?:sub-block|subscription|paywall|account-details|state--active-subscription|user-profile|login|logout|modal|popup|comment|comments|advertisement|sidebar)[^"']*["'][\s\S]*?<\/div>/gi,
      /<section[^>]+class=["'][^"']*(?:subscription|paywall|comment|comments|ad-|sidebar)[^"']*["'][\s\S]*?<\/section>/gi,
      /<aside[^>]*>[\s\S]*?<\/aside>/gi,
    ];

    for (const pattern of chromeBlockPatterns) {
      doc = doc.replace(pattern, "");
    }

    // 3. Locate standard semantic article body container
    const containerMatch = doc.match(
      /<(?:article|div|main|section)[^>]+(?:itemprop=["']articleBody["']|id=["'][^"']*(?:article|story|content|release)[^"']*["']|class=["'][^"']*(?:articlebodycontent|article-body|article_body|story-details|storycontent|story_body|story_content|mainArea|entry-content|post-content|article-content|article-desc|field-name-body|release_detail|pib_content|article_text)[^"']*)[\s\S]*$/i
    );

    const articleTagMatch = doc.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);

    const targetArea = containerMatch ? containerMatch[0] : (articleTagMatch ? articleTagMatch[1] : doc);

    // 4. Extract all paragraph tags
    const pMatches = [...targetArea.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];

    const validParas: string[] = [];
    for (const match of pMatches) {
      const cleaned = this.sanitizeParagraph(match[1]);
      if (cleaned) {
        validParas.push(cleaned);
      }
    }

    // 5. If <p> tags were sparse (common in government press releases formatted with <div> and <br>)
    if (validParas.length < 2) {
      const brParts = targetArea
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/div>/gi, "\n")
        .split(/\n\s*\n|\n/)
        .map((line) => this.sanitizeParagraph(line))
        .filter((line): line is string => Boolean(line && line.length >= 60));

      if (brParts.length >= 2) {
        validParas.push(...brParts);
      }
    }

    // 6. Strict Quality Rejection Gate: Require at least 2 authentic paragraphs and >= 180 chars
    if (validParas.length >= 2) {
      const combined = validParas.slice(0, 18).join("\n\n");
      if (combined.length >= 180) {
        return combined;
      }
    }

    return null;
  }

  /**
   * Sanitizes arbitrary text (e.g. from RSS descriptions or feeds), stripping HTML and boilerplate.
   */
  static cleanArticleText(rawText?: string | null): string | null {
    if (!rawText) return null;

    // If it contains HTML tags, extract paragraphs
    if (/<[a-z][\s\S]*>/i.test(rawText)) {
      const parsed = this.parseArticleTextFromHtml(rawText);
      if (parsed) return parsed;
    }

    // Split on newlines or double spaces
    const parts = rawText.split(/\n\s*\n|\n/);
    const valid: string[] = [];

    for (const part of parts) {
      const cleaned = this.sanitizeParagraph(part);
      if (cleaned) {
        valid.push(cleaned);
      }
    }

    if (valid.length >= 2) {
      return valid.join("\n\n");
    } else if (valid.length === 1 && valid[0].length >= 100) {
      return valid[0];
    }

    return null;
  }

  /**
   * Cleans a single paragraph string, stripping inner tags, decoding entities,
   * and testing against all known boilerplate signatures.
   */
  static sanitizeParagraph(rawText: string): string | null {
    if (!rawText) return null;

    let text = rawText
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
      .replace(/&#8217;|&#8216;/gi, "'")
      .replace(/&#8220;|&#8221;/gi, '"')
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();

    // Ignore short snippets, metadata, or breadcrumb lines
    if (text.length < 45) return null;
    if ((text.match(/\//g) || []).length >= 3) return null;

    // Test against known boilerplate expressions
    const isBoilerplate = KNOWN_BOILERPLATE_PATTERNS.some((pattern) => pattern.test(text));
    if (isBoilerplate) {
      return null;
    }

    return text;
  }
}
