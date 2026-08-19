import { Metadata } from "next";
import { SITE_CONFIG, getCanonicalSiteUrl } from "@/lib/constants";

interface MetadataProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Normalizes an AdSense identifier into standard client ID and publisher ID formats.
 * Handles inputs like "ca-pub-1234567890123456", "pub-1234567890123456", or "1234567890123456".
 */
export function normalizeAdsenseId(rawId?: string | null): {
  numericId: string;
  clientId: string;
  publisherId: string;
} | null {
  if (!rawId) return null;
  const trimmed = rawId.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/\d{10,20}/);
  if (!match) return null;

  const numericId = match[0];
  return {
    numericId,
    clientId: `ca-pub-${numericId}`,
    publisherId: `pub-${numericId}`,
  };
}

/**
 * Generates standardized Next.js Metadata with OpenGraph, Twitter cards, and verification meta tags.
 * Guarantees absolute canonical HTTPS URL resolution using the production domain.
 */
export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  path = "",
  image = "/og-image.png",
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const baseUrl = getCanonicalSiteUrl();
  const pageTitle = title ? `${title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`;
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const canonicalUrl = `${baseUrl}${cleanPath}`;
  const ogImageUrl = image.startsWith("http") ? image : `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;
  const adsense = normalizeAdsenseId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION_TAG || undefined,
    },
    other: {
      ...(adsense ? { "google-adsense-account": adsense.clientId } : {}),
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION_TAG
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION_TAG }
        : {}),
    },
  };
}

export * from "@/components/seo/head-scripts";

/**
 * Builds Schema.org WebSite JSON-LD with Sitelinks Searchbox
 */
export function buildWebSiteJsonLd() {
  const baseUrl = getCanonicalSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: baseUrl,
    description: SITE_CONFIG.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Builds Schema.org BreadcrumbList JSON-LD
 */
export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  const baseUrl = getCanonicalSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

/**
 * Builds JSON-LD Structured Data for Government Information / Notice Item
 */
export function buildGovNoticeJsonLd({
  title,
  description,
  url,
  organizationName,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  organizationName: string;
  datePublished?: string | null;
  dateModified?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentPermit",
    name: title,
    description,
    url,
    issuedBy: {
      "@type": "GovernmentOrganization",
      name: organizationName,
    },
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
  };
}

/**
 * Builds JSON-LD Structured Data for Government Examination Item
 */
export function buildGovExamJsonLd({
  title,
  description,
  url,
  organizationName,
  startDate,
  endDate,
  mode,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  organizationName: string;
  startDate?: string | null;
  endDate?: string | null;
  mode?: string;
  datePublished?: string | null;
  dateModified?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description,
    url,
    eventAttendanceMode:
      mode === "online_cbt"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "GovernmentOrganization",
      name: organizationName,
    },
    startDate: startDate || datePublished || new Date().toISOString(),
    ...(endDate ? { endDate } : {}),
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
  };
}

/**
 * Builds JSON-LD Structured Data for News Bulletins & Advisories
 */
export function buildNewsArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "SuchnaSetu Civic News Desk",
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string;
}) {
  const baseUrl = getCanonicalSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: authorName,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: baseUrl,
    },
  };
}
