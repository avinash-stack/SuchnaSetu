export interface IngestionResult {
  sourceCode: string;
  sourceName: string;
  status: "success" | "partial" | "failed" | "skipped";
  totalFetched: number;
  totalInserted: number;
  totalDuplicates: number;
  totalFailed: number;
  errorMessage?: string | null;
  durationMs: number;
}

export interface IngestionBatchSummary {
  startedAt: string;
  completedAt: string;
  totalSources: number;
  successfulSources: number;
  failedSources: number;
  totalArticlesFetched: number;
  totalArticlesInserted: number;
  totalDuplicatesSkipped: number;
  results: IngestionResult[];
}
