import { createClient } from "@/lib/supabase/server";
import { GovJob, GovJobDetailed, JobFilterParams, JobVacancy, JobImportantDate, JobEligibility, JobOfficialDocument } from "./types";
import { GovJobInput } from "./schemas";
import { Organization, Category, StateUT, Department, Qualification } from "@/modules/core/types";
import { slugify } from "@/lib/utils";

/**
 * Fetch published government job notices with multi-faceted filtering for public views.
 */
export async function getPublicJobs(params: JobFilterParams = {}): Promise<{
  jobs: GovJobDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 12));
  const offset = (page - 1) * limit;

  let query = (supabase.from("gov_jobs") as any)
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*)
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false });

  // Filter by Category Slug
  if (params.categorySlug) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.categorySlug)
      .single();

    const cat = catData as { id: string } | null;
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  // Filter by Organization Slug
  if (params.organizationSlug) {
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", params.organizationSlug)
      .single();

    const org = orgData as { id: string } | null;
    if (org) {
      query = query.eq("organization_id", org.id);
    }
  }

  // Filter by Qualification Slug
  if (params.qualificationSlug) {
    const { data: qualData } = await (supabase.from("qualifications") as any)
      .select("id")
      .eq("slug", params.qualificationSlug)
      .single();

    const qual = qualData as { id: string } | null;
    if (qual) {
      query = query.eq("min_qualification_id", qual.id);
    }
  }

  // Filter by State Code
  if (params.stateCode) {
    query = query.eq("state_code", params.stateCode);
  }

  // Filter by Employment Type
  if (params.employmentType) {
    query = query.eq("employment_type", params.employmentType);
  }

  // Filter by Featured flag
  if (params.isFeatured !== undefined) {
    query = query.eq("is_featured", params.isFeatured);
  }

  // Search by keyword in title or notification number
  if (params.search) {
    const searchTerm = `%${params.search.trim()}%`;
    query = query.or(`title.ilike.${searchTerm},notification_number.ilike.${searchTerm}`);
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching public jobs:", error);
    return { jobs: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    jobs: (data || []) as GovJobDetailed[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch a single published job notice with all associated sub-tables by unique slug.
 */
export async function getPublicJobBySlug(slug: string): Promise<GovJobDetailed | null> {
  const supabase = await createClient();

  const { data: job, error } = await (supabase.from("gov_jobs") as any)
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*),
      vacancies:job_vacancies(*),
      important_dates:job_important_dates(*),
      eligibility:job_eligibility(*),
      official_documents:job_official_documents(*)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (error || !job) {
    return null;
  }

  const rawJob = job as any;
  const detailedJob: GovJobDetailed = {
    ...rawJob,
    vacancies: (rawJob.vacancies || []) as JobVacancy[],
    important_dates: ((rawJob.important_dates || []) as JobImportantDate[]).sort(
      (a: JobImportantDate, b: JobImportantDate) => a.display_order - b.display_order
    ),
    eligibility: Array.isArray(rawJob.eligibility) ? rawJob.eligibility[0] : (rawJob.eligibility as JobEligibility),
    official_documents: (rawJob.official_documents || []) as JobOfficialDocument[],
  };

  return detailedJob;
}

/**
 * Fetch active taxonomies (categories, organizations, departments, qualifications, states) for filter sidebars and forms.
 */
export async function getJobTaxonomies(): Promise<{
  categories: Category[];
  organizations: Organization[];
  departments: Department[];
  qualifications: Qualification[];
  states: StateUT[];
}> {
  const supabase = await createClient();

  const [categoriesRes, organizationsRes, departmentsRes, qualificationsRes, statesRes] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("display_order", { ascending: true }),
    supabase.from("organizations").select("*").eq("is_active", true).order("name", { ascending: true }),
    (supabase.from("departments") as any).select("*").eq("is_active", true).order("name", { ascending: true }),
    (supabase.from("qualifications") as any).select("*").eq("is_active", true).order("display_order", { ascending: true }),
    supabase.from("states_uts").select("*").eq("is_active", true).order("name", { ascending: true }),
  ]);

  return {
    categories: (categoriesRes.data || []) as Category[],
    organizations: (organizationsRes.data || []) as Organization[],
    departments: (departmentsRes.data || []) as Department[],
    qualifications: (qualificationsRes.data || []) as Qualification[],
    states: (statesRes.data || []) as StateUT[],
  };
}

/**
 * Fetch all jobs for Admin management console (including draft, archived, and soft-deleted/trash).
 */
export async function getAdminJobs(params: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  jobs: GovJobDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 15));
  const offset = (page - 1) * limit;

  let query = (supabase.from("gov_jobs") as any)
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (params.status === "trash") {
    query = query.not("deleted_at", "is", null);
  } else {
    query = query.is("deleted_at", null);
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }
  }

  if (params.search) {
    const searchTerm = `%${params.search.trim()}%`;
    query = query.or(`title.ilike.${searchTerm},notification_number.ilike.${searchTerm}`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching admin jobs:", error);
    return { jobs: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    jobs: (data || []) as GovJobDetailed[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch a single job by ID for Admin editing.
 */
export async function getAdminJobById(id: string): Promise<GovJobDetailed | null> {
  const supabase = await createClient();

  const { data: job, error } = await (supabase.from("gov_jobs") as any)
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*),
      vacancies:job_vacancies(*),
      important_dates:job_important_dates(*),
      eligibility:job_eligibility(*),
      official_documents:job_official_documents(*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !job) {
    return null;
  }

  const rawJob = job as any;
  return {
    ...rawJob,
    vacancies: (rawJob.vacancies || []) as JobVacancy[],
    important_dates: ((rawJob.important_dates || []) as JobImportantDate[]).sort(
      (a: JobImportantDate, b: JobImportantDate) => a.display_order - b.display_order
    ),
    eligibility: Array.isArray(rawJob.eligibility) ? rawJob.eligibility[0] : (rawJob.eligibility as JobEligibility),
    official_documents: (rawJob.official_documents || []) as JobOfficialDocument[],
  } as GovJobDetailed;
}
