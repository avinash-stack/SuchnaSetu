import { createClient } from "@/lib/supabase/server";
import { GovJobDetailed, JobFilterParams } from "@/modules/jobs/types";
import { GovExamDetailed, ExamFilterParams } from "@/modules/exams/types";
import { PublicBulletinDetailed, BulletinFilterParams } from "@/modules/bulletins/types";
import { ParsedSearchQuery, GlobalSearchResult } from "./types";
import { parseSearchQuery } from "./query-parser";

/**
 * Cached/in-memory helper to resolve matching organization IDs and category IDs
 * for cross-entity search enhancement.
 */
async function resolveTaxonomyMatches(parsed: ParsedSearchQuery) {
  const supabase = await createClient();

  const [orgsRes, catsRes] = await Promise.all([
    (supabase.from("organizations") as any).select("id, name, acronym, slug, state_code").eq("is_active", true),
    (supabase.from("categories") as any).select("id, name, slug").eq("is_active", true),
  ]);

  const allOrgs = (orgsRes.data || []) as Array<{ id: string; name: string; acronym: string | null; slug: string; state_code: string | null }>;
  const allCats = (catsRes.data || []) as Array<{ id: string; name: string; slug: string }>;

  const matchedOrgIds = new Set<string>();
  const matchedCatIds = new Set<string>();

  // Match organizations by acronym, slug, or tokens in name
  for (const org of allOrgs) {
    const orgAcronym = (org.acronym || "").toLowerCase();
    const orgName = (org.name || "").toLowerCase();
    const orgSlug = (org.slug || "").toLowerCase();

    // Check if query matched org keywords or direct tokens
    for (const kw of parsed.matchedOrgKeywords) {
      if (orgAcronym === kw || orgSlug.includes(kw) || orgName.includes(kw)) {
        matchedOrgIds.add(org.id);
      }
    }

    for (const token of parsed.contentTokens) {
      if (token.length >= 2 && (orgAcronym === token || orgName.includes(token))) {
        matchedOrgIds.add(org.id);
      }
    }
  }

  // Match categories by slug or tokens in name
  for (const cat of allCats) {
    const catSlug = (cat.slug || "").toLowerCase();
    const catName = (cat.name || "").toLowerCase();

    for (const slug of parsed.matchedCategorySlugs) {
      if (catSlug === slug || catSlug.includes(slug)) {
        matchedCatIds.add(cat.id);
      }
    }

    for (const token of parsed.contentTokens) {
      if (token.length >= 3 && catName.includes(token)) {
        matchedCatIds.add(cat.id);
      }
    }
  }

  return {
    matchedOrgIds: Array.from(matchedOrgIds),
    matchedCatIds: Array.from(matchedCatIds),
  };
}

/**
 * Calculates a relevance score for a GovJob entity.
 */
function rankJobItem(job: GovJobDetailed, parsed: ParsedSearchQuery): number {
  if (!parsed.cleanQuery) return 0;

  let score = 0;
  const lowerQuery = parsed.cleanQuery.toLowerCase();
  const title = (job.title || "").toLowerCase();
  const summary = (job.summary || "").toLowerCase();
  const notif = (job.notification_number || "").toLowerCase();
  const orgName = (job.organization?.name || "").toLowerCase();
  const orgAcronym = (job.organization?.acronym || "").toLowerCase();
  const catName = (job.category?.name || "").toLowerCase();
  const catSlug = (job.category?.slug || "").toLowerCase();
  const stateCode = (job.state_code || "").toUpperCase();

  // 1. Exact phrase matches
  if (title.includes(lowerQuery)) score += 100;
  if (summary.includes(lowerQuery)) score += 40;
  if (orgName.includes(lowerQuery)) score += 60;

  // 2. Token-level matches
  for (const token of parsed.contentTokens) {
    if (title.includes(token)) score += 30;
    if (orgAcronym === token) score += 50;
    if (orgName.includes(token)) score += 25;
    if (catName.includes(token) || catSlug.includes(token)) score += 25;
    if (notif.includes(token)) score += 35;
    if (summary.includes(token)) score += 10;
  }

  // 3. State matches
  for (const sc of parsed.matchedStateCodes) {
    if (stateCode === sc.toUpperCase()) score += 45;
  }

  // 4. Vacancies post names match
  if (job.vacancies && Array.isArray(job.vacancies)) {
    for (const vac of job.vacancies) {
      const pName = (vac.post_name || "").toLowerCase();
      if (pName.includes(lowerQuery)) score += 50;
      for (const token of parsed.contentTokens) {
        if (pName.includes(token)) score += 20;
      }
    }
  }

  // 5. Featured / freshness boost
  if (job.is_featured) score += 5;

  return score;
}

/**
 * Calculates a relevance score for a GovExam entity.
 */
function rankExamItem(exam: GovExamDetailed, parsed: ParsedSearchQuery): number {
  if (!parsed.cleanQuery) return 0;

  let score = 0;
  const lowerQuery = parsed.cleanQuery.toLowerCase();
  const title = (exam.title || "").toLowerCase();
  const shortTitle = (exam.short_title || "").toLowerCase();
  const desc = (exam.description || "").toLowerCase();
  const examCode = (exam.exam_code || "").toLowerCase();
  const orgName = (exam.organization?.name || "").toLowerCase();
  const orgAcronym = (exam.organization?.acronym || "").toLowerCase();
  const catName = (exam.category?.name || "").toLowerCase();
  const stateCode = (exam.state_code || "").toUpperCase();

  // 1. Exact phrase matches
  if (title.includes(lowerQuery)) score += 100;
  if (shortTitle.includes(lowerQuery)) score += 80;
  if (examCode.includes(lowerQuery)) score += 70;
  if (desc.includes(lowerQuery)) score += 30;
  if (orgName.includes(lowerQuery)) score += 50;

  // 2. Token-level matches
  for (const token of parsed.contentTokens) {
    if (title.includes(token)) score += 30;
    if (shortTitle.includes(token)) score += 25;
    if (orgAcronym === token) score += 50;
    if (orgName.includes(token)) score += 25;
    if (examCode.includes(token)) score += 35;
    if (catName.includes(token)) score += 25;
    if (desc.includes(token)) score += 10;
  }

  // 3. State matches
  for (const sc of parsed.matchedStateCodes) {
    if (stateCode === sc.toUpperCase()) score += 45;
  }

  if (exam.is_featured) score += 5;

  return score;
}

/**
 * Calculates a relevance score for a PublicBulletin entity.
 */
function rankBulletinItem(bulletin: PublicBulletinDetailed, parsed: ParsedSearchQuery): number {
  if (!parsed.cleanQuery) return 0;

  let score = 0;
  const lowerQuery = parsed.cleanQuery.toLowerCase();
  const title = (bulletin.title || "").toLowerCase();
  const summary = (bulletin.summary || "").toLowerCase();
  const sourceName = (bulletin.source_name || "").toLowerCase();
  const category = (bulletin.category || "").toLowerCase();

  // 1. Exact phrase matches
  if (title.includes(lowerQuery)) score += 100;
  if (summary.includes(lowerQuery)) score += 40;
  if (sourceName.includes(lowerQuery)) score += 40;

  // 2. Token-level matches
  for (const token of parsed.contentTokens) {
    if (title.includes(token)) score += 30;
    if (summary.includes(token)) score += 15;
    if (sourceName.includes(token)) score += 20;
    if (category.includes(token)) score += 20;
  }

  if (bulletin.is_breaking) score += 10;

  return score;
}

/**
 * Intelligent Job Search Engine
 * Preserves all existing filters, handles multi-word / tokenized search, cross-entity matching, and ranking.
 */
export async function searchJobs(params: JobFilterParams = {}): Promise<{
  jobs: GovJobDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 12));
  const offset = (page - 1) * limit;

  let query = (supabase.from("gov_jobs") as any)
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*),
      vacancies:job_vacancies(*),
      important_dates:job_important_dates(*)
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .is("deleted_at", null);

  // Apply explicit taxonomy filters
  if (params.stateCode) {
    query = query.eq("state_code", params.stateCode);
  }
  if (params.employmentType) {
    query = query.eq("employment_type", params.employmentType);
  }
  if (params.isFeatured !== undefined) {
    query = query.eq("is_featured", params.isFeatured);
  }
  if (params.categorySlug) {
    const { data: cat } = await (supabase.from("categories") as any)
      .select("id")
      .eq("slug", params.categorySlug)
      .maybeSingle();
    if (cat) query = query.eq("category_id", (cat as any).id);
  }
  if (params.organizationSlug) {
    const { data: org } = await (supabase.from("organizations") as any)
      .select("id")
      .eq("slug", params.organizationSlug)
      .maybeSingle();
    if (org) query = query.eq("organization_id", (org as any).id);
  }
  if (params.qualificationSlug) {
    const { data: qual } = await (supabase.from("qualifications") as any)
      .select("id")
      .eq("slug", params.qualificationSlug)
      .maybeSingle();
    if (qual) query = query.eq("qualification_id", (qual as any).id);
  }

  const hasSearch = !!(params.search && params.search.trim());

  if (hasSearch) {
    const parsed = parseSearchQuery(params.search);
    const { matchedOrgIds, matchedCatIds } = await resolveTaxonomyMatches(parsed);

    const orClauses: string[] = [];

    // Full phrase match on key fields
    if (parsed.cleanQuery) {
      orClauses.push(`title.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`summary.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`slug.ilike.%${parsed.cleanQuery}%`);
    }

    // Individual token matches
    for (const token of parsed.contentTokens) {
      orClauses.push(`title.ilike.%${token}%`);
      orClauses.push(`summary.ilike.%${token}%`);
      orClauses.push(`notification_number.ilike.%${token}%`);
      orClauses.push(`slug.ilike.%${token}%`);
    }

    // Matched taxonomy entities
    if (parsed.matchedStateCodes.length > 0) {
      orClauses.push(`state_code.in.(${parsed.matchedStateCodes.join(",")})`);
    }
    if (matchedOrgIds.length > 0) {
      orClauses.push(`organization_id.in.(${matchedOrgIds.join(",")})`);
    }
    if (matchedCatIds.length > 0) {
      orClauses.push(`category_id.in.(${matchedCatIds.join(",")})`);
    }

    const uniqueClauses = Array.from(new Set(orClauses)).filter(Boolean);
    if (uniqueClauses.length > 0) {
      query = query.or(uniqueClauses.join(","));
    }

    // Fetch candidate pool for relevance ranking (up to 100 items for high-relevance search)
    const candidateLimit = Math.max(limit * 3, 50);
    query = query.order("published_at", { ascending: false }).limit(candidateLimit);

    const { data, count, error } = await query;
    if (error) {
      console.error("Error searching public jobs:", error);
      return { jobs: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data || []) as GovJobDetailed[];

    // In-memory relevance ranking
    const scored = items.map((item) => ({
      item,
      score: rankJobItem(item, parsed),
    }));

    // Sort by score descending, then published_at descending
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const bDate = new Date(b.item.published_at || "").getTime();
      const aDate = new Date(a.item.published_at || "").getTime();
      return bDate - aDate;
    });

    const total = count || scored.length;
    const paginatedItems = scored.slice(offset, offset + limit).map((s) => s.item);
    const totalPages = Math.ceil(total / limit);

    return {
      jobs: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Standard non-search paginated query
  query = query.order("published_at", { ascending: false }).range(offset, offset + limit - 1);

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
 * Intelligent Examination Search Engine
 * Preserves all existing filters, handles multi-word / tokenized search, cross-entity matching, and ranking.
 */
export async function searchExams(params: ExamFilterParams = {}): Promise<{
  exams: GovExamDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 12));
  const offset = (page - 1) * limit;

  let query = (supabase.from("gov_exams") as any)
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

  // Apply explicit filters
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
  if (params.categorySlug) {
    const { data: cat } = await (supabase.from("categories") as any)
      .select("id")
      .eq("slug", params.categorySlug)
      .maybeSingle();
    if (cat) query = query.eq("category_id", (cat as any).id);
  }
  if (params.organizationSlug) {
    const { data: org } = await (supabase.from("organizations") as any)
      .select("id")
      .eq("slug", params.organizationSlug)
      .maybeSingle();
    if (org) query = query.eq("organization_id", (org as any).id);
  }

  const hasSearch = !!(params.search && params.search.trim());

  if (hasSearch) {
    const parsed = parseSearchQuery(params.search);
    const { matchedOrgIds, matchedCatIds } = await resolveTaxonomyMatches(parsed);

    const orClauses: string[] = [];

    // Full phrase match
    if (parsed.cleanQuery) {
      orClauses.push(`title.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`short_title.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`description.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`exam_code.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`slug.ilike.%${parsed.cleanQuery}%`);
    }

    // Individual token matches
    for (const token of parsed.contentTokens) {
      orClauses.push(`title.ilike.%${token}%`);
      orClauses.push(`short_title.ilike.%${token}%`);
      orClauses.push(`description.ilike.%${token}%`);
      orClauses.push(`exam_code.ilike.%${token}%`);
      orClauses.push(`slug.ilike.%${token}%`);
    }

    // Matched taxonomies
    if (parsed.matchedStateCodes.length > 0) {
      orClauses.push(`state_code.in.(${parsed.matchedStateCodes.join(",")})`);
    }
    if (matchedOrgIds.length > 0) {
      orClauses.push(`organization_id.in.(${matchedOrgIds.join(",")})`);
    }
    if (matchedCatIds.length > 0) {
      orClauses.push(`category_id.in.(${matchedCatIds.join(",")})`);
    }

    const uniqueClauses = Array.from(new Set(orClauses)).filter(Boolean);
    if (uniqueClauses.length > 0) {
      query = query.or(uniqueClauses.join(","));
    }

    const candidateLimit = Math.max(limit * 3, 50);
    query = query.order("published_at", { ascending: false }).limit(candidateLimit);

    const { data, count, error } = await query;
    if (error) {
      console.error("Error searching public exams:", error);
      return { exams: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data || []) as GovExamDetailed[];

    const scored = items.map((item) => ({
      item,
      score: rankExamItem(item, parsed),
    }));

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const bDate = new Date(b.item.published_at || "").getTime();
      const aDate = new Date(a.item.published_at || "").getTime();
      return bDate - aDate;
    });

    const total = count || scored.length;
    const paginatedItems = scored.slice(offset, offset + limit).map((s) => s.item);
    const totalPages = Math.ceil(total / limit);

    return {
      exams: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Standard non-search paginated query
  query = query.order("published_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("Error fetching public exams:", error);
    return { exams: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    exams: (data || []) as GovExamDetailed[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Intelligent Bulletin & News Search Engine
 */
export async function searchBulletins(params: BulletinFilterParams = {}): Promise<{
  bulletins: PublicBulletinDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 12));
  const offset = (page - 1) * limit;

  let query = (supabase.from("public_bulletins") as any)
    .select(
      `
      *,
      organization:organizations(*),
      related_job:gov_jobs(id, title, slug)
    `,
      { count: "exact" }
    )
    .eq("status", "published");

  if (params.category && params.category !== "all") {
    // Map UI category keys to database categories if needed
    const dbCatMap: Record<string, string[]> = {
      employment_news: ["employment_news"],
      student_advisories: ["student_advisory"],
      legal_updates: ["legal_update"],
      press_releases: ["press_release"],
      student_advisory: ["student_advisory"],
      legal_update: ["legal_update"],
      press_release: ["press_release"],
    };
    const dbCats = dbCatMap[params.category] || [params.category];
    if (dbCats.length === 1) {
      query = query.eq("category", dbCats[0]);
    } else {
      query = query.in("category", dbCats);
    }
  }

  if (params.isBreaking !== undefined) {
    query = query.eq("is_breaking", params.isBreaking);
  }

  const hasSearch = !!(params.search && params.search.trim());

  if (hasSearch) {
    const parsed = parseSearchQuery(params.search);
    const orClauses: string[] = [];

    if (parsed.cleanQuery) {
      orClauses.push(`title.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`summary.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`source_name.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`content.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`slug.ilike.%${parsed.cleanQuery}%`);
    }

    for (const token of parsed.contentTokens) {
      orClauses.push(`title.ilike.%${token}%`);
      orClauses.push(`summary.ilike.%${token}%`);
      orClauses.push(`source_name.ilike.%${token}%`);
      orClauses.push(`content.ilike.%${token}%`);
    }

    const uniqueClauses = Array.from(new Set(orClauses)).filter(Boolean);
    if (uniqueClauses.length > 0) {
      query = query.or(uniqueClauses.join(","));
    }

    const candidateLimit = Math.max(limit * 3, 50);
    query = query.order("published_at", { ascending: false }).limit(candidateLimit);

    const { data, count, error } = await query;
    if (error) {
      console.error("Error searching public bulletins:", error);
      return { bulletins: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data || []) as PublicBulletinDetailed[];

    const scored = items.map((item) => ({
      item,
      score: rankBulletinItem(item, parsed),
    }));

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const bDate = new Date(b.item.published_at || "").getTime();
      const aDate = new Date(a.item.published_at || "").getTime();
      return bDate - aDate;
    });

    const total = count || scored.length;
    const paginatedItems = scored.slice(offset, offset + limit).map((s) => s.item);
    const totalPages = Math.ceil(total / limit);

    return {
      bulletins: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Standard non-search paginated query
  query = query.order("published_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("Error fetching public bulletins:", error);
    return { bulletins: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    bulletins: (data || []) as PublicBulletinDetailed[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * True Global Search across Jobs, Examinations, and Public News / Bulletins.
 * Executes concurrent queries across all modules and aggregates structured results.
 */
export async function searchGlobal(
  rawQuery?: string,
  options: { limitPerType?: number } = {}
): Promise<GlobalSearchResult> {
  const query = (rawQuery || "").trim();
  const limitPerType = options.limitPerType || 6;

  if (!query) {
    return {
      query: "",
      totalCount: 0,
      counts: {
        jobs: 0,
        exams: 0,
        bulletins: 0,
      },
      jobs: [],
      exams: [],
      bulletins: [],
    };
  }

  const [jobsRes, examsRes, bulletinsRes] = await Promise.all([
    searchJobs({ search: query, limit: limitPerType }),
    searchExams({ search: query, limit: limitPerType }),
    searchBulletins({ search: query, limit: limitPerType }),
  ]);

  const totalCount = jobsRes.total + examsRes.total + bulletinsRes.total;

  return {
    query,
    totalCount,
    counts: {
      jobs: jobsRes.total,
      exams: examsRes.total,
      bulletins: bulletinsRes.total,
    },
    jobs: jobsRes.jobs,
    exams: examsRes.exams,
    bulletins: bulletinsRes.bulletins,
  };
}
