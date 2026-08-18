import { createClient } from "@/lib/supabase/server";
import { GovExam, GovExamDetailed, ExamFilterParams } from "./types";
import { Category, Organization, StateUT, Department, Qualification } from "@/modules/core/types";

/**
 * Fetches published examinations with multi-faceted filtering, search, and pagination.
 */
export async function getPublicExams(params: ExamFilterParams = {}) {
  const supabase = await createClient();
  const page = params.page || 1;
  const limit = params.limit || 12;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      state:states_uts(*),
      stages:exam_stages(*),
      important_dates:exam_important_dates(*)
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .is("deleted_at", null);

  if (params.search && params.search.trim()) {
    const cleanTerm = params.search.replace(/[,()]/g, " ").trim();
    if (cleanTerm) {
      const term = `%${cleanTerm}%`;
      query = query.or(
        `title.ilike.${term},short_title.ilike.${term},description.ilike.${term},exam_code.ilike.${term},slug.ilike.${term}`
      );
    }
  }

  if (params.mode) {
    query = query.eq("mode", params.mode);
  }

  if (params.frequency) {
    query = query.eq("frequency", params.frequency);
  }

  if (params.stateCode) {
    query = query.eq("state_code", params.stateCode);
  }

  if (params.isFeatured !== undefined) {
    query = query.eq("is_featured", params.isFeatured);
  }

  // Filter by category slug
  if (params.categorySlug) {
    const { data: cat } = (await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.categorySlug)
      .single()) as any;
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  // Filter by organization slug
  if (params.organizationSlug) {
    const { data: org } = (await supabase
      .from("organizations")
      .select("id")
      .eq("slug", params.organizationSlug)
      .single()) as any;
    if (org) {
      query = query.eq("organization_id", org.id);
    }
  }

  // Order by is_featured and published_at DESC
  query = query
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching public exams:", error);
    return { exams: [], total: 0, totalPages: 0 };
  }

  return {
    exams: (data as unknown as GovExamDetailed[]) || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Fetches a single public examination by slug with all nested relations.
 */
export async function getPublicExamBySlug(slug: string): Promise<GovExamDetailed | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      state:states_uts(*),
      related_job:gov_jobs(*),
      stages:exam_stages(*),
      schedules:exam_schedules(*),
      eligibility:exam_eligibility(*, min_qualification:qualifications(*)),
      important_dates:exam_important_dates(*),
      centers:exam_centers(*),
      official_documents:exam_official_documents(*)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    return null;
  }

  const detailed = data as unknown as GovExamDetailed;

  // Sort stages by stage_order
  if (detailed.stages) {
    detailed.stages.sort((a, b) => a.stage_order - b.stage_order);
  }

  // Sort important dates by event_date
  if (detailed.important_dates) {
    detailed.important_dates.sort((a, b) => {
      if (a.display_order !== b.display_order) return a.display_order - b.display_order;
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });
  }

  // Sort schedules by exam_date and start_time
  if (detailed.schedules) {
    detailed.schedules.sort((a, b) => {
      const dateDiff = new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return (a.start_time || "").localeCompare(b.start_time || "");
    });
  }

  return detailed;
}

/**
 * Fetches related exams from the same organization or category.
 */
export async function getRelatedExams(organizationId: string, currentExamId: string, limit = 4) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(*),
      stages:exam_stages(*)
    `
    )
    .eq("organization_id", organizationId)
    .eq("status", "published")
    .is("deleted_at", null)
    .neq("id", currentExamId)
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data as unknown as GovExamDetailed[]) || [];
}

/**
 * Fetches exams for administrative console with status filters, search, and soft delete tabs.
 */
export async function getAdminExams(
  params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const supabase = await createClient();
  const page = params.page || 1;
  const limit = params.limit || 15;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(name, acronym),
      department:departments(name, acronym),
      stages:exam_stages(id, stage_name, status)
    `,
      { count: "exact" }
    );

  if (params.status === "trash") {
    query = query.not("deleted_at", "is", null);
  } else {
    query = query.is("deleted_at", null);
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }
  }

  if (params.search && params.search.trim()) {
    const cleanTerm = params.search.replace(/[,()]/g, " ").trim();
    if (cleanTerm) {
      const term = `%${cleanTerm}%`;
      query = query.or(
        `title.ilike.${term},short_title.ilike.${term},slug.ilike.${term},exam_code.ilike.${term},description.ilike.${term}`
      );
    }
  }

  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching admin exams:", error);
    return { exams: [], total: 0, totalPages: 0 };
  }

  return {
    exams: data || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Fetches a single exam for editing in the administrative console.
 */
export async function getAdminExamById(id: string): Promise<GovExamDetailed | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      state:states_uts(*),
      related_job:gov_jobs(*),
      stages:exam_stages(*),
      schedules:exam_schedules(*),
      eligibility:exam_eligibility(*, min_qualification:qualifications(*)),
      important_dates:exam_important_dates(*),
      centers:exam_centers(*),
      official_documents:exam_official_documents(*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const detailed = data as unknown as GovExamDetailed;

  if (detailed.stages) {
    detailed.stages.sort((a, b) => a.stage_order - b.stage_order);
  }
  if (detailed.important_dates) {
    detailed.important_dates.sort((a, b) => a.display_order - b.display_order);
  }

  return detailed;
}

/**
 * Fetches master taxonomies required for filters and examination forms.
 */
export async function getExamTaxonomies() {
  const supabase = await createClient();

  const [categoriesRes, orgsRes, deptsRes, qualsRes, statesRes, jobsRes] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("organizations").select("*").eq("is_active", true).order("name"),
    supabase.from("departments").select("*").eq("is_active", true).order("name"),
    supabase.from("qualifications").select("*").eq("is_active", true).order("display_order"),
    supabase.from("states_uts").select("*").eq("is_active", true).order("name"),
    supabase.from("gov_jobs").select("id, title, slug, organization_id").is("deleted_at", null).order("title"),
  ]);

  return {
    categories: (categoriesRes.data as Category[]) || [],
    organizations: (orgsRes.data as Organization[]) || [],
    departments: (deptsRes.data as Department[]) || [],
    qualifications: (qualsRes.data as Qualification[]) || [],
    states: (statesRes.data as StateUT[]) || [],
    jobs: jobsRes.data || [],
  };
}
