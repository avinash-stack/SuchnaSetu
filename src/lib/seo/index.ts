import { Metadata } from "next";
import { SITE_CONFIG, getCanonicalSiteUrl } from "@/lib/constants";
import { getStateByCode } from "@/lib/constants/states";

interface MetadataProps {
  title?: string;
  description?: string;
  path?: string;
  canonicalPath?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  availableLanguages?: Record<string, string>;
  manifest?: string;
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
 * Strictly avoids emitting phantom/untranslated hreflang language variants to prevent Google Search Console duplicate indexing issues.
 */
export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  path = "",
  canonicalPath,
  image = "/og/suchnasetu-og.png",
  noIndex = false,
  keywords,
  availableLanguages,
  manifest: manifestOverride,
}: MetadataProps = {}): Metadata {
  const baseUrl = getCanonicalSiteUrl();
  const pageTitle = title ? `${title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`;
  
  // Use canonicalPath if explicitly supplied, otherwise clean the path
  const targetPath = canonicalPath !== undefined ? canonicalPath : path;
  const cleanPath = targetPath ? (targetPath.startsWith("/") ? targetPath : `/${targetPath}`) : "";
  const canonicalUrl = `${baseUrl}${cleanPath}`;
  const ogImageUrl = image.startsWith("http") ? image : `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;
  const adsense = normalizeAdsenseId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

  // Build clean, authentic hreflang mapping:
  // If availableLanguages is provided, emit those authentic alternates.
  // Otherwise, emit ONLY English and x-default to eliminate phantom ?lang= URLs.
  const languageAlternates: Record<string, string> = {
    "en": canonicalUrl,
    ...(availableLanguages || {}),
    "x-default": canonicalUrl,
  };

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
      languages: !noIndex ? languageAlternates : undefined,
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
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: manifestOverride || "/site.webmanifest",
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
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
 * Safely extracts authentic salary bounds from structured fields or official pay scale strings.
 * Returns null if no reliable numeric salary is present (NEVER invents fake values).
 */
export function parseSalaryQuantitativeValue({
  salaryMin,
  salaryMax,
  payScaleDetails,
}: {
  salaryMin?: number | null;
  salaryMax?: number | null;
  payScaleDetails?: string | null;
}): { minValue?: number; maxValue?: number; value?: number; unitText: string } | null {
  if (salaryMin && salaryMin > 0) {
    if (salaryMax && salaryMax > salaryMin) {
      return { minValue: salaryMin, maxValue: salaryMax, unitText: "MONTH" };
    }
    return { value: salaryMin, unitText: "MONTH" };
  }

  if (!payScaleDetails || typeof payScaleDetails !== "string") {
    return null;
  }

  const clean = payScaleDetails.trim();
  if (!clean || /as per|not specified|applicable|null/i.test(clean)) {
    return null;
  }

  // 1. Range regex: Rs. 56,100 - Rs. 1,77,500 or 21700 - 69100 or Rs. 36,000-63,840
  const rangeMatch = clean.match(
    /(?:Rs\.?|INR|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})*|[0-9]{4,7})\s*(?:-|to|\/)\s*(?:Rs\.?|INR|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})*|[0-9]{4,7})/i
  );
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1].replace(/,/g, ""), 10);
    const max = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
    if (!isNaN(min) && !isNaN(max) && min > 0 && max >= min) {
      return { minValue: min, maxValue: max, unitText: "MONTH" };
    }
  }

  // 2. Single amount regex: Initial Pay Rs. 19,900 / Basic Pay Rs. 41,960 / Starting Rs. 56,100
  const singleMatch = clean.match(
    /(?:Initial Pay|Basic Pay|Starting Pay|Starting|Pay|Salary|Stipend)?\s*(?:Rs\.?|INR|₹)\s*([0-9]{1,3}(?:,[0-9]{2,3})*|[0-9]{4,7})/i
  );
  if (singleMatch) {
    const val = parseInt(singleMatch[1].replace(/,/g, ""), 10);
    if (!isNaN(val) && val >= 5000) {
      return { value: val, unitText: "MONTH" };
    }
  }

  // 3. Known 7th CPC Pay Matrix Levels (official Central Government Gazette figures)
  const cpcLevels: Record<string, { min: number; max: number }> = {
    "1": { min: 18000, max: 56900 },
    "2": { min: 19900, max: 63200 },
    "3": { min: 21700, max: 69100 },
    "4": { min: 25500, max: 81100 },
    "5": { min: 29200, max: 92300 },
    "6": { min: 35400, max: 112400 },
    "7": { min: 44900, max: 142400 },
    "8": { min: 47600, max: 151100 },
    "9": { min: 53100, max: 167800 },
    "10": { min: 56100, max: 177500 },
    "11": { min: 67700, max: 208700 },
    "12": { min: 78800, max: 209200 },
    "13": { min: 123100, max: 215900 },
    "14": { min: 144200, max: 218200 },
  };

  const levelMatch = clean.match(/(?:Pay\s*(?:Matrix\s*)?Level|Level)\s*[-:]?\s*([0-9]{1,2})/i);
  if (levelMatch && cpcLevels[levelMatch[1]]) {
    const lvl = cpcLevels[levelMatch[1]];
    return { minValue: lvl.min, maxValue: lvl.max, unitText: "MONTH" };
  }

  return null;
}

/**
 * Helper to decode HTML entities in titles and descriptions for structured data
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "—")
    .trim();
}

/**
 * Builds Google Search Central compliant JobPosting JSON-LD.
 * Grounded in authentic database records without fabricating non-existent location/salary data.
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
  stateCode,
  employmentType,
  totalVacancies,
  salaryMin,
  salaryMax,
  payScaleDetails,
  educationRequirements,
  experienceRequirements,
  directApplyUrl,
}: {
  title: string;
  description: string;
  url: string;
  organizationName: string;
  organizationUrl?: string | null;
  datePosted?: string | null;
  validThrough?: string | null;
  jobLocationState?: string | null;
  stateCode?: string | null;
  employmentType?: string | null;
  totalVacancies?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  payScaleDetails?: string | null;
  educationRequirements?: string | null;
  experienceRequirements?: string | null;
  directApplyUrl?: string | null;
}): Record<string, any> | null {
  const cleanTitle = decodeHtmlEntities(title);

  // Exclude raw machine codes / non-job filenames from emitting invalid JobPosting schema
  if (/^\d+_[A-Z0-9_]+$/i.test(cleanTitle.trim()) || /^(english|hindi)\s*\(\d+\s*kb\)$/i.test(cleanTitle.trim())) {
    return null;
  }

  // Normalize employmentType to schema.org enum
  const normalizedEmploymentType = (() => {
    if (!employmentType) return "FULL_TIME";
    const lower = employmentType.toLowerCase();
    if (lower === "contract" || lower === "contractor") return "CONTRACTOR";
    if (lower === "apprenticeship" || lower === "intern") return "INTERN";
    if (lower === "temporary") return "TEMPORARY";
    if (lower === "part_time" || lower === "part-time") return "PART_TIME";
    return "FULL_TIME";
  })();

  // Resolve authentic state name if stateCode or state is provided
  let regionName: string | undefined = undefined;
  if (stateCode) {
    regionName = getStateByCode(stateCode)?.name || stateCode;
  } else if (
    jobLocationState &&
    !["all india", "national", "india", "central"].includes(jobLocationState.toLowerCase())
  ) {
    regionName = getStateByCode(jobLocationState)?.name || jobLocationState;
  }

  const isNational = !regionName;

  // Resolve authentic salary (omitted if no reliable numeric salary is available)
  const salaryValue = parseSalaryQuantitativeValue({ salaryMin, salaryMax, payScaleDetails });

  // Format datePosted
  let formattedDatePosted = new Date().toISOString();
  if (datePosted) {
    try {
      const parsedDate = new Date(datePosted);
      if (!isNaN(parsedDate.getTime())) {
        formattedDatePosted = parsedDate.toISOString();
      }
    } catch {}
  }

  // Format validThrough: If missing or null, calculate safe 30-day window from datePosted for active postings
  let formattedValidThrough: string | undefined = undefined;
  if (validThrough) {
    try {
      const parsedDate = new Date(validThrough);
      if (!isNaN(parsedDate.getTime())) {
        formattedValidThrough = parsedDate.toISOString();
      }
    } catch {}
  } else if (formattedDatePosted) {
    try {
      const postedTime = new Date(formattedDatePosted).getTime();
      const defaultExpiry = new Date(postedTime + 30 * 86400000);
      formattedValidThrough = defaultExpiry.toISOString();
    } catch {}
  }

  const cleanDescription = decodeHtmlEntities(description);
  // Format rich HTML description for Google Search Central compliance
  const richHtmlDescription = `<p>${cleanDescription || `${cleanTitle} recruitment notification announced by ${organizationName}.`}</p><p><strong>Hiring Authority:</strong> ${organizationName}</p>${totalVacancies && totalVacancies > 0 ? `<p><strong>Total Openings:</strong> ${totalVacancies} vacancies</p>` : ""}${educationRequirements ? `<p><strong>Educational Eligibility:</strong> ${educationRequirements}</p>` : ""}${experienceRequirements ? `<p><strong>Experience:</strong> ${experienceRequirements}</p>` : ""}<p><strong>Application Mode:</strong> Online submission on official portal.</p>`;

  const slug = url.split("/").filter(Boolean).pop() || cleanTitle;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: cleanTitle,
    description: richHtmlDescription,
    url,
    identifier: {
      "@type": "PropertyValue",
      name: organizationName,
      value: slug,
    },
    datePosted: formattedDatePosted,
    ...(formattedValidThrough ? { validThrough: formattedValidThrough } : {}),
    employmentType: normalizedEmploymentType,
    hiringOrganization: {
      "@type": "Organization",
      name: organizationName,
      ...(organizationUrl ? { sameAs: organizationUrl } : {}),
    },
    jobLocation: isNational
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressRegion: "India",
            addressCountry: "IN",
          },
        }
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressRegion: regionName,
            addressCountry: "IN",
          },
        },
    ...(isNational
      ? {
          applicantLocationRequirements: {
            "@type": "Country",
            name: "IN",
          },
        }
      : {}),
    ...(salaryValue
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              ...salaryValue,
            },
          },
        }
      : {}),
    directApply: Boolean(directApplyUrl),
    ...(educationRequirements ? { educationRequirements } : {}),
    ...(experienceRequirements ? { experienceRequirements } : {}),
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
  const cleanName = decodeHtmlEntities(name);
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: cleanName,
    ...(acronym ? { alternateName: acronym } : {}),
    url,
    ...(websiteUrl ? { sameAs: websiteUrl } : {}),
    description: description ? decodeHtmlEntities(description) : `${cleanName} (${acronym || ""}) official government recruitment authority profile, active jobs, upcoming examinations and official syllabus.`,
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
  const cleanTitle = decodeHtmlEntities(title);
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentPermit",
    name: cleanTitle,
    description: decodeHtmlEntities(description),
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
 * Builds JSON-LD Structured Data for Government Examination Item (Google Event compliant)
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
  stateCode,
}: {
  title: string;
  description?: string | null;
  url: string;
  organizationName: string;
  startDate?: string | null;
  endDate?: string | null;
  mode?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  stateCode?: string | null;
}) {
  const cleanTitle = decodeHtmlEntities(title);
  const isOnline = mode === "online_cbt";
  const regionName = stateCode ? getStateByCode(stateCode)?.name || stateCode : undefined;
  const isNational = !regionName;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: cleanTitle,
    description: description ? decodeHtmlEntities(description) : `${cleanTitle} conducted by ${organizationName}.`,
    url,
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "GovernmentOrganization",
      name: organizationName,
    },
    startDate: startDate || datePublished || new Date().toISOString(),
    ...(endDate ? { endDate } : {}),
    location: isOnline
      ? {
          "@type": "VirtualLocation",
          url,
        }
      : {
          "@type": "Place",
          name: isNational ? "Designated Examination Centers Across India" : `${regionName} Examination Centers`,
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
            ...(regionName ? { addressRegion: regionName } : { addressRegion: "India" }),
          },
        },
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
  imageUrl,
  datePublished,
  dateModified,
  authorName = "SuchnaSetu Civic News Desk",
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
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
    ...(imageUrl ? { image: [imageUrl] } : {}),
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

/**
 * Builds Schema.org FAQPage JSON-LD for verified recruitment and examination FAQs.
 */
export function buildFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
