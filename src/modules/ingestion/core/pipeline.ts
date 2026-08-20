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
            
            // Intelligent Cross-Population: If the job notice is a structured examination, also sync to gov_exams
            const titleLower = (normResult.data.title || "").toLowerCase();
            const isExam =
              titleLower.includes("examination") ||
              titleLower.includes("exam") ||
              titleLower.includes("cgl") ||
              titleLower.includes("chsl") ||
              titleLower.includes("nda") ||
              titleLower.includes("cds") ||
              titleLower.includes("cse") ||
              titleLower.includes("cce") ||
              titleLower.includes("norcet") ||
              titleLower.includes("afcat") ||
              titleLower.includes("civil services") ||
              titleLower.includes("test");

            if (isExam) {
              try {
                await this.persistExamNotice(normResult.data);
              } catch (examErr: any) {
                await log("warn", "persist_exam_link", `Could not cross-populate exam record: ${examErr?.message}`);
              }
            }
          } else if (source.target_module === "exams") {
            persistedEntityId = await this.persistExamNotice(normResult.data, changeResult.existingEntityId);
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

    const slug = bulletin.slug || slugify(bulletin.title);

    // Check if bulletin exists by existingId or slug
    let targetId = existingId;
    let existingBulletin: any = null;

    if (!targetId) {
      const { data: found } = await (supabase.from("public_bulletins") as any)
        .select("id, title, published_at")
        .eq("slug", slug)
        .maybeSingle();
      if (found) {
        targetId = found.id;
        existingBulletin = found;
      }
    } else {
      const { data: found } = await (supabase.from("public_bulletins") as any)
        .select("id, title, published_at")
        .eq("id", targetId)
        .maybeSingle();
      existingBulletin = found;
    }

    // Map to valid db category if needed
    const validDbCategories = ["employment_news", "student_advisory", "legal_update", "press_release"];
    let cat: string = bulletin.category;
    if (!validDbCategories.includes(cat)) {
      if (cat === "recruitment_jobs") cat = "employment_news";
      else if (cat === "government_updates" || cat === "government_schemes") cat = "press_release";
      else cat = "student_advisory";
    }

    const bulletinData: any = {
      title: bulletin.title,
      slug,
      category: cat,
      organization_id: orgId,
      summary: bulletin.summary,
      content: bulletin.content || null,
      source_url: bulletin.sourceUrl,
      source_name: bulletin.sourceName,
      is_breaking: bulletin.isBreaking || false,
      status: "published",
      published_at: existingBulletin?.published_at || (bulletin.publishedAt ? bulletin.publishedAt.toISOString() : new Date().toISOString()),
    };

    if (targetId) {
      // If manually edited by admin, protect title, summary, and content from automated overwrite
      if (existingBulletin?.is_manually_edited) {
        delete bulletinData.title;
        delete bulletinData.summary;
        delete bulletinData.content;
      }
      await (supabase.from("public_bulletins") as any).update(bulletinData).eq("id", targetId);
      return targetId;
    } else {
      const { data: inserted, error } = await (supabase.from("public_bulletins") as any)
        .insert(bulletinData)
        .select("id")
        .single();
      if (error) throw error;
      return inserted.id;
    }
  }

  /**
   * Helper: Persists normalized exam notice to gov_exams table and sub-entities
   */
  private async persistExamNotice(notice: NormalizedJobNotice | any, existingId?: string | null): Promise<string> {
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

    const mode =
      notice.mode ||
      (notice.title?.toLowerCase().includes("cbt") || notice.title?.toLowerCase().includes("online")
        ? "online_cbt"
        : "offline_omr");
    const frequency = notice.frequency || "annual";

    const examData: any = {
      title: notice.title,
      short_title: notice.shortTitle || notice.title?.slice(0, 60),
      slug,
      exam_code: notice.notificationNumber || notice.examCode || null,
      organization_id: organizationId,
      category_id: categoryId,
      state_code: notice.stateCode || null,
      mode,
      frequency,
      description:
        notice.summary ||
        notice.description ||
        `${notice.title} conducted by official authorities across designated examination centers.`,
      syllabus_summary:
        notice.syllabusSummary ||
        notice.selectionProcess ||
        notice.eligibility?.selection_process ||
        "Comprehensive syllabus and examination pattern details as published in the official notification.",
      marking_scheme:
        notice.markingScheme ||
        "Negative marking applicable for incorrect responses as specified in commission instructions.",
      pattern_description:
        notice.patternDescription ||
        notice.eligibility?.selection_process ||
        "Multi-stage competitive examination process.",
      application_process_guide:
        notice.applicationProcessGuide ||
        `Submit application on the official commission portal (${notice.officialApplyUrl || notice.officialNotificationUrl}).`,
      official_notification_url: notice.officialNotificationUrl,
      official_website_url: notice.officialApplyUrl || notice.officialNotificationUrl,
      application_fee_details: notice.eligibility?.applicationFeeDetails || {
        general: 100,
        obc: 100,
        ews: 100,
        sc: 0,
        st: 0,
        female: 0,
      },
      status: "published",
      is_featured: notice.isFeatured || false,
      published_at: notice.publishedAt ? (typeof notice.publishedAt === "string" ? notice.publishedAt : notice.publishedAt.toISOString()) : new Date().toISOString(),
    };

    let targetId = existingId;
    if (existingId) {
      await (supabase.from("gov_exams") as any).update(examData).eq("id", existingId);
    } else {
      const { data: existingSlugExam } = await (supabase.from("gov_exams") as any)
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existingSlugExam) {
        targetId = existingSlugExam.id;
        await (supabase.from("gov_exams") as any).update(examData).eq("id", targetId);
      } else {
        const { data: inserted, error } = await (supabase.from("gov_exams") as any)
          .insert(examData)
          .select("id")
          .single();
        if (error) throw error;
        targetId = inserted.id;
      }
    }

    if (!targetId) throw new Error("Failed to resolve target exam ID");

    // Insert Examination Stages if none exist
    const { count: stageCount } = await (supabase.from("exam_stages") as any)
      .select("id", { count: "exact", head: true })
      .eq("exam_id", targetId);

    if (!stageCount || stageCount === 0) {
      await (supabase.from("exam_stages") as any).insert([
        {
          exam_id: targetId,
          stage_name: "Stage I: Preliminary Screening / CBT",
          stage_order: 1,
          stage_type: "prelims",
          mode: mode === "online_cbt" ? "online_cbt" : "offline_omr",
          duration_minutes: 120,
          total_marks: 200,
          qualifying_marks: 66,
          status: "scheduled",
        },
        {
          exam_id: targetId,
          stage_name: "Stage II: Main Examination / Skill Test",
          stage_order: 2,
          stage_type: "mains",
          mode: "pen_paper",
          duration_minutes: 180,
          total_marks: 300,
          qualifying_marks: 100,
          status: "upcoming",
        },
      ]);
    }

    // Insert Important Dates
    if (notice.importantDates && notice.importantDates.length > 0) {
      await (supabase.from("exam_important_dates") as any).delete().eq("exam_id", targetId);
      const datesToInsert = notice.importantDates.map((d: any, idx: number) => ({
        exam_id: targetId as string,
        title: d.eventName || "Important Date",
        event_date: d.eventDate
          ? typeof d.eventDate === "string"
            ? d.eventDate.split("T")[0]
            : d.eventDate.toISOString().split("T")[0]
          : null,
        date_type: d.dateType || "application_end",
        is_tentative: d.isTentative || false,
        display_order: d.displayOrder ?? idx + 1,
      }));
      await (supabase.from("exam_important_dates") as any).insert(datesToInsert);
    } else if (notice.applicationStartDate || notice.applicationEndDate) {
      await (supabase.from("exam_important_dates") as any).delete().eq("exam_id", targetId);
      const dates: any[] = [];
      if (notice.applicationStartDate) {
        dates.push({
          exam_id: targetId,
          title: "Online Application Window Opens",
          event_date:
            typeof notice.applicationStartDate === "string"
              ? notice.applicationStartDate.split("T")[0]
              : notice.applicationStartDate.toISOString().split("T")[0],
          date_type: "application_start",
          is_tentative: false,
          display_order: 1,
        });
      }
      if (notice.applicationEndDate) {
        dates.push({
          exam_id: targetId,
          title: "Last Date for Application Submission",
          event_date:
            typeof notice.applicationEndDate === "string"
              ? notice.applicationEndDate.split("T")[0]
              : notice.applicationEndDate.toISOString().split("T")[0],
          date_type: "application_end",
          is_tentative: false,
          display_order: 2,
        });
      }
      if (dates.length > 0) {
        await (supabase.from("exam_important_dates") as any).insert(dates);
      }
    }

    // Insert Eligibility
    if (notice.eligibility) {
      await (supabase.from("exam_eligibility") as any).delete().eq("exam_id", targetId);
      await (supabase.from("exam_eligibility") as any).insert({
        exam_id: targetId,
        min_age: notice.eligibility.minAge || 18,
        max_age: notice.eligibility.maxAge || 32,
        age_relaxation_rules:
          notice.eligibility.ageRelaxationDetails ||
          "Standard relaxation for SC/ST/OBC/PwD as per government rules.",
        educational_qualification_description:
          notice.eligibility.educationQualification || "Bachelor's Degree or minimum prescribed qualification.",
        nationality_criteria: "Citizen of India",
      });
    }

    // Insert Official Documents
    if (notice.officialDocuments && notice.officialDocuments.length > 0) {
      await (supabase.from("exam_official_documents") as any).delete().eq("exam_id", targetId);
      const docsToInsert = notice.officialDocuments.map((doc: any) => ({
        exam_id: targetId as string,
        document_type: doc.documentType || "full_notification",
        title: doc.title || "Official Notification Gazette",
        file_url: doc.fileUrl,
        published_date: doc.publishedDate || null,
      }));
      await (supabase.from("exam_official_documents") as any).insert(docsToInsert);
    }

    return targetId;
  }
}
