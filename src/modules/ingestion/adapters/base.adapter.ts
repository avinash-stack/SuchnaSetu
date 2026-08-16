import { SourceAdapter, IngestionContext } from "../interfaces/adapter.interface";
import { ImportSource, ExtractionResult } from "../types";

/**
 * Base class for all source adapters providing standardized utility wrappers.
 */
export abstract class BaseSourceAdapter<TConfig = any, TRawItem = any>
  implements SourceAdapter<TConfig, TRawItem>
{
  abstract readonly key: string;
  abstract readonly name: string;
  abstract readonly targetModule: string;

  abstract testConnection(source: ImportSource): Promise<{ success: boolean; message?: string }>;

  abstract extract(context: IngestionContext): Promise<ExtractionResult<TRawItem>>;

  /**
   * Helper to safely parse source configuration JSON
   */
  protected parseConfig(source: ImportSource): TConfig {
    if (typeof source.config === "string") {
      try {
        return JSON.parse(source.config);
      } catch {
        return {} as TConfig;
      }
    }
    return (source.config || {}) as TConfig;
  }
}
