import { NewsSource, RawNewsFeedItem } from "../types/source";
import { NewsSourceAdapter, NormalizedNewsPayload } from "./base-adapter";
import { sanitizeHtml, truncateSummary, extractImageUrl } from "../utils/content-sanitizer";

export class RssAtomAdapter implements NewsSourceAdapter {
  constructor(public source: NewsSource) {}

  async fetch(): Promise<RawNewsFeedItem[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(this.source.feed_url, {
        headers: {
          "User-Agent": "SuchnaSetu-NewsBot/1.0 (+https://suchnasetu.in/about)",
          "Accept": "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const xmlText = await res.text();
      return this.parseXml(xmlText);
    } catch (err: any) {
      clearTimeout(timeout);
      throw err;
    }
  }

  private parseXml(xml: string): RawNewsFeedItem[] {
    const items: RawNewsFeedItem[] = [];

    // Match either <item>...</item> (RSS) or <entry>...</entry> (Atom)
    const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 30) {
      const itemXml = match[1];

      const getTag = (tag: string): string => {
        const tMatch = itemXml.match(new RegExp(`<(?:[a-zA-Z0-9_-]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_-]+:)?${tag}>`, "i"));
        if (!tMatch) return "";
        let val = tMatch[1].trim();
        if (val.startsWith("<![CDATA[") && val.endsWith("]]>")) {
          val = val.slice(9, -3).trim();
        }
        return val;
      };

      const getAttr = (tag: string, attr: string): string => {
        const aMatch = itemXml.match(new RegExp(`<(?:[a-zA-Z0-9_-]+:)?${tag}[^>]*${attr}=["']([^"']+)["']`, "i"));
        return aMatch ? aMatch[1] : "";
      };

      const title = getTag("title");
      const link = getTag("link") || getAttr("link", "href");
      const pubDate = getTag("pubDate") || getTag("published") || getTag("updated") || getTag("date");
      const description = getTag("description") || getTag("summary");
      const content = getTag("encoded") || getTag("content") || description;
      const author = getTag("author") || getTag("creator");
      const enclosureUrl = getAttr("enclosure", "url");
      const mediaThumbnail = getAttr("thumbnail", "url");

      if (title && link) {
        items.push({
          title: sanitizeHtml(title),
          link: link.trim(),
          pubDate,
          summary: sanitizeHtml(description),
          content: sanitizeHtml(content),
          author: sanitizeHtml(author),
          enclosure: enclosureUrl ? { url: enclosureUrl } : undefined,
          mediaThumbnail: mediaThumbnail ? { url: mediaThumbnail } : undefined,
        });
      }
    }

    return items;
  }

  async normalize(rawItem: RawNewsFeedItem): Promise<NormalizedNewsPayload | null> {
    if (!rawItem.title || !rawItem.link) return null;

    const cleanTitle = sanitizeHtml(rawItem.title);
    const summaryText = rawItem.summary || rawItem.content || cleanTitle;
    const cleanSummary = truncateSummary(summaryText, 300);
    const imageUrl = extractImageUrl(rawItem);

    let publishedAt = new Date().toISOString();
    if (rawItem.pubDate) {
      const parsed = new Date(rawItem.pubDate);
      if (!isNaN(parsed.getTime())) {
        publishedAt = parsed.toISOString();
      }
    }

    return {
      title: cleanTitle,
      summary: cleanSummary,
      content: rawItem.content ? truncateSummary(rawItem.content, 1200) : null,
      sourceUrl: rawItem.link,
      canonicalUrl: rawItem.link,
      author: rawItem.author || null,
      imageUrl,
      publishedAt,
      categorySlug: this.source.default_category || "india",
      stateCode: this.source.state_code || null,
      tags: rawItem.categories || [],
      rawItem,
    };
  }
}
