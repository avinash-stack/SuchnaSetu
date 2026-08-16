"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { GovJobInput, govJobSchema } from "./schemas";

export interface SaveJobPayload {
  id?: string;
  title: string;
  slug?: string;
  notificationNumber?: string;
  organizationId: string;
  departmentId?: string | null;
  categoryId: string;
  minQualificationId?: string | null;
  stateCode?: string;
  employmentType: "permanent" | "contract" | "deputation" | "apprenticeship";
  totalVacancies: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  payScaleDetails?: string;
  officialNotificationUrl: string;
  officialApplyUrl?: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  summary?: string;
  metaTitle?: string;
  metaDescription?: string;
  applicationStartDate?: string | null;
  applicationEndDate?: string | null;
  vacancies?: Array<{
    id?: string;
    postName: string;
    postCode?: string;
    totalPosts: number;
    urPosts?: number;
    ewsPosts?: number;
    obcPosts?: number;
    scPosts?: number;
    stPosts?: number;
    pwdPosts?: number;
    payLevel?: string;
  }>;
  importantDates?: Array<{
    id?: string;
    eventName: string;
    eventDate?: string | null;
    eventDateText?: string;
    isTentative?: boolean;
    displayOrder?: number;
  }>;
  eligibility?: {
    id?: string;
    minAge?: number | null;
    maxAge?: number | null;
    ageCalculationDate?: string | null;
    ageRelaxationDetails?: string;
    educationQualification: string;
    experienceDetails?: string;
    selectionProcess?: string;
    applicationFeeDetails?: any;
  };
  officialDocuments?: Array<{
    id?: string;
    documentType: "full_notification" | "short_notice" | "corrigendum" | "syllabus" | "admit_card_notice" | "result_notice";
    title: string;
    fileUrl: string;
    fileSizeBytes?: number;
    publishedDate?: string;
  }>;
}

/**
 * Server Action: Create or Update a Government Job notice with its sub-entities and audit logging.
 */
export async function saveJobNoticeAction(payload: SaveJobPayload): Promise<{
  success: boolean;
  jobId?: string;
  error?: string;
}> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    // Generate unique slug if not provided or updated
    let slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
    if (!slug) {
      slug = `notice-${Date.now()}`;
    }

    const isUpdate = Boolean(payload.id);
    let jobId = payload.id;

    // Check slug uniqueness
    let slugCheckQuery = (supabase.from("gov_jobs") as any).select("id").eq("slug", slug);
    if (isUpdate && jobId) {
      slugCheckQuery = slugCheckQuery.neq("id", jobId);
    }
    const { data: existingSlug } = await slugCheckQuery;
    if (existingSlug && existingSlug.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const jobData: any = {
      title: payload.title,
      slug,
      notification_number: payload.notificationNumber || null,
      organization_id: payload.organizationId,
      department_id: payload.departmentId || null,
      category_id: payload.categoryId,
      min_qualification_id: payload.minQualificationId || null,
      state_code: payload.stateCode || null,
      employment_type: payload.employmentType,
      total_vacancies: payload.totalVacancies,
      salary_min: payload.salaryMin || null,
      salary_max: payload.salaryMax || null,
      pay_scale_details: payload.payScaleDetails || null,
      official_notification_url: payload.officialNotificationUrl,
      official_apply_url: payload.officialApplyUrl || null,
      status: payload.status,
      is_featured: payload.isFeatured,
      summary: payload.summary || null,
      meta_title: payload.metaTitle || null,
      meta_description: payload.metaDescription || null,
      application_start_date: payload.applicationStartDate || null,
      application_end_date: payload.applicationEndDate || null,
    };

    if (payload.status === "published" && !isUpdate) {
      jobData.published_at = new Date().toISOString();
    }

    if (isUpdate && jobId) {
      const { error: updateError } = await (supabase.from("gov_jobs") as any)
        .update(jobData)
        .eq("id", jobId);

      if (updateError) throw updateError;
    } else {
      const { data: newJob, error: insertError } = await (supabase.from("gov_jobs") as any)
        .insert(jobData)
        .select("id")
        .single();

      if (insertError) throw insertError;
      jobId = (newJob as any).id;
    }

    if (!jobId) throw new Error("Failed to resolve Job ID");

    // Replace / Sync Sub-entities
    if (payload.vacancies) {
      await (supabase.from("job_vacancies") as any).delete().eq("job_id", jobId);
      if (payload.vacancies.length > 0) {
        const vacanciesToInsert = payload.vacancies.map((v) => ({
          job_id: jobId as string,
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
    }

    if (payload.importantDates) {
      await (supabase.from("job_important_dates") as any).delete().eq("job_id", jobId);
      if (payload.importantDates.length > 0) {
        const datesToInsert = payload.importantDates.map((d, index) => ({
          job_id: jobId as string,
          event_name: d.eventName,
          event_date: d.eventDate || null,
          event_date_text: d.eventDateText || null,
          is_tentative: Boolean(d.isTentative),
          display_order: d.displayOrder ?? index,
        }));
        await (supabase.from("job_important_dates") as any).insert(datesToInsert);
      }
    }

    if (payload.eligibility) {
      await (supabase.from("job_eligibility") as any).delete().eq("job_id", jobId);
      await (supabase.from("job_eligibility") as any).insert({
        job_id: jobId,
        min_age: payload.eligibility.minAge || null,
        max_age: payload.eligibility.maxAge || null,
        age_calculation_date: payload.eligibility.ageCalculationDate || null,
        age_relaxation_details: payload.eligibility.ageRelaxationDetails || null,
        education_qualification: payload.eligibility.educationQualification || "As per official notification",
        experience_details: payload.eligibility.experienceDetails || null,
        selection_process: payload.eligibility.selectionProcess || null,
        application_fee_details: payload.eligibility.applicationFeeDetails || null,
      });
    }

    if (payload.officialDocuments) {
      await (supabase.from("job_official_documents") as any).delete().eq("job_id", jobId);
      if (payload.officialDocuments.length > 0) {
        const docsToInsert = payload.officialDocuments.map((doc) => ({
          job_id: jobId as string,
          document_type: doc.documentType,
          title: doc.title,
          file_url: doc.fileUrl,
          file_size_bytes: doc.fileSizeBytes || null,
          published_date: doc.publishedDate || null,
        }));
        await (supabase.from("job_official_documents") as any).insert(docsToInsert);
      }
    }

    // Record Audit Log
    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: isUpdate ? "UPDATE_JOB_NOTICE" : "CREATE_JOB_NOTICE",
      entity_type: "gov_jobs",
      entity_id: jobId,
      metadata: {
        title: payload.title,
        slug,
        status: payload.status,
      },
    });

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${slug}`);
    revalidatePath("/admin/jobs");
    revalidatePath("/admin");

    return { success: true, jobId };
  } catch (error: any) {
    console.error("Save job error:", error);
    return { success: false, error: error?.message || "Failed to save job notice" };
  }
}

/**
 * Server Action: Toggle publication status of a notice.
 */
export async function toggleJobPublishAction(
  jobId: string,
  newStatus: "draft" | "published" | "archived"
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const updateData: any = {
      status: newStatus,
    };
    if (newStatus === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await (supabase.from("gov_jobs") as any)
      .update(updateData)
      .eq("id", jobId);

    if (error) throw error;

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: `SET_STATUS_${newStatus.toUpperCase()}`,
      entity_type: "gov_jobs",
      entity_id: jobId,
    });

    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update notice status" };
  }
}

/**
 * Server Action: Soft Delete a job notice (moves to Trash).
 */
export async function softDeleteJobAction(jobId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { error } = await (supabase.from("gov_jobs") as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", jobId);

    if (error) throw error;

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: "SOFT_DELETE_JOB_NOTICE",
      entity_type: "gov_jobs",
      entity_id: jobId,
    });

    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to soft delete notice" };
  }
}

/**
 * Server Action: Restore a soft-deleted job notice.
 */
export async function restoreJobAction(jobId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { error } = await (supabase.from("gov_jobs") as any)
      .update({ deleted_at: null })
      .eq("id", jobId);

    if (error) throw error;

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: "RESTORE_JOB_NOTICE",
      entity_type: "gov_jobs",
      entity_id: jobId,
    });

    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to restore notice" };
  }
}

/**
 * Server Action: Permanently Delete a job notice.
 */
export async function deleteJobAction(jobId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { error } = await (supabase.from("gov_jobs") as any).delete().eq("id", jobId);
    if (error) throw error;

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: "PERMANENT_DELETE_JOB_NOTICE",
      entity_type: "gov_jobs",
      entity_id: jobId,
    });

    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to permanently delete notice" };
  }
}
