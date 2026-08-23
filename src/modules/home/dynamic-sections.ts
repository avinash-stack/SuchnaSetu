import { createPublicClient } from "@/lib/supabase/public";
import { unstable_cache } from "next/cache";

export interface TodayUpdateItem {
  id: string;
  type: "job" | "exam" | "bulletin" | "result" | "admit_card";
  title: string;
  slug: string;
  publishedAt: string;
  authorityName: string;
  authorityAcronym: string;
  stateCode?: string;
  actionUrl: string;
  actionLabel: string;
  isExternal: boolean;
}

export interface ComingSoonItem {
  id: string;
  title: string;
  slug: string;
  authorityName: string;
  authorityAcronym: string;
  stateCode?: string;
  expectedStartDate: string;
  daysRemaining: number;
  totalVacancies?: number;
  officialNotificationUrl?: string;
  type: "job" | "exam";
}

export interface AnswerKeyItem {
  id: string;
  title: string;
  slug: string;
  authorityName: string;
  authorityAcronym: string;
  releasedAt: string;
  answerKeyUrl: string;
  examCode?: string;
  status: string;
}

export interface SyllabusItem {
  id: string;
  title: string;
  slug: string;
  authorityName: string;
  authorityAcronym: string;
  syllabusSummary: string;
  patternDescription?: string;
  markingScheme?: string;
  officialNotificationUrl?: string;
  examCode?: string;
}

/**
 * 1. Fetch Today's Updates (Jobs, Exams, Results, Bulletins published today or in last 24h)
 */
export const getTodaysUpdates = unstable_cache(
  async (): Promise<TodayUpdateItem[]> => {
    const supabase = createPublicClient();
    const today = new Date();
    // Start of current day in IST/UTC (last 24 hours window)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [
      { data: jobs },
      { data: exams },
      { data: bulletins }
    ] = await Promise.all([
      (supabase.from("gov_jobs") as any)
        .select("id, title, slug, published_at, official_apply_url, state_code, organizations(name, acronym)")
        .gte("published_at", twentyFourHoursAgo)
        .order("published_at", { ascending: false })
        .limit(6),
      (supabase.from("gov_exams") as any)
        .select("id, title, slug, published_at, official_website_url, state_code, organizations(name, acronym)")
        .gte("published_at", twentyFourHoursAgo)
        .order("published_at", { ascending: false })
        .limit(6),
      (supabase.from("bulletins") as any)
        .select("id, title, slug, published_at, source_name, organizations(name, acronym)")
        .gte("published_at", twentyFourHoursAgo)
        .order("published_at", { ascending: false })
        .limit(4)
    ]);

    const updates: TodayUpdateItem[] = [];

    (jobs || []).forEach((j: any) => {
      updates.push({
        id: `job-${j.id}`,
        type: "job",
        title: j.title,
        slug: `/jobs/${j.slug}`,
        publishedAt: j.published_at || new Date().toISOString(),
        authorityName: j.organizations?.name || "Official Body",
        authorityAcronym: j.organizations?.acronym || "GOVT",
        stateCode: j.state_code,
        actionUrl: `/jobs/${j.slug}`,
        actionLabel: "View Recruitment",
        isExternal: false,
      });
    });

    (exams || []).forEach((e: any) => {
      const isResult = (e.title || "").toLowerCase().includes("result");
      const isAdmitCard = (e.title || "").toLowerCase().includes("admit card");
      const type = isResult ? "result" : isAdmitCard ? "admit_card" : "exam";
      const actionLabel = isResult ? "View Result" : isAdmitCard ? "Download Admit Card" : "View Examination";

      updates.push({
        id: `exam-${e.id}`,
        type,
        title: e.title,
        slug: `/exams/${e.slug}`,
        publishedAt: e.published_at || new Date().toISOString(),
        authorityName: e.organizations?.name || "Official Body",
        authorityAcronym: e.organizations?.acronym || "EXAM",
        stateCode: e.state_code,
        actionUrl: `/exams/${e.slug}`,
        actionLabel,
        isExternal: false,
      });
    });

    (bulletins || []).forEach((b: any) => {
      updates.push({
        id: `bulletin-${b.id}`,
        type: "bulletin",
        title: b.title,
        slug: `/news/${b.slug}`,
        publishedAt: b.published_at || new Date().toISOString(),
        authorityName: b.organizations?.name || b.source_name || "PIB / Employment News",
        authorityAcronym: b.organizations?.acronym || "NEWS",
        actionUrl: `/news/${b.slug}`,
        actionLabel: "Read Advisory",
        isExternal: false,
      });
    });

    // Sort all updates by publishedAt descending
    return updates.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  },
  ["home-todays-updates"],
  { revalidate: 120, tags: ["jobs", "exams", "bulletins"] }
);

/**
 * 2. Fetch Coming Soon / Upcoming Items (future start dates or announced upcoming notices)
 */
export const getComingSoonItems = unstable_cache(
  async (): Promise<ComingSoonItem[]> => {
    const supabase = createPublicClient();
    const now = new Date();
    const nowIso = now.toISOString();
    // Maximum 60 days upcoming window — candidates only track realistic upcoming recruitment
    const maxUpcomingWindow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();

    const { data: upcomingJobs } = await (supabase.from("gov_jobs") as any)
      .select("id, title, slug, application_start_date, application_end_date, total_vacancies, state_code, official_notification_url, organizations(name, acronym)")
      .gt("application_start_date", nowIso)
      .lte("application_start_date", maxUpcomingWindow)
      .order("application_start_date", { ascending: true })
      .limit(6);

    const items: ComingSoonItem[] = [];

    (upcomingJobs || []).forEach((j: any) => {
      const startDate = new Date(j.application_start_date);
      const diffMs = startDate.getTime() - now.getTime();
      const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      items.push({
        id: j.id,
        title: j.title,
        slug: `/jobs/${j.slug}`,
        authorityName: j.organizations?.name || "Official Body",
        authorityAcronym: j.organizations?.acronym || "GOVT",
        stateCode: j.state_code,
        expectedStartDate: j.application_start_date,
        daysRemaining,
        totalVacancies: j.total_vacancies,
        officialNotificationUrl: j.official_notification_url,
        type: "job",
      });
    });

    return items;
  },
  ["home-coming-soon-items"],
  { revalidate: 300, tags: ["jobs"] }
);

/**
 * 3. Fetch Official Answer Keys Released
 */
export const getAnswerKeys = unstable_cache(
  async (): Promise<AnswerKeyItem[]> => {
    const supabase = createPublicClient();

    // Query exams where title indicates Answer Key or status is answer_key_released
    const { data: answerKeyExams } = await (supabase.from("gov_exams") as any)
      .select("id, title, slug, status, exam_code, official_notification_url, official_website_url, published_at, organizations(name, acronym)")
      .or("title.ilike.%Answer Key%,title.ilike.%Answerkey%,title.ilike.%Key Challenge%,title.ilike.%Model Answer%,status.eq.answer_key_released")
      .order("published_at", { ascending: false })
      .limit(6);

    const items: AnswerKeyItem[] = [];

    (answerKeyExams || []).forEach((e: any) => {
      items.push({
        id: e.id,
        title: e.title,
        slug: `/exams/${e.slug}`,
        authorityName: e.organizations?.name || "Examination Authority",
        authorityAcronym: e.organizations?.acronym || "EXAM",
        releasedAt: e.published_at || new Date().toISOString(),
        answerKeyUrl: e.official_notification_url || e.official_website_url || `/exams/${e.slug}`,
        examCode: e.exam_code,
        status: e.status || "Released",
      });
    });

    return items;
  },
  ["home-answer-keys"],
  { revalidate: 300, tags: ["exams"] }
);

/**
 * 4. Fetch Official Exam Syllabi
 */
export const getOfficialSyllabi = unstable_cache(
  async (limit = 6): Promise<SyllabusItem[]> => {
    const supabase = createPublicClient();

    const { data: syllabusExams } = await (supabase.from("gov_exams") as any)
      .select("id, title, slug, exam_code, syllabus_summary, pattern_description, marking_scheme, official_notification_url, organizations(name, acronym)")
      .not("syllabus_summary", "is", null)
      .neq("syllabus_summary", "")
      .order("published_at", { ascending: false })
      .limit(limit);

    const items: SyllabusItem[] = [];

    (syllabusExams || []).forEach((e: any) => {
      // Filter out generic boilerplate if comprehensive syllabus is present
      items.push({
        id: e.id,
        title: e.title,
        slug: `/exams/${e.slug}`,
        authorityName: e.organizations?.name || "Official Commission",
        authorityAcronym: e.organizations?.acronym || "EXAM",
        syllabusSummary: e.syllabus_summary,
        patternDescription: e.pattern_description,
        markingScheme: e.marking_scheme,
        officialNotificationUrl: e.official_notification_url,
        examCode: e.exam_code,
      });
    });

    return items;
  },
  ["home-official-syllabi"],
  { revalidate: 600, tags: ["exams"] }
);
