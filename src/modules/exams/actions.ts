"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { ExamFormSchema, ExamFormData } from "./schemas";

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates or updates a government examination notice and all its nested relations.
 */
export async function saveExamAction(payload: ExamFormData): Promise<ActionResponse<{ id: string; slug: string }>> {
  try {
    const admin = await requireAdmin();
    const validated = ExamFormSchema.parse(payload);
    const supabase = createAdminClient();

    const isUpdate = Boolean(validated.id);
    const examId = validated.id || crypto.randomUUID();

    const examData: Record<string, any> = {
      title: validated.title,
      short_title: validated.shortTitle || null,
      slug: validated.slug,
      exam_code: validated.examCode || null,
      organization_id: validated.organizationId,
      department_id: validated.departmentId || null,
      category_id: validated.categoryId || null,
      state_code: validated.stateCode || null,
      related_job_id: validated.relatedJobId || null,
      mode: validated.mode,
      frequency: validated.frequency,
      description: validated.description,
      syllabus_summary: validated.syllabusSummary || null,
      marking_scheme: validated.markingScheme || null,
      pattern_description: validated.patternDescription || null,
      application_process_guide: validated.applicationProcessGuide || null,
      official_notification_url: validated.officialNotificationUrl || null,
      official_website_url: validated.officialWebsiteUrl || null,
      application_fee_details: validated.applicationFeeDetails || {},
      status: validated.status,
      is_featured: validated.isFeatured,
      meta_title: validated.metaTitle || null,
      meta_description: validated.metaDescription || null,
      updated_at: new Date().toISOString(),
    };

    if (!isUpdate) {
      examData.id = examId;
      examData.created_at = new Date().toISOString();
      if (validated.status === "published") {
        examData.published_at = new Date().toISOString();
      }
    } else if (validated.status === "published") {
      // If updating to published and published_at is empty, set it
      const { data: existing } = (await supabase.from("gov_exams").select("published_at").eq("id", examId).single()) as any;
      if (!existing?.published_at) {
        examData.published_at = new Date().toISOString();
      }
    }

    // 1. Upsert Core Exam
    const { error: examError } = await supabase
      .from("gov_exams")
      .upsert(examData as any);

    if (examError) {
      throw new Error(`Failed to save examination notice: ${examError.message}`);
    }

    // 2. Manage Examination Stages
    await supabase.from("exam_stages").delete().eq("exam_id", examId);
    if (validated.stages && validated.stages.length > 0) {
      const stagesToInsert = validated.stages.map((stage, idx) => ({
        id: stage.id || crypto.randomUUID(),
        exam_id: examId,
        stage_name: stage.stageName,
        stage_order: stage.stageOrder || idx + 1,
        stage_type: stage.stageType,
        mode: stage.mode || "offline_omr",
        duration_minutes: stage.durationMinutes || null,
        total_marks: stage.totalMarks || null,
        qualifying_marks: stage.qualifyingMarks || null,
        description: stage.description || null,
        status: stage.status || "scheduled",
        start_date: stage.startDate || null,
        end_date: stage.endDate || null,
      }));

      const { error: stageError } = await supabase.from("exam_stages").insert(stagesToInsert as any);
      if (stageError) throw new Error(`Failed to save exam stages: ${stageError.message}`);
    }

    // 3. Manage Examination Schedules
    await supabase.from("exam_schedules").delete().eq("exam_id", examId);
    if (validated.schedules && validated.schedules.length > 0) {
      const schedulesToInsert = validated.schedules.map((schedule) => ({
        id: schedule.id || crypto.randomUUID(),
        exam_id: examId,
        stage_id: schedule.stageId || null,
        paper_name: schedule.paperName,
        exam_date: schedule.examDate,
        shift_name: schedule.shiftName || null,
        reporting_time: schedule.reportingTime || null,
        start_time: schedule.startTime || null,
        end_time: schedule.endTime || null,
        instructions: schedule.instructions || null,
      }));

      const { error: schedError } = await supabase.from("exam_schedules").insert(schedulesToInsert as any);
      if (schedError) throw new Error(`Failed to save exam schedules: ${schedError.message}`);
    }

    // 4. Manage Examination Eligibility
    await supabase.from("exam_eligibility").delete().eq("exam_id", examId);
    if (validated.eligibility) {
      const elig = validated.eligibility;
      const { error: eligError } = await supabase.from("exam_eligibility").insert({
        exam_id: examId,
        min_age: elig.minAge || null,
        max_age: elig.maxAge || null,
        age_relaxation_rules: elig.ageRelaxationRules || null,
        min_qualification_id: elig.minQualificationId || null,
        educational_qualification_description: elig.educationalQualificationDescription || null,
        nationality_criteria: elig.nationalityCriteria || "Citizen of India",
        attempts_limit: elig.attemptsLimit || null,
        physical_standards: elig.physicalStandards || null,
        experience_required: elig.experienceRequired || null,
      } as any);

      if (eligError) throw new Error(`Failed to save exam eligibility: ${eligError.message}`);
    }

    // 5. Manage Important Dates
    await supabase.from("exam_important_dates").delete().eq("exam_id", examId);
    if (validated.importantDates && validated.importantDates.length > 0) {
      const datesToInsert = validated.importantDates.map((d, idx) => ({
        id: d.id || crypto.randomUUID(),
        exam_id: examId,
        title: d.title,
        event_date: d.eventDate,
        event_time: d.eventTime || null,
        date_type: d.dateType,
        is_tentative: d.isTentative || false,
        display_order: d.displayOrder || idx + 1,
      }));

      const { error: datesError } = await supabase.from("exam_important_dates").insert(datesToInsert as any);
      if (datesError) throw new Error(`Failed to save important dates: ${datesError.message}`);
    }

    // 6. Manage Exam Centers
    await supabase.from("exam_centers").delete().eq("exam_id", examId);
    if (validated.centers && validated.centers.length > 0) {
      const centersToInsert = validated.centers.map((c) => ({
        id: c.id || crypto.randomUUID(),
        exam_id: examId,
        state_code: c.stateCode || null,
        city_name: c.cityName,
        center_code: c.centerCode || null,
        is_active: c.isActive !== false,
      }));

      const { error: centerError } = await supabase.from("exam_centers").insert(centersToInsert as any);
      if (centerError) throw new Error(`Failed to save exam centers: ${centerError.message}`);
    }

    // 7. Manage Official Documents
    await supabase.from("exam_official_documents").delete().eq("exam_id", examId);
    if (validated.officialDocuments && validated.officialDocuments.length > 0) {
      const docsToInsert = validated.officialDocuments.map((doc) => ({
        id: doc.id || crypto.randomUUID(),
        exam_id: examId,
        title: doc.title,
        file_url: doc.fileUrl,
        document_type: doc.documentType || "circular",
        file_size_bytes: doc.fileSizeBytes || null,
        published_date: doc.publishedDate || null,
      }));

      const { error: docsError } = await supabase.from("exam_official_documents").insert(docsToInsert as any);
      if (docsError) throw new Error(`Failed to save official documents: ${docsError.message}`);
    }

    // 8. Audit Trail Logging
    await supabase.from("audit_logs").insert({
      admin_id: admin.id,
      entity_type: "gov_exams",
      entity_id: examId,
      action: isUpdate ? "UPDATE" : "CREATE",
      changes_summary: `${isUpdate ? "Updated" : "Created"} examination notice: "${validated.title}" (${validated.status})`,
      metadata: { slug: validated.slug, status: validated.status, mode: validated.mode },
    } as any);

    // Revalidate paths
    revalidatePath("/exams");
    revalidatePath(`/exams/${validated.slug}`);
    revalidatePath("/admin/exams");
    revalidatePath("/sitemap.xml");

    return {
      success: true,
      data: { id: examId, slug: validated.slug },
    };
  } catch (error: any) {
    console.error("saveExamAction error:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred while saving the examination notice.",
    };
  }
}

/**
 * Toggles status (e.g. published, draft, archived) of an exam notice.
 */
export async function toggleExamStatusAction(
  id: string,
  newStatus: "draft" | "published" | "archived"
): Promise<ActionResponse> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    const updateData: Record<string, any> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { data: exam, error } = await (supabase.from("gov_exams") as any)
      .update(updateData)
      .eq("id", id)
      .select("title, slug")
      .single();

    if (error) throw new Error(error.message);

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      entity_type: "gov_exams",
      entity_id: id,
      action: "UPDATE_STATUS",
      changes_summary: `Changed examination status to "${newStatus}" for "${exam?.title}"`,
      metadata: { newStatus },
    });

    revalidatePath("/exams");
    revalidatePath(`/exams/${exam?.slug}`);
    revalidatePath("/admin/exams");
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update status" };
  }
}

/**
 * Soft deletes an exam notice.
 */
export async function softDeleteExamAction(id: string): Promise<ActionResponse> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    const { data: exam, error } = await (supabase.from("gov_exams") as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .select("title, slug")
      .single();

    if (error) throw new Error(error.message);

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      entity_type: "gov_exams",
      entity_id: id,
      action: "SOFT_DELETE",
      changes_summary: `Moved examination "${exam?.title}" to trash`,
    });

    revalidatePath("/exams");
    revalidatePath(`/exams/${exam?.slug}`);
    revalidatePath("/admin/exams");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete examination" };
  }
}

/**
 * Restores a soft-deleted exam notice from trash.
 */
export async function restoreExamAction(id: string): Promise<ActionResponse> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    const { data: exam, error } = await (supabase.from("gov_exams") as any)
      .update({ deleted_at: null })
      .eq("id", id)
      .select("title, slug")
      .single();

    if (error) throw new Error(error.message);

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      entity_type: "gov_exams",
      entity_id: id,
      action: "RESTORE",
      changes_summary: `Restored examination "${exam?.title}" from trash`,
    });

    revalidatePath("/exams");
    revalidatePath(`/exams/${exam?.slug}`);
    revalidatePath("/admin/exams");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to restore examination" };
  }
}

/**
 * Bulk action on multiple exams (publish, archive, soft-delete).
 */
export async function bulkExamAction(
  ids: string[],
  action: "publish" | "archive" | "trash" | "restore"
): Promise<ActionResponse> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    let updateData: Record<string, any> = { updated_at: new Date().toISOString() };

    if (action === "publish") {
      updateData.status = "published";
      updateData.published_at = new Date().toISOString();
      updateData.deleted_at = null;
    } else if (action === "archive") {
      updateData.status = "archived";
    } else if (action === "trash") {
      updateData.deleted_at = new Date().toISOString();
    } else if (action === "restore") {
      updateData.deleted_at = null;
    }

    const { error } = await (supabase.from("gov_exams") as any).update(updateData).in("id", ids);

    if (error) throw new Error(error.message);

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      entity_type: "gov_exams",
      action: `BULK_${action.toUpperCase()}`,
      changes_summary: `Performed bulk ${action} on ${ids.length} examinations`,
      metadata: { count: ids.length, ids },
    });

    revalidatePath("/exams");
    revalidatePath("/admin/exams");
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to perform bulk action" };
  }
}
