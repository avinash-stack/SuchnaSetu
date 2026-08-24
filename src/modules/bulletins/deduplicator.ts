/**
 * Multi-layer News Deduplication Engine for SuchnaSetu.
 * Detects identical URLs, wire syndications, and semantic title variations.
 */

/**
 * Tokenize and normalize a title string for semantic comparison.
 */
export function normalizeTitleTokens(title: string): Set<string> {
  const stopWords = new Set([
    "a", "an", "the", "in", "on", "at", "for", "to", "of", "and", "or", "is", "are",
    "was", "were", "by", "with", "from", "as", "about", "into", "over", "after",
    "latest", "today", "live", "update", "news", "direct", "link", "how", "check",
    "download", "released", "announced", "out", "here", "know", "details", "2025", "2026"
  ]);

  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
  );
}

/**
 * Calculates Jaccard token similarity between two headlines (0.0 to 1.0).
 */
export function calculateTitleSimilarity(titleA: string, titleB: string): number {
  const tokensA = normalizeTitleTokens(titleA);
  const tokensB = normalizeTitleTokens(titleB);

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  }

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

/**
 * Determines if a new candidate article is a duplicate of an existing article list.
 */
export function isDuplicateArticle(
  newArticle: { title: string; sourceUrl?: string; publishedAt?: Date | string },
  existingArticles: Array<{ id: string; title: string; sourceUrl?: string; publishedAt?: string | null }>,
  similarityThreshold: number = 0.70
): { isDuplicate: boolean; matchedArticleId?: string; reason?: string } {
  // 1. Exact URL check
  if (newArticle.sourceUrl) {
    const cleanNewUrl = newArticle.sourceUrl.split("?")[0].replace(/\/$/, "");
    for (const ex of existingArticles) {
      if (ex.sourceUrl) {
        const cleanExUrl = ex.sourceUrl.split("?")[0].replace(/\/$/, "");
        if (cleanNewUrl === cleanExUrl) {
          return { isDuplicate: true, matchedArticleId: ex.id, reason: "Identical source URL" };
        }
      }
    }
  }

  // 2. Headline token similarity check within 72-hour time window
  const newTime = newArticle.publishedAt ? new Date(newArticle.publishedAt).getTime() : Date.now();

  for (const ex of existingArticles) {
    if (ex.publishedAt) {
      const exTime = new Date(ex.publishedAt).getTime();
      const diffHours = Math.abs(newTime - exTime) / (1000 * 60 * 60);

      // Only compare articles within a 72-hour window
      if (diffHours <= 72) {
        const sim = calculateTitleSimilarity(newArticle.title, ex.title);
        if (sim >= similarityThreshold) {
          return {
            isDuplicate: true,
            matchedArticleId: ex.id,
            reason: `High semantic headline similarity (${Math.round(sim * 100)}%) with ${ex.title.slice(0, 40)}...`,
          };
        }
      }
    }
  }

  return { isDuplicate: false };
}
