import { createAdminClient } from "@/lib/supabase/admin";
import { SourceAdapterRegistry } from "./registry";
import { DatabaseChangeDetector } from "./change-detector";
import { hashData } from "./hasher";
import { classifyError, calculateBackoffDelay, IngestionError } from "./retry-handler";
import {
  ImportJob,
  ImportSource,
  IngestionStats,
  RawItem,
  NormalizedJobNotice,
  NormalizedBulletinNotice,
} from "../types";
import { IngestionContext } from "../interfaces/adapter.interface";
import { slugify } from "@/lib/utils";

export class IngestionPipelineEngine {
  private changeDetector = new DatabaseChangeDetector();

  /**
   * Executes an ingestion job end-to-end with strict state tracking, duplicate detection, and error handling.
   */
  async executeJob(jobId: string): Promise<IngestionStats> {
    const supabase = createAdminClient();

    // 1. Fetch Job & Source metadata
    const { data: jobData, error: jobError } = await (supabase.from("import_jobs") as any)
      .select("*, import_sources(*)")
      .eq("id", jobId)
      .single();

    if (jobError || !jobData) {
      throw new Error(`Ingestion job not found: ${jobId}`);
    }

    const job = jobData as ImportJob & { import_sources: ImportSource };
    const source = job.import_sources;

    if (!source || !source.is_enabled) {
      throw new Error(`Import source "${source?.code || "unknown"}" is disabled or missing`);
    }

    // Logger helper
    const log = async (level: "debug" | "info" | "warn" | "error" | "fatal", step: string, message: string, metadata?: any) => {
      try {
        await (supabase.from("import_logs") as any).insert({
          job_id: jobId,
          level,
          step,
          message,
          metadata: metadata || null,
        });
      } catch (logErr) {
        console.error("Failed to write import log:", logErr);
      }
    };

    const stats: IngestionStats = {
      totalExtracted: 0,
      totalNormalized: 0,
      totalInserted: 0,
      totalUpdated: 0,
      totalSkipped: 0,
      totalFailed: 0,
    };

    try {
      await log("info", "initialization", `Starting ingestion for source: ${source.name} [${source.code}]`);

      // 2. Resolve registered Adapter & Normalizer
      const adapter = SourceAdapterRegistry.getAdapter(source.adapter_key);
      if (!adapter) {
        throw new IngestionError(
          `No registered SourceAdapter found for key: "${source.adapter_key}"`,
          "fatal",
          false
        );
      }

      const normalizer = SourceAdapterRegistry.getNormalizer(source.adapter_key);

      const context: IngestionContext = {
        jobId,
        source,
        log,
      };

      // 3. Extraction Phase
      await log("info", "extract", `Invoking extraction via adapter: ${adapter.name}`);
      const extractionResult = await adapter.extract(context);
      stats.totalExtracted = extractionResult.items.length;
      await log("info", "extract", `Extracted ${stats.totalExtracted} raw items from source`);

      // 4. Processing & Normalization Pipeline
      for (const item of extractionResult.items) {
        const rawHash = hashData(item.rawPayload);

        // Store immutable raw payload
        const { data: rawPayloadRecord, error: rawError } = await (supabase.from("import_raw_payloads") as any)
          .insert({
            job_id: jobId,
            source_id: source.id,
            external_id: item.externalId || null,
            payload_hash: rawHash,
            raw_payload: item.rawPayload,
            content_type: item.contentType || "application/json",
            status: "raw",
          })
          .select("id")
          .single();

        const rawPayloadId = rawPayloadRecord?.id;

        if (!normalizer) {
          // In raw-only mode without normalizer
          stats.totalNormalized++;
          continue;
        }

        // Normalize raw item
        const normResult = await normalizer.normalize(item, context);
        if (!normResult.success || !normResult.data) {
          stats.totalFailed++;
          if (rawPayloadId) {
            await (supabase.from("import_raw_payloads") as any)
              .update({ status: "rejected", error_message: normResult.errors?.join("; ") || "Normalization failed" })
              .eq("id", rawPayloadId);
          }
          await log("warn", "normalize", `Normalization failed for item: ${normResult.naturalKey || "unknown"}`, {
            errors: normResult.errors,
          });
          continue;
        }

        stats.totalNormalized++;

        // 5. Duplicate & Change Detection Phase
        const changeResult = await this.changeDetector.evaluateChange({
          sourceId: source.id,
          entityType: source.target_module,
          naturalKey: normResult.naturalKey,
          normalizedContent: normResult.data,
          rawPayload: item.rawPayload,
        });

        if (changeResult.action === "SKIP") {
          stats.totalSkipped++;
          if (rawPayloadId) {
            await (supabase.from("import_raw_payloads") as any)
              .update({ status: "duplicate" })
              .eq("id", rawPayloadId);
          }
          continue;
        }

        // 6. Domain Persistence Phase (Only for INSERT or UPDATE)
        let persistedEntityId: string | null = null;
        try {
          if (source.target_module === "jobs") {
            persistedEntityId = await this.persistJobNotice(normResult.data as NormalizedJobNotice, changeResult.existingEntityId);
          } else if (source.target_module === "bulletins") {
            persistedEntityId = await this.persistBulletinNotice(normResult.data as NormalizedBulletinNotice, changeResult.existingEntityId);
          }

          if (persistedEntityId) {
            // Record fingerprint
            await this.changeDetector.recordFingerprint({
              sourceId: source.id,
              entityType: source.target_module,
              naturalKey: normResult.naturalKey,
              entityId: persistedEntityId,
              contentHash: changeResult.contentHash,
              rawHash: changeResult.rawHash,
            });

            if (changeResult.action === "INSERT") {
              stats.totalInserted++;
            } else {
              stats.totalUpdated++;
            }

            if (rawPayloadId) {
              await (supabase.from("import_raw_payloads") as any)
                .update({ status: "normalized" })
                .eq("id", rawPayloadId);
            }
          }
        } catch (persistErr: any) {
          stats.totalFailed++;
          await log("error", "persist", `Failed to persist ${source.target_module} entity: ${persistErr?.message}`);
        }
      }

      // 7. Complete Ingestion Job
      await (supabase.from("import_jobs") as any)
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          total_extracted: stats.totalExtracted,
          total_normalized: stats.totalNormalized,
          total_inserted: stats.totalInserted,
          total_updated: stats.totalUpdated,
          total_skipped: stats.totalSkipped,
          total_failed: stats.totalFailed,
        })
        .eq("id", jobId);

      await (supabase.from("import_sources") as any)
        .update({
          last_synced_at: new Date().toISOString(),
        })
        .eq("id", source.id);

      await log("info", "completion", `Ingestion job completed successfully`, stats);
      return stats;
    } catch (err: any) {
      const classified = classifyError(err);
      await log("fatal", "error", `Ingestion job failed: ${classified.message}`, {
        category: classified.category,
        isRetryable: classified.isRetryable,
      });

      const shouldRetry = classified.isRetryable && job.retry_count < job.max_retries;

      await (supabase.from("import_jobs") as any)
        .update({
          status: shouldRetry ? "retrying" : "failed",
          error_message: classified.message,
          error_details: { category: classified.category, isRetryable: classified.isRetryable },
          retry_count: job.retry_count + (shouldRetry ? 1 : 0),
          completed_at: shouldRetry ? null : new Date().toISOString(),
        })
        .eq("id", jobId);

      throw err;
    }
  }

  /**
   * Helper: Persists normalized job notice to gov_jobs table
   */
  private async persistJobNotice(notice: NormalizedJobNotice, existingId?: string | null): Promise<string> {
    const supabase = createAdminClient();

    // Resolve Org ID & Category ID from slugs
    const { data: org } = await (supabase.from("organizations") as any)
      .select("id")
      .eq("slug", notice.organizationSlug)
      .maybeSingle();

    const { data: cat } = await (supabase.from("categories") as any)
      .select("id")
      .eq("slug", notice.categorySlug)
      .maybeSingle();

    let organizationId = org?.id;
    let categoryId = cat?.id;

    if (!organizationId) {
      const { data: defaultOrg } = await (supabase.from("organizations") as any).select("id").limit(1).single();
      organizationId = defaultOrg?.id;
    }
    if (!categoryId) {
      const { data: defaultCat } = await (supabase.from("categories") as any).select("id").limit(1).single();
      categoryId = defaultCat?.id;
    }

    let slug = notice.slug || slugify(notice.title);

    const jobData: any = {
      title: notice.title,
      slug,
      notification_number: notice.notificationNumber || null,
      organization_id: organizationId,
      category_id: categoryId,
      state_code: notice.stateCode || null,
      employment_type: notice.employmentType || "permanent",
      total_vacancies: notice.totalVacancies || 0,
      salary_min: notice.salaryMin || null,
      salary_max: notice.salaryMax || null,
      pay_scale_details: notice.payScaleDetails || null,
      official_notification_url: notice.officialNotificationUrl,
      official_apply_url: notice.officialApplyUrl || null,
      status: "published",
      published_at: new Date().toISOString(),
      summary: notice.summary || null,
      application_start_date: notice.applicationStartDate ? notice.applicationStartDate.toISOString() : null,
      application_end_date: notice.applicationEndDate ? notice.applicationEndDate.toISOString() : null,
    };

    let targetId = existingId;
    if (existingId) {
      await (supabase.from("gov_jobs") as any).update(jobData).eq("id", existingId);
    } else {
      const { data: existingSlugJob } = await (supabase.from("gov_jobs") as any)
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existingSlugJob) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
        jobData.slug = slug;
      }

      const { data: inserted, error } = await (supabase.from("gov_jobs") as any)
        .insert(jobData)
        .select("id")
        .single();
      if (error) throw error;
      targetId = inserted.id;
    }

    if (!targetId) throw new Error("Failed to resolve target job ID");

    // Sync sub-entities if provided
    if (notice.vacancies && notice.vacancies.length > 0) {
      await (supabase.from("job_vacancies") as any).delete().eq("job_id", targetId);
      const vacanciesToInsert = notice.vacancies.map((v) => ({
        job_id: targetId as string,
        post_name: v.postName,
        post_code: v.postCode || null,
        total_posts: v.totalPosts,
        ur_posts: v.urPosts || 0,
        ews_posts: v.ewsPosts || 0,
        obc_posts: v.obcPosts || 0,
        sc_posts: v.scPosts || 0,
        st_posts: v.stPosts || 0,
        pwd_posts: v.pwdPosts || 0,
        pay_level: v.payLevel || null,
      }));
      await (supabase.from("job_vacancies") as any).insert(vacanciesToInsert);
    }

    if (notice.importantDates && notice.importantDates.length > 0) {
      await (supabase.from("job_important_dates") as any).delete().eq("job_id", targetId);
      const datesToInsert = notice.importantDates.map((d, idx) => ({
        job_id: targetId as string,
        event_name: d.eventName,
        event_date: d.eventDate ? d.eventDate.toISOString() : null,
        event_date_text: d.eventDateText || null,
        is_tentative: d.isTentative || false,
        display_order: d.displayOrder ?? idx + 1,
      }));
      await (supabase.from("job_important_dates") as any).insert(datesToInsert);
    }

    if (notice.eligibility) {
      await (supabase.from("job_eligibility") as any).delete().eq("job_id", targetId);
      await (supabase.from("job_eligibility") as any).insert({
        job_id: targetId,
        min_age: notice.eligibility.minAge || null,
        max_age: notice.eligibility.maxAge || null,
        age_calculation_date: notice.eligibility.ageCalculationDate || null,
        age_relaxation_details: notice.eligibility.ageRelaxationDetails || null,
        education_qualification: notice.eligibility.educationQualification,
        experience_details: notice.eligibility.experienceDetails || null,
        selection_process: notice.eligibility.selectionProcess || null,
        application_fee_details: notice.eligibility.applicationFeeDetails || null,
      });
    }

    if (notice.officialDocuments && notice.officialDocuments.length > 0) {
      await (supabase.from("job_official_documents") as any).delete().eq("job_id", targetId);
      const docsToInsert = notice.officialDocuments.map((doc) => ({
        job_id: targetId as string,
        document_type: doc.documentType || "full_notification",
        title: doc.title,
        file_url: doc.fileUrl,
        published_date: doc.publishedDate || null,
      }));
      await (supabase.from("job_official_documents") as any).insert(docsToInsert);
    }

    return targetId;
  }

  /**
   * Helper: Persists normalized bulletin notice to public_bulletins table
   */
  private async persistBulletinNotice(bulletin: NormalizedBulletinNotice, existingId?: string | null): Promise<string> {
    const supabase = createAdminClient();

    let orgId: string | null = null;
    if (bulletin.organizationSlug) {
      const { data: org } = await (supabase.from("organizations") as any)
        .select("id")
        .eq("slug", bulletin.organizationSlug)
        .maybeSingle();
      orgId = org?.id || null;
    }

    const bulletinData: any = {
      title: bulletin.title,
      slug: bulletin.slug || slugify(bulletin.title),
      category: bulletin.category,
      organization_id: orgId,
      summary: bulletin.summary,
      content: bulletin.content || null,
      source_url: bulletin.sourceUrl,
      source_name: bulletin.sourceName,
      is_breaking: bulletin.isBreaking || false,
      status: "published",
      published_at: bulletin.publishedAt ? bulletin.publishedAt.toISOString() : new Date().toISOString(),
    };

    if (existingId) {
      await (supabase.from("public_bulletins") as any).update(bulletinData).eq("id", existingId);
      return existingId;
    } else {
      const { data: inserted, error } = await (supabase.from("public_bulletins") as any)
        .insert(bulletinData)
        .select("id")
        .single();
      if (error) throw error;
      return inserted.id;
    }
  }
}
