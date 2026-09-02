import { ArticleContentExtractor } from "./article-content-extractor";

/**
 * Formats news article content into clean, readable journalistic paragraphs.
 * Strictly avoids generating generic filler, fabricated text, or publishing web chrome.
 */
export class NewsContentSynthesizer {
  static generateFullArticleBody(
    article: {
      title: string;
      summary: string;
      content?: string | null;
      source_name: string;
      source_url: string;
      published_at?: string;
      category_slug?: string;
      state_code?: string | null;
      tags?: string[] | null;
    },
    lang: "en" | "hi" = "en"
  ): {
    summary: string;
    paragraphs: string[];
  } {
    const rawContent = (article.content || "").trim();
    const rawSummary = (article.summary || article.title || "").trim();

    // Sanitize the summary itself to remove any boilerplate
    const cleanSummary =
      ArticleContentExtractor.sanitizeParagraph(rawSummary) || rawSummary;

    // 1. If detailed content is available, sanitize every paragraph
    if (rawContent && rawContent.length > 80) {
      // Split into candidate paragraphs
      const candidateParas = rawContent
        .split(/\n\s*\n|\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const sanitizedParas: string[] = [];
      for (const para of candidateParas) {
        const cleaned = ArticleContentExtractor.sanitizeParagraph(para);
        if (cleaned) {
          sanitizedParas.push(cleaned);
        }
      }

      if (sanitizedParas.length >= 2) {
        return {
          summary: cleanSummary,
          paragraphs: sanitizedParas,
        };
      }

      // If single long block, split by sentences and chunk into clean paragraphs
      if (sanitizedParas.length === 1 && sanitizedParas[0].length >= 140) {
        const sentences = sanitizedParas[0]
          .replace(/\n+/g, " ")
          .split(/(?<=[.!?।])\s+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        if (sentences.length >= 3) {
          const chunkedParas: string[] = [];
          let currentChunk: string[] = [];

          for (let i = 0; i < sentences.length; i++) {
            currentChunk.push(sentences[i]);
            if (currentChunk.join(" ").length >= 180 || i === sentences.length - 1) {
              chunkedParas.push(currentChunk.join(" "));
              currentChunk = [];
            }
          }

          if (chunkedParas.length >= 2) {
            return {
              summary: cleanSummary,
              paragraphs: chunkedParas,
            };
          }
        }

        return {
          summary: cleanSummary,
          paragraphs: sanitizedParas,
        };
      }
    }

    // 2. If only summary is available or content was discarded as chrome/boilerplate,
    // present clean factual paragraphs derived from the verified synopsis
    return this.synthesizeFromCleanSummary(article.title, cleanSummary, article.source_name);
  }

  /**
   * Constructs structured, factual paragraphs from a verified title and synopsis
   * without hallucinating or inventing facts.
   */
  static synthesizeFromCleanSummary(
    title: string,
    summary: string,
    sourceName?: string
  ): {
    summary: string;
    paragraphs: string[];
  } {
    const cleanTitle = title.trim();
    const cleanSummary = summary.trim();

    // Check if summary has multiple distinct sentences
    const sentences = cleanSummary
      .replace(/\n+/g, " ")
      .split(/(?<=[.!?।])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sentences.length >= 2) {
      return {
        summary: cleanSummary,
        paragraphs: [
          sentences.slice(0, Math.ceil(sentences.length / 2)).join(" "),
          sentences.slice(Math.ceil(sentences.length / 2)).join(" "),
        ],
      };
    }

    return {
      summary: cleanSummary,
      paragraphs: [cleanSummary],
    };
  }
}
