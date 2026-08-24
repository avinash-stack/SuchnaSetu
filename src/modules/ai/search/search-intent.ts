import { createPublicClient } from "@/lib/supabase/public";
import { GovJobDetailed } from "@/modules/jobs/types";
import { GovExamDetailed } from "@/modules/exams/types";
import { PublicBulletinDetailed } from "@/modules/bulletins/types";
import { StructuredSearchIntent } from "./types";
import { parseSearchQuery } from "@/modules/search/query-parser";
import { searchJobs, searchExams, searchBulletins } from "@/modules/search/service";

/**
 * Maps structured search intent to database query execution.
 */
export async function executeStructuredSearch(
  intent: StructuredSearchIntent,
  options: { limitPerType?: number; page?: number } = {}
): Promise<{
  jobs: GovJobDetailed[];
  exams: GovExamDetailed[];
  bulletins: PublicBulletinDetailed[];
  counts: { jobs: number; exams: number; bulletins: number };
}> {
  const limit = options.limitPerType || 12;
  const page = options.page || 1;

  // Build query keywords from intent
  const effectiveKeywords = intent.query || "";

  // 1. Search Jobs with structured filters
  let jobsPromise: Promise<any> = Promise.resolve({ jobs: [], total: 0 });
  if (intent.module === "jobs" || intent.module === "all") {
    jobsPromise = searchJobs({
      search: effectiveKeywords,
      stateCode: intent.state_code || (intent.state ? intent.state.slice(0, 2).toUpperCase() : undefined),
      minSalary: intent.salary_min || undefined,
      maxSalary: intent.salary_max || undefined,
      employmentType: (intent.employment_type as any) || undefined,
      limit,
      page,
    });
  }

  // 2. Search Exams with structured filters
  let examsPromise: Promise<any> = Promise.resolve({ exams: [], total: 0 });
  if (intent.module === "exams" || intent.module === "all") {
    examsPromise = searchExams({
      search: effectiveKeywords,
      stateCode: intent.state_code || (intent.state ? intent.state.slice(0, 2).toUpperCase() : undefined),
      limit,
      page,
    });
  }

  // 3. Search News Bulletins
  let bulletinsPromise: Promise<any> = Promise.resolve({ bulletins: [], total: 0 });
  if (intent.module === "bulletins" || intent.module === "all") {
    bulletinsPromise = searchBulletins({
      search: effectiveKeywords,
      limit: Math.min(limit, 6),
      page,
    });
  }

  const [jobsRes, examsRes, bulletinsRes] = await Promise.all([
    jobsPromise,
    examsPromise,
    bulletinsPromise,
  ]);

  let jobs = (jobsRes.jobs || []) as GovJobDetailed[];
  let exams = (examsRes.exams || []) as GovExamDetailed[];
  let bulletins = (bulletinsRes.bulletins || []) as PublicBulletinDetailed[];

  // Post-filter by qualification if present in intent
  if (intent.qualification && intent.qualification.length > 0) {
    const qualTerms = intent.qualification.map((q) => q.toLowerCase());
    const filteredJobs = jobs.filter((job) => {
      const text = `${job.qualification_summary || ""} ${job.qualification?.name || ""} ${job.eligibility?.education_qualification || ""} ${job.title}`.toLowerCase();
      return qualTerms.some((q) => text.includes(q));
    });
    if (filteredJobs.length > 0) {
      jobs = filteredJobs;
    }
  }

  // Post-filter by application_open if present in intent
  if (intent.application_open) {
    const now = Date.now();
    const openJobs = jobs.filter((j) => {
      if (!j.application_end_date) return true;
      return new Date(j.application_end_date).getTime() > now;
    });
    if (openJobs.length > 0) {
      jobs = openJobs;
    }
  }

  return {
    jobs,
    exams,
    bulletins,
    counts: {
      jobs: jobsRes.total || jobs.length,
      exams: examsRes.total || exams.length,
      bulletins: bulletinsRes.total || bulletins.length,
    },
  };
}
