import { MetadataRoute } from "next";
import { SITE_CONFIG, SYSTEM_MODULES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${SITE_CONFIG.url}/news`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.85,
    },
  ];

  // Module routes
  SYSTEM_MODULES.forEach((mod) => {
    if (mod.href !== "/jobs") {
      routes.push({
        url: `${SITE_CONFIG.url}${mod.href}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  });

  return routes;
}
