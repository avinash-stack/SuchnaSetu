import { checkDuplicateArticle } from "../repositories/article-repository";
import { computeContentHash } from "../utils/slugify";
import { NormalizedNewsPayload } from "../adapters/base-adapter";

export async function isDuplicateNewsItem(payload: NormalizedNewsPayload): Promise<boolean> {
  const contentHash = computeContentHash(payload.title, payload.summary);
  return checkDuplicateArticle(contentHash, payload.sourceUrl);
}
