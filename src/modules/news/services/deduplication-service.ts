import { checkDuplicateArticle } from "../repositories/article-repository";
import { computeContentHash, generateNewsSlug } from "../utils/slugify";
import { NormalizedNewsPayload } from "../adapters/base-adapter";

export async function isDuplicateNewsItem(
  payload: NormalizedNewsPayload,
  slug?: string
): Promise<boolean> {
  const contentHash = computeContentHash(payload.title, payload.summary);
  const resolvedSlug = slug || generateNewsSlug(payload.title, payload.publishedAt);
  return checkDuplicateArticle(contentHash, payload.sourceUrl, resolvedSlug);
}
