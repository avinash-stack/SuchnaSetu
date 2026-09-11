import { getEnabledNewsSources, updateSourceSyncStatus } from "../repositories/source-repository";
import { insertNewsArticle, recordIngestionLog } from "../repositories/article-repository";
import { RssAtomAdapter } from "../adapters/rss-atom-adapter";
import { isDuplicateNewsItem } from "./deduplication-service";
import { enrichNewsArticleWithAi } from "./ai-enrichment-service";
import { generateNewsSlug, computeContentHash } from "../utils/slugify";
import { IngestionResult, IngestionBatchSummary } from "../types/ingestion";
import { NewsSource } from "../types/source";

export async function syncSingleNewsSource(source: NewsSource): Promise<IngestionResult> {
  const startTime = Date.now();
  let fetchedCount = 0;
  let insertedCount = 0;
  let duplicateCount = 0;
  let failedCount = 0;
  let errorMessage: string | null = null;

  try {
    const adapter = new RssAtomAdapter(source);
    const rawItems = await adapter.fetch();
    fetchedCount = rawItems.length;
    const itemsToProcess = rawItems.slice(0, 15);

    for (const raw of itemsToProcess) {
      try {
        const normalized = await adapter.normalize(raw);
        if (!normalized) continue;

        const slug = generateNewsSlug(normalized.title, normalized.publishedAt);
        const contentHash = computeContentHash(normalized.title, normalized.summary);

        const isDuplicate = await isDuplicateNewsItem(normalized, slug);
        if (isDuplicate) {
          duplicateCount++;
          continue;
        }

        // Quick AI enrichment with fast fallback
        const enriched = await enrichNewsArticleWithAi(normalized);

        const insertRes = await insertNewsArticle({
          slug,
          title: normalized.title,
          summary: enriched.summary || normalized.summary,
          content: enriched.content || normalized.content || null,
          source_id: source.id?.startsWith("source-seed") ? null : source.id,
          source_name: source.name,
          source_url: normalized.sourceUrl,
          canonical_url: normalized.canonicalUrl || normalized.sourceUrl,
          author: normalized.author,
          image_url: normalized.imageUrl,
          category_slug: enriched.categorySlug || source.default_category || "india",
          subcategory: enriched.subcategory,
          state_code: enriched.stateCode || source.state_code,
          tags: enriched.tags,
          entities: enriched.entities,
          importance: enriched.importance,
          ai_status: enriched.aiStatus,
          ai_model: enriched.aiModel,
          content_hash: contentHash,
          published_at: normalized.publishedAt,
        });

        if (insertRes.id) {
          if (insertRes.isUpdated) {
            duplicateCount++;
          } else {
            insertedCount++;
          }
        } else {
          failedCount++;
        }
      } catch (itemErr: any) {
        failedCount++;
      }
    }

    await updateSourceSyncStatus(source.id, {
      lastSyncedAt: new Date().toISOString(),
      lastError: null,
      failureCount: 0,
    });
  } catch (err: any) {
    errorMessage = err.message || "Failed to fetch or parse news feed";
    console.error(`[News Ingestion Error on ${source.code}]:`, errorMessage);

    await updateSourceSyncStatus(source.id, {
      lastSyncedAt: new Date().toISOString(),
      lastError: errorMessage,
      failureCount: (source.failure_count || 0) + 1,
    });
  }

  const durationMs = Date.now() - startTime;
  const status: "success" | "partial" | "failed" =
    errorMessage && insertedCount === 0 ? "failed" : errorMessage ? "partial" : "success";

  await recordIngestionLog({
    sourceId: source.id?.startsWith("source-seed") ? null : source.id,
    status,
    fetchedCount,
    insertedCount,
    duplicateCount,
    errorMessage,
    durationMs,
  });

  return {
    sourceCode: source.code,
    sourceName: source.name,
    status,
    totalFetched: fetchedCount,
    totalInserted: insertedCount,
    totalDuplicates: duplicateCount,
    totalFailed: failedCount,
    errorMessage,
    durationMs,
  };
}

export interface NewsIngestionOptions {
  concurrencyLimit?: number;
  batchSize?: number;
  batchIndex?: number;
  maxDurationMs?: number;
}

export async function runNewsIngestionPipeline(
  optionsOrConcurrency: number | NewsIngestionOptions = 3
): Promise<IngestionBatchSummary> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const options: NewsIngestionOptions =
    typeof optionsOrConcurrency === "number"
      ? { concurrencyLimit: optionsOrConcurrency }
      : optionsOrConcurrency;

  const concurrencyLimit = options.concurrencyLimit || 3;
  const maxDurationMs = options.maxDurationMs || 45000;
  const batchSize = options.batchSize;
  const batchIndex = options.batchIndex || 0;

  const allSources = await getEnabledNewsSources();
  let sourcesToProcess: NewsSource[] = allSources;
  let batchesTotal = 1;
  let isComplete = true;
  let nextBatchIndex: number | null = null;

  if (batchSize && batchSize > 0) {
    batchesTotal = Math.ceil(allSources.length / batchSize);
    const startIdx = batchIndex * batchSize;
    sourcesToProcess = allSources.slice(startIdx, startIdx + batchSize);
    isComplete = batchIndex + 1 >= batchesTotal;
    nextBatchIndex = isComplete ? null : batchIndex + 1;
  }

  const results: IngestionResult[] = [];

  // Bounded concurrency pool with serverless duration safeguard
  for (let i = 0; i < sourcesToProcess.length; i += concurrencyLimit) {
    if (Date.now() - startTime > maxDurationMs) {
      console.warn(
        `[News Ingestion] Serverless time budget safeguard reached (${Date.now() - startTime}ms elapsed). ` +
        `Gracefully completing batch.`
      );
      break;
    }

    const chunk = sourcesToProcess.slice(i, i + concurrencyLimit);
    const chunkResults = await Promise.all(
      chunk.map((source) =>
        syncSingleNewsSource(source).catch((err) => ({
          sourceCode: source.code,
          sourceName: source.name,
          status: "failed" as const,
          totalFetched: 0,
          totalInserted: 0,
          totalDuplicates: 0,
          totalFailed: 0,
          errorMessage: err.message || "Unhandled exception",
          durationMs: 0,
        }))
      )
    );
    results.push(...chunkResults);
  }

  const completedAt = new Date().toISOString();
  const successfulSources = results.filter((r) => r.status === "success" || r.status === "partial").length;
  const failedSources = results.filter((r) => r.status === "failed").length;
  const totalArticlesFetched = results.reduce((acc, r) => acc + r.totalFetched, 0);
  const totalArticlesInserted = results.reduce((acc, r) => acc + r.totalInserted, 0);
  const totalDuplicatesSkipped = results.reduce((acc, r) => acc + r.totalDuplicates, 0);

  return {
    startedAt,
    completedAt,
    totalSources: allSources.length,
    successfulSources,
    failedSources,
    totalArticlesFetched,
    totalArticlesInserted,
    totalDuplicatesSkipped,
    results,
    batchExecution: {
      batchIndex,
      batchSize: batchSize || allSources.length,
      batchesTotal,
      isComplete,
      nextBatchIndex,
    },
  };
}
