import { createAdminClient } from "@/lib/supabase/admin";
import { IChangeDetector } from "../interfaces/change-detector.interface";
import { ChangeDetectionResult, ChangeActionType } from "../types";
import { hashData } from "./hasher";

export class DatabaseChangeDetector implements IChangeDetector {
  /**
   * Evaluates if item is INSERT, UPDATE, or SKIP by analyzing cryptographic hashes against stored fingerprints.
   */
  async evaluateChange(params: {
    sourceId: string;
    entityType: string;
    naturalKey: string;
    normalizedContent: any;
    rawPayload: any;
  }): Promise<ChangeDetectionResult> {
    const supabase = createAdminClient();
    const contentHash = hashData(params.normalizedContent);
    const rawHash = hashData(params.rawPayload);

    // Look up existing fingerprint for this (sourceId, entityType, naturalKey)
    const { data: existingRecord, error } = await (supabase.from("import_entity_hashes") as any)
      .select("id, entity_id, content_hash, raw_hash")
      .eq("source_id", params.sourceId)
      .eq("entity_type", params.entityType)
      .eq("natural_key", params.naturalKey)
      .maybeSingle();

    if (error) {
      console.warn("Change detection query error, defaulting to INSERT:", error);
      return {
        action: "INSERT",
        naturalKey: params.naturalKey,
        contentHash,
        rawHash,
        reason: "Hash lookup error or table unpopulated",
      };
    }

    // If no existing record exists, it is a brand new item (INSERT)
    if (!existingRecord) {
      return {
        action: "INSERT",
        naturalKey: params.naturalKey,
        contentHash,
        rawHash,
        reason: "New natural key encountered",
      };
    }

    // If normalized content hash is identical, data has not changed at all (SKIP)
    if (existingRecord.content_hash === contentHash) {
      return {
        action: "SKIP",
        naturalKey: params.naturalKey,
        contentHash,
        rawHash,
        existingEntityId: existingRecord.entity_id,
        reason: "Identical content hash; duplicate item skipped",
      };
    }

    // If content hash differs, source has updated notice details (UPDATE)
    return {
      action: "UPDATE",
      naturalKey: params.naturalKey,
      contentHash,
      rawHash,
      existingEntityId: existingRecord.entity_id,
      reason: "Content hash mismatch; source payload updated",
    };
  }

  /**
   * Records or updates the entity fingerprint in import_entity_hashes table.
   */
  async recordFingerprint(params: {
    sourceId: string;
    entityType: string;
    naturalKey: string;
    entityId: string;
    contentHash: string;
    rawHash: string;
  }): Promise<void> {
    const supabase = createAdminClient();

    await (supabase.from("import_entity_hashes") as any).upsert(
      {
        source_id: params.sourceId,
        entity_type: params.entityType,
        natural_key: params.naturalKey,
        entity_id: params.entityId,
        content_hash: params.contentHash,
        raw_hash: params.rawHash,
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: "source_id,entity_type,natural_key",
      }
    );
  }
}
