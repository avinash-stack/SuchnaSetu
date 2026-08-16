import { RawItem, NormalizationResult } from "../types";
import { IngestionContext } from "./adapter.interface";

/**
 * Contract for Data Normalizers.
 * Transforms raw, messy source payloads into clean, strongly typed canonical domain models.
 */
export interface DataNormalizer<TRawPayload = any, TNormalizedEntity = any> {
  /**
   * Adapter key this normalizer corresponds to
   */
  readonly adapterKey: string;

  /**
   * Transforms and validates a single raw item into canonical domain schema
   */
  normalize(rawItem: RawItem<TRawPayload>, context: IngestionContext): Promise<NormalizationResult<TNormalizedEntity>>;
}
