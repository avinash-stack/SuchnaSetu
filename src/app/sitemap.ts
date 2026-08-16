import { MetadataRoute } from "next";
import { SITE_CONFIG, SYSTEM_MODULES } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Core public routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/jobs`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/exams`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/news`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.85,
    },
  ];

  // System Modules
  SYSTEM_MODULES.forEach((mod) => {
    if (mod.href !== "/jobs" && mod.href !== "/exams") {
      routes.push({
        url: `${SITE_CONFIG.url}${mod.href}`,
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
      .select("slug, updated_at")
      .eq("status", "published")
      .is("deleted_at", null);

    if (exams) {
      (exams as any[]).forEach((exam) => {
        routes.push({
          url: `${SITE_CONFIG.url}/exams/${exam.slug}`,
          lastModified: exam.updated_at || currentDate,
          changeFrequency: "daily",
          priority: 0.8,
        });
      });
    }

    // Fetch published jobs
    const { data: jobs } = await supabase
      .from("gov_jobs")
      .select("slug, updated_at")
      .eq("status", "published")
      .is("deleted_at", null);

    if (jobs) {
      (jobs as any[]).forEach((job) => {
        routes.push({
          url: `${SITE_CONFIG.url}/jobs/${job.slug}`,
          lastModified: job.updated_at || currentDate,
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
