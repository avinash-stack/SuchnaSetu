import { ImportSource, ExtractionResult, IngestionStats } from "../types";

export interface IngestionContext {
  jobId: string;
  source: ImportSource;
  cursor?: string | null;
  log: (level: "debug" | "info" | "warn" | "error", step: string, message: string, metadata?: any) => Promise<void>;
}

/**
 * Contract for all data source adapters (Feeds, APIs, FTP, Direct Gazette Connectors).
 * Each new data source implements this interface as an independent plugin.
 */
export interface SourceAdapter<TConfig = any, TRawItem = any> {
  /**
   * Unique identifier key for this adapter (e.g. "upsc_rss_feed", "ssc_notices_api")
   */
  readonly key: string;

  /**
   * Human-readable name of the adapter
   */
  readonly name: string;

  /**
   * Target SuchnaSetu domain module ("jobs", "exams", "bulletins", "schemes", etc.)
   */
  readonly targetModule: string;

  /**
   * Verifies source connectivity and configuration parameters
   */
  testConnection(source: ImportSource): Promise<{ success: boolean; message?: string }>;

  /**
   * Extracts raw items from the external origin
   */
  extract(context: IngestionContext): Promise<ExtractionResult<TRawItem>>;
}
