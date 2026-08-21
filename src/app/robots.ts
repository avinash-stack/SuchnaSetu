import { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalSiteUrl();

  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/search"],
      },
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/search"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/search"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
