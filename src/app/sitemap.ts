import { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { INDIAN_STATES } from "@/lib/constants/states";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Sitemap revalidation: 6 hours.
 * Sitemap entries change at most a few times per day (new jobs/exams published,
 * news articles ingested). A 6-hour window avoids re-querying Supabase on every
 * crawler/bot hit while still reflecting new content within a reasonable period.
 *
 * During the revalidation window Next.js serves the cached XML, so no Supabase
 * queries are executed at all.
 */
export const revalidate = 21600; // 6 hours

/**
 * Minimal column projection for sitemap entries.
 * Only slug (URL identifier) and date fields are required.
 */
const SITEMAP_PROJECTION_SLUG_DATES = "slug, updated_at, published_at";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalSiteUrl();
  const currentDate = new Date().toISOString();

  // 1. Core Public Hubs (static — no DB queries)
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
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ];

  // 2. All Indian States Portals (static — no DB queries)
  INDIAN_STATES.forEach((state) => {
    routes.push({
      url: `${baseUrl}/state/${state.code.toLowerCase()}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    });
  });

  // 3. News Categories (static — no DB queries)
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

  try {
    const supabase = createPublicClient();

    // ─── Batch all DB queries in a single Promise.all ─────────────────
    // Each query fetches ONLY slug + date columns.
    // Mock/test/benchmark slugs are excluded at the database level.
    const [orgsRes, newsRes, bulletinsRes, careerRes] = await Promise.all([
      // Organizations / Authorities
      supabase
        .from("organizations")
        .select("acronym, updated_at")
        .eq("is_active", true)
        .limit(1000),

      // News Articles
      (supabase as any)
        .from("news_articles")
        .select(SITEMAP_PROJECTION_SLUG_DATES)
        .eq("is_published", true)
        .not("slug", "ilike", "mock-%")
        .not("slug", "ilike", "test-%")
        .order("published_at", { ascending: false })
        .limit(1000),

      // Bulletins (legacy, backwards compatibility)
      supabase
        .from("public_bulletins")
        .select("slug, published_at, created_at")
        .eq("status", "published")
        .not("slug", "ilike", "mock-%")
        .not("slug", "ilike", "test-%")
        .order("published_at", { ascending: false })
        .limit(500),

      // Career Guidance Resources
      (supabase as any)
        .from("career_resources")
        .select(SITEMAP_PROJECTION_SLUG_DATES)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(200),
    ]);

    // ─── Process Organizations ────────────────────────────────────────
    if (orgsRes.data) {
      (orgsRes.data as any[]).forEach((org) => {
        const slug = org.acronym?.toLowerCase();
        if (slug) {
          routes.push({
            url: `${baseUrl}/authorities/${slug}`,
            lastModified: org.updated_at || currentDate,
            changeFrequency: "daily",
            priority: 0.85,
          });
        }
      });
    }

    // ─── Paginated Jobs (slug + dates only) ───────────────────────────
    let jobsPage = 0;
    const pageSize = 1000;
    let hasMoreJobs = true;

    while (hasMoreJobs) {
      const from = jobsPage * pageSize;
      const to = from + pageSize - 1;
      const { data: jobsChunk, error: jobsError } = await supabase
        .from("gov_jobs")
        .select(SITEMAP_PROJECTION_SLUG_DATES)
        .eq("status", "published")
        .is("deleted_at", null)
        .not("slug", "ilike", "mock-%")
        .not("slug", "ilike", "test-%")
        .not("title", "ilike", "%Benchmark Feed%")
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

      hasMoreJobs = jobsChunk.length >= pageSize;
      jobsPage++;
    }

    // ─── Paginated Exams + Syllabus pages (slug + dates only) ─────────
    let examsPage = 0;
    let hasMoreExams = true;

    while (hasMoreExams) {
      const from = examsPage * pageSize;
      const to = from + pageSize - 1;
      const { data: examsChunk, error: examsError } = await supabase
        .from("gov_exams")
        .select(SITEMAP_PROJECTION_SLUG_DATES)
        .eq("status", "published")
        .is("deleted_at", null)
        .not("slug", "ilike", "mock-%")
        .not("slug", "ilike", "test-%")
        .not("title", "ilike", "%Benchmark Feed%")
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
        if (exam.slug) {
          routes.push({
            url: `${baseUrl}/syllabus/${exam.slug}`,
            lastModified: exam.updated_at || exam.published_at || currentDate,
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      });

      hasMoreExams = examsChunk.length >= pageSize;
      examsPage++;
    }

    // ─── Process News Articles ────────────────────────────────────────
    if (newsRes.data && newsRes.data.length > 0) {
      (newsRes.data as any[]).forEach((a: any) => {
        routes.push({
          url: `${baseUrl}/news/${a.slug}`,
          lastModified: a.updated_at || a.published_at || currentDate,
          changeFrequency: "daily",
          priority: 0.8,
        });
      });
    }

    // ─── Process Bulletins (legacy) ───────────────────────────────────
    if (bulletinsRes.data) {
      (bulletinsRes.data as any[]).forEach((b: any) => {
        routes.push({
          url: `${baseUrl}/news/${b.slug}`,
          lastModified: b.published_at || b.created_at || currentDate,
          changeFrequency: "daily",
          priority: 0.75,
        });
      });
    }

    // ─── Process Career Resources ─────────────────────────────────────
    try {
      if (careerRes.data && careerRes.data.length > 0) {
        careerRes.data.forEach((cr: any) => {
          routes.push({
            url: `${baseUrl}/resources/${cr.slug}`,
            lastModified: cr.updated_at || cr.published_at || currentDate,
            changeFrequency: "weekly",
            priority: 0.85,
          });
        });
      } else {
        const { FALLBACK_PILLAR_RESOURCES } = await import("@/modules/resources/constants");
        FALLBACK_PILLAR_RESOURCES.forEach((cr) => {
          routes.push({
            url: `${baseUrl}/resources/${cr.slug}`,
            lastModified: cr.updated_at || cr.published_at || currentDate,
            changeFrequency: "weekly",
            priority: 0.85,
          });
        });
      }
    } catch {
      // Non-blocking fallback
    }
  } catch (error) {
    console.error("Sitemap dynamic generation error:", error);
  }

  return routes;
}
