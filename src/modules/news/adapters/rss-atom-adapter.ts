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
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SuchnaSetu-NewsBot/1.0 (+https://suchnasetu.in/about)",
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

    let cleanTitle = sanitizeHtml(rawItem.title);
    let author = rawItem.author ? sanitizeHtml(rawItem.author) : null;

    // 1. Clean Google News / Aggregator Titles ("Headline - Publisher")
    const lastDashIndex = cleanTitle.lastIndexOf(" - ");
    if (lastDashIndex > 10) {
      const potentialHeadline = cleanTitle.slice(0, lastDashIndex).trim();
      const potentialPublisher = cleanTitle.slice(lastDashIndex + 3).trim();

      if (
        potentialPublisher.length > 0 &&
        potentialPublisher.length <= 45 &&
        !/[.!?]$/.test(potentialPublisher)
      ) {
        cleanTitle = potentialHeadline;
        if (!author) {
          author = potentialPublisher;
        }
      }
    }

    // 2. Parse Publication Date with support for Indian regional formats
    const publishedAt = this.parsePublicationDate(rawItem.pubDate);

    // 3. Clean Summary & Content
    const summaryText = rawItem.summary || rawItem.content || cleanTitle;
    const cleanSummary = truncateSummary(summaryText, 350);
    const imageUrl = extractImageUrl(rawItem);

    return {
      title: cleanTitle,
      summary: cleanSummary,
      content: rawItem.content ? truncateSummary(rawItem.content, 1500) : null,
      sourceUrl: rawItem.link,
      canonicalUrl: rawItem.link,
      author: author || this.source.name,
      imageUrl,
      publishedAt,
      categorySlug: this.source.default_category || "india",
      stateCode: this.source.state_code || null,
      tags: rawItem.categories || [],
      rawItem,
    };
  }

  private parsePublicationDate(pubDateStr?: string): string {
    if (!pubDateStr) return new Date().toISOString();
    const trimmed = pubDateStr.trim();

    // 1. DD News format: "26-08-2026 | 11:14 pm" or "26-08-2026 23:14:00"
    const ddNewsMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})\s*\|\s*(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
    if (ddNewsMatch) {
      const [, day, month, year, hoursStr, minutesStr, ampm] = ddNewsMatch;
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      if (ampm) {
        if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;
      }
      const pad = (n: number | string) => String(n).padStart(2, "0");
      const istDate = new Date(`${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00+05:30`);
      if (!isNaN(istDate.getTime())) {
        return istDate.toISOString();
      }
    }

    // 2. Standard ISO / RFC-2822 date parse
    const standardDate = new Date(trimmed);
    if (!isNaN(standardDate.getTime())) {
      return standardDate.toISOString();
    }

    return new Date().toISOString();
  }
}
