import { MetadataRoute } from "next";
import { SYSTEM_MODULES, getCanonicalSiteUrl } from "@/lib/constants";
import { INDIAN_STATES } from "@/lib/constants/states";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 1800; // 30 minutes cache

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalSiteUrl();
  const currentDate = new Date().toISOString();

  // 1. Core Public Hubs
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/exams`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/todays-updates`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/coming-soon`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/answer-keys`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/syllabus`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admit-cards`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ];

  // 2. All Indian States Portals
  INDIAN_STATES.forEach((state) => {
    routes.push({
      url: `${baseUrl}/state/${state.code.toLowerCase()}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    });
  });

  try {
    const supabase = createAdminClient();

    // 3. All Government Organizations / Authorities
    const { data: orgs } = await supabase
      .from("organizations")
      .select("id, acronym, updated_at")
      .limit(1000);

    if (orgs) {
      (orgs as any[]).forEach((org) => {
        const slug = org.acronym?.toLowerCase() || org.id;
        routes.push({
          url: `${baseUrl}/authorities/${slug}`,
          lastModified: org.updated_at || currentDate,
          changeFrequency: "daily",
          priority: 0.85,
        });
      });
    }

    // 4. All Published Jobs (Paginated to bypass 1000-row limit)
    let jobsPage = 0;
    const pageSize = 1000;
    let hasMoreJobs = true;

    while (hasMoreJobs) {
      const from = jobsPage * pageSize;
      const to = from + pageSize - 1;
      const { data: jobsChunk, error: jobsError } = await supabase
        .from("gov_jobs")
        .select("slug, updated_at, published_at")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .range(from, to);

      if (jobsError || !jobsChunk || jobsChunk.length === 0) {
        hasMoreJobs = false;
        break;
      }

      jobsChunk.forEach((job: any) => {
        routes.push({
          url: `${baseUrl}/jobs/${job.slug}`,
          lastModified: job.updated_at || job.published_at || currentDate,
          changeFrequency: "daily",
          priority: 0.9,
        });
      });

      if (jobsChunk.length < pageSize) {
        hasMoreJobs = false;
      } else {
        jobsPage++;
      }
    }

    // 5. All Published Exams & Syllabi (Paginated)
    let examsPage = 0;
    let hasMoreExams = true;

    while (hasMoreExams) {
      const from = examsPage * pageSize;
      const to = from + pageSize - 1;
      const { data: examsChunk, error: examsError } = await supabase
        .from("gov_exams")
        .select("id, slug, updated_at, published_at")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .range(from, to);

      if (examsError || !examsChunk || examsChunk.length === 0) {
        hasMoreExams = false;
        break;
      }

      examsChunk.forEach((exam: any) => {
        routes.push({
          url: `${baseUrl}/exams/${exam.slug}`,
          lastModified: exam.updated_at || exam.published_at || currentDate,
          changeFrequency: "daily",
          priority: 0.9,
        });

        // Dedicated Syllabus page for exam
        routes.push({
          url: `${baseUrl}/syllabus/${exam.slug || exam.id}`,
          lastModified: exam.updated_at || exam.published_at || currentDate,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });

      if (examsChunk.length < pageSize) {
        hasMoreExams = false;
      } else {
        examsPage++;
      }
    }

    // 6. News Categories and Search Hub
    const NEWS_CATEGORIES_SLUGS = [
      "india", "states", "education", "governance", "business",
      "technology", "politics", "world", "health", "sports", "entertainment"
    ];
    NEWS_CATEGORIES_SLUGS.forEach((catSlug) => {
      routes.push({
        url: `${baseUrl}/news/category/${catSlug}`,
        lastModified: currentDate,
        changeFrequency: "hourly",
        priority: 0.85,
      });
    });

    routes.push({
      url: `${baseUrl}/news/search`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.7,
    });

    // 7. All Published News Articles
    const { data: newsArticles } = await (supabase as any)
      .from("news_articles")
      .select("slug, updated_at, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(1000);

    if (newsArticles && newsArticles.length > 0) {
      (newsArticles as any[]).forEach((a: any) => {
        routes.push({
          url: `${baseUrl}/news/${a.slug}`,
          lastModified: a.updated_at || a.published_at || currentDate,
          changeFrequency: "daily",
          priority: 0.8,
        });
      });
    }

    // 8. Legacy Bulletins (Backwards compatibility)
    const { data: bulletins } = await supabase
      .from("public_bulletins")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(500);

    if (bulletins) {
      (bulletins as any[]).forEach((b: any) => {
        routes.push({
          url: `${baseUrl}/news/${b.slug}`,
          lastModified: b.updated_at || b.published_at || currentDate,
          changeFrequency: "daily",
          priority: 0.75,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap dynamic generation error:", error);
  }

  return routes;
}
