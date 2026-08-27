/**
 * Formats news article content into clean, readable journalistic paragraphs.
 * Strictly avoids generating generic filler or fabricated text.
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

    // 1. If detailed content is available and distinct
    if (rawContent && rawContent.length > 80) {
      // Check if explicit multi-paragraph text
      const explicitParas = rawContent
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (explicitParas.length >= 2) {
        return {
          summary: rawSummary,
          paragraphs: explicitParas,
        };
      }

      // If single long block, split by 2-3 sentences per paragraph for readability
      const sentences = rawContent
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

        if (chunkedParas.length > 0) {
          return {
            summary: rawSummary,
            paragraphs: chunkedParas,
          };
        }
      }

      return {
        summary: rawSummary,
        paragraphs: [rawContent],
      };
    }

    // 2. If only summary is available, present available factual text without fabricating
    return {
      summary: rawSummary,
      paragraphs: [rawSummary],
    };
  }
}
