import { ChangeDetectionResult, ImportSource } from "../types";

/**
 * Contract for Change and Duplicate Detection.
 * Determines if extracted/normalized items are completely new, updated, or duplicates.
 */
export interface IChangeDetector {
  /**
   * Evaluates if item is INSERT, UPDATE, or SKIP by analyzing cryptographic hashes
   */
  evaluateChange(params: {
    sourceId: string;
    entityType: string;
    naturalKey: string;
    normalizedContent: any;
    rawPayload: any;
  }): Promise<ChangeDetectionResult>;

  /**
   * Records / updates entity fingerprint hash upon successful database persistence
   */
  recordFingerprint(params: {
    sourceId: string;
    entityType: string;
    naturalKey: string;
    entityId: string;
    contentHash: string;
    rawHash: string;
  }): Promise<void>;
}
