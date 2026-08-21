import { Metadata } from "next";
import { SITE_CONFIG, getCanonicalSiteUrl } from "@/lib/constants";

interface MetadataProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}

/**
 * Normalizes an AdSense identifier into standard client ID and publisher ID formats.
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
  image = "/og/suchnasetu-og.png",
  noIndex = false,
  keywords,
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
    keywords: keywords || [
      "Government Jobs 2026",
      "Sarkari Naukri",
      "Government Exams",
      "Admit Card",
      "Answer Key",
      "Exam Syllabus",
      "Civic Notifications",
      "SuchnaSetu",
    ],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": `${canonicalUrl}`,
        "hi": `${canonicalUrl}${cleanPath.includes("?") ? "&" : "?"}lang=hi`,
        "bn": `${canonicalUrl}${cleanPath.includes("?") ? "&" : "?"}lang=bn`,
        "or": `${canonicalUrl}${cleanPath.includes("?") ? "&" : "?"}lang=or`,
        "as": `${canonicalUrl}${cleanPath.includes("?") ? "&" : "?"}lang=as`,
        "pa": `${canonicalUrl}${cleanPath.includes("?") ? "&" : "?"}lang=pa`,
        "x-default": `${canonicalUrl}`,
      },
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
          type: "image/png",
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
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
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
 * Builds Schema.org Organization JSON-LD for SuchnaSetu
 */
export function buildSuchnaSetuOrgJsonLd() {
  const baseUrl = getCanonicalSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      "https://twitter.com/SuchnaSetu",
      "https://github.com/avinash-stack/SuchnaSetu",
    ],
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
 * Builds Google Search Central compliant JobPosting JSON-LD
 */
export function buildJobPostingJsonLd({
  title,
  description,
  url,
  organizationName,
  organizationUrl,
  datePosted,
  validThrough,
  jobLocationState,
  employmentType = "FULL_TIME",
  totalVacancies,
  educationRequirements,
}: {
  title: string;
  description: string;
  url: string;
  organizationName: string;
  organizationUrl?: string | null;
  datePosted?: string | null;
  validThrough?: string | null;
  jobLocationState?: string | null;
  employmentType?: string | null;
  totalVacancies?: number | null;
  educationRequirements?: string | null;
}) {
  const isNational = !jobLocationState || jobLocationState.toLowerCase() === "all india" || jobLocationState.toUpperCase() === "NATIONAL";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description: description || `${title} released by ${organizationName}. Check official notification, eligibility criteria, vacancy details and online application procedures.`,
    datePosted: datePosted || new Date().toISOString(),
    ...(validThrough ? { validThrough: new Date(validThrough).toISOString() } : {}),
    employmentType: employmentType || "FULL_TIME",
    hiringOrganization: {
      "@type": "GovernmentOrganization",
      name: organizationName,
      ...(organizationUrl ? { sameAs: organizationUrl } : {}),
    },
    jobLocation: isNational
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
          },
        }
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressRegion: jobLocationState,
            addressCountry: "IN",
          },
        },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "India",
    },
    directApply: true,
    ...(educationRequirements ? { educationRequirements } : {}),
    ...(totalVacancies && totalVacancies > 0 ? { totalJobOpenings: totalVacancies } : {}),
  };
}

/**
 * Builds JSON-LD Structured Data for Government Authorities / Commissions
 */
export function buildGovOrgJsonLd({
  name,
  acronym,
  url,
  websiteUrl,
  description,
  category,
}: {
  name: string;
  acronym?: string;
  url: string;
  websiteUrl?: string;
  description?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name,
    ...(acronym ? { alternateName: acronym } : {}),
    url,
    ...(websiteUrl ? { sameAs: websiteUrl } : {}),
    description: description || `${name} (${acronym || ""}) official government recruitment authority profile, active jobs, upcoming examinations and official syllabus.`,
    ...(category ? { organizationCategory: category } : {}),
  };
}

/**
 * Builds JSON-LD Structured Data for Government Notice Item
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
 * Builds JSON-LD Structured Data for Examination Syllabus & Patterns
 */
export function buildSyllabusJsonLd({
  title,
  examName,
  description,
  url,
  organizationName,
  markingScheme,
}: {
  title: string;
  examName: string;
  description: string;
  url: string;
  organizationName: string;
  markingScheme?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description: description || `Official exam syllabus, exam pattern, subject-wise marking scheme and curriculum for ${examName} by ${organizationName}.`,
    url,
    learningResourceType: "Syllabus",
    educationalLevel: "Competitive Examination",
    author: {
      "@type": "GovernmentOrganization",
      name: organizationName,
    },
    ...(markingScheme ? { assesses: markingScheme } : {}),
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
