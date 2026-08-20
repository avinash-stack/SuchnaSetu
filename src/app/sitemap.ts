import { MetadataRoute } from "next";
import { SYSTEM_MODULES, getCanonicalSiteUrl } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalSiteUrl();
  const currentDate = new Date().toISOString();

  // Core public routes
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

  // System Modules
  SYSTEM_MODULES.forEach((mod) => {
    if (mod.href !== "/jobs" && mod.href !== "/exams") {
      routes.push({
        url: `${baseUrl}${mod.href}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  });

  try {
    const supabase = createAdminClient();

    // Fetch published exams
    const { data: exams } = await supabase
      .from("gov_exams")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false });

    if (exams) {
      (exams as any[]).forEach((exam) => {
        routes.push({
          url: `${baseUrl}/exams/${exam.slug}`,
          lastModified: exam.updated_at || exam.published_at || currentDate,
          changeFrequency: "daily",
          priority: 0.85,
        });
      });
    }

    // Fetch published jobs
    const { data: jobs } = await supabase
      .from("gov_jobs")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false });

    if (jobs) {
      (jobs as any[]).forEach((job) => {
        routes.push({
          url: `${baseUrl}/jobs/${job.slug}`,
          lastModified: job.updated_at || job.published_at || currentDate,
          changeFrequency: "daily",
          priority: 0.85,
        });
      });
    }

    // Fetch published news bulletins
    const { data: bulletins } = await supabase
      .from("public_bulletins")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (bulletins) {
      (bulletins as any[]).forEach((b) => {
        routes.push({
          url: `${baseUrl}/news/${b.slug}`,
          lastModified: b.updated_at || b.published_at || currentDate,
          changeFrequency: "daily",
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap dynamic fetch error:", error);
  }

  return routes;
}
