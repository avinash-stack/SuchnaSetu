import { DiscoveredCandidateNotice, VerifiedRecruitmentNotice, VerificationResult, DuplicateMatchResult } from "../types";
import { slugify } from "@/lib/utils";

/**
 * Known organization matching patterns for automated slug and name resolution.
 */
const KNOWN_ORGANIZATIONS = [
  {
    slug: "rfcl",
    name: "Ramagundam Fertilizers and Chemicals Limited (RFCL)",
    keywords: ["rfcl", "ramagundam fertilizers", "ramagundam fertilizer"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "eil",
    name: "Engineers India Limited (EIL)",
    keywords: ["engineers india limited", "eil recruitment", "eil"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "nic",
    name: "National Informatics Centre (NIC)",
    keywords: ["national informatics centre", "nic recruitment", "nielit nic", "nic"],
    categorySlug: "central-govt",
    jurisdiction: "central",
  },
  {
    slug: "aai",
    name: "Airports Authority of India (AAI)",
    keywords: ["airports authority of india", "aai recruitment", "aai atc", "aai"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "india-post",
    name: "Department of Posts (India Post)",
    keywords: ["india post", "department of posts", "post office recruitment", "indiapost", "gds"],
    categorySlug: "central-govt",
    jurisdiction: "central",
  },
  {
    slug: "income-tax-department",
    name: "Income Tax Department",
    keywords: ["income tax department", "income tax recruitment", "incometax department", "income tax"],
    categorySlug: "central-govt",
    jurisdiction: "central",
  },
  {
    slug: "income-tax-pune",
    name: "Income Tax Department (Pune Region)",
    keywords: ["income tax pune", "income tax maharashtra", "it department pune"],
    categorySlug: "central-govt",
    jurisdiction: "central",
    stateCode: "MH",
  },
  {
    slug: "upsc",
    name: "Union Public Service Commission (UPSC)",
    keywords: ["upsc", "union public service commission"],
    categorySlug: "upsc",
    jurisdiction: "central",
  },
  {
    slug: "ssc",
    name: "Staff Selection Commission (SSC)",
    keywords: ["ssc", "staff selection commission"],
    categorySlug: "ssc",
    jurisdiction: "central",
  },
  {
    slug: "drdo",
    name: "Defence Research and Development Organisation (DRDO)",
    keywords: ["drdo", "defence research and development organisation"],
    categorySlug: "defence",
    jurisdiction: "central",
  },
  {
    slug: "isro",
    name: "Indian Space Research Organisation (ISRO)",
    keywords: ["isro", "indian space research organisation", "vssc", "ursc", "sdsc"],
    categorySlug: "central-govt",
    jurisdiction: "central",
  },
  {
    slug: "ongc",
    name: "Oil and Natural Gas Corporation (ONGC)",
    keywords: ["ongc", "oil and natural gas corporation"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "iocl",
    name: "Indian Oil Corporation Limited (IOCL)",
    keywords: ["iocl", "indian oil corporation"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "sail",
    name: "Steel Authority of India Limited (SAIL)",
    keywords: ["sail", "steel authority of india"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "bhel",
    name: "Bharat Heavy Electricals Limited (BHEL)",
    keywords: ["bhel", "bharat heavy electricals"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "ntpc",
    name: "NTPC Limited",
    keywords: ["ntpc", "national thermal power"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "bel",
    name: "Bharat Electronics Limited (BEL)",
    keywords: ["bel", "bharat electronics"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
  {
    slug: "hal",
    name: "Hindustan Aeronautics Limited (HAL)",
    keywords: ["hal", "hindustan aeronautics"],
    categorySlug: "psu-jobs",
    jurisdiction: "psu",
  },
];

export class NoticeExtractor {
  /**
   * Identifies the organization from title, raw text, and source URL.
   */
  static identifyOrganization(text: string, url: string): {
    slug: string;
    name: string;
    categorySlug: string;
    stateCode?: string | null;
  } {
    const combined = `${text} ${url}`.toLowerCase();

    for (const org of KNOWN_ORGANIZATIONS) {
      for (const kw of org.keywords) {
        // Regex word boundary matching for exact or prefix tokens
        const regex = new RegExp(`\\b${kw.replace(/\s+/g, "\\s+")}\\b`, "i");
        if (regex.test(combined)) {
          return {
            slug: org.slug,
            name: org.name,
            categorySlug: org.categorySlug,
            stateCode: (org as any).stateCode || null,
          };
        }
      }
    }

    // Default fallback organization
    return {
      slug: "central-ministries-departments",
      name: "Government of India / Public Sector",
      categorySlug: "central-govt",
      stateCode: null,
    };
  }

  /**
   * Extracts advertisement / notification number from text (e.g. Advt No. 01/2026, Rectt/2026/02, etc.).
   */
  static extractNotificationNumber(text: string): string | null {
    if (!text) return null;
    const patterns = [
      /(?:advt|advertisement|notification|rectt|employment notice)\s*(?:no\.?|number|num|#)?\s*[:\-\/]?\s*([A-Za-z0-9\/\-_\.]{3,35})/i,
      /(?:no\.?)\s*[:\-\/]?\s*([A-Za-z0-9]+\/[A-Za-z0-9\/\-_]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const cleaned = match[1].trim().replace(/[.,;:]$/, "");
        if (cleaned.length >= 3 && !cleaned.toLowerCase().includes("http")) {
          return cleaned;
        }
      }
    }
    return null;
  }

  /**
   * Extracts total vacancy count from title and description.
   */
  static extractVacancies(text: string): number {
    if (!text) return 0;
    const patterns = [
      /(\d+)\s*(?:posts?|vacanc(?:y|ies)|openings?|seats?)/i,
      /(?:total|for)\s*(\d+)\s*(?:posts?|vacanc(?:y|ies))/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val > 0 && val < 500000) {
          return val;
        }
      }
    }
    return 0;
  }

  /**
   * Cleans and normalizes the job notice title, stripping noisy SEO and scraper suffixes.
   */
  static normalizeTitle(rawTitle: string, orgName: string): string {
    let title = rawTitle
      .replace(/\s+/g, " ")
      .replace(/\|.*$/g, "") // Remove | Sarkari Result / portal names
      .replace(/- apply online.*$/i, "")
      .replace(/\bapply online now\b/gi, "")
      .replace(/\bdownload notification pdf\b/gi, "")
      .replace(/\bnotification out\b/gi, "")
      .replace(/\bcheck eligibility\b/gi, "")
      .replace(/\s*[-–—]\s*$/, "")
      .trim();

    if (!title) {
      title = `${orgName} Recruitment 2026`;
    }

    return title;
  }

  /**
   * Assembles a fully structured and verified notice model.
   */
  static buildVerifiedNotice(
    candidate: DiscoveredCandidateNotice,
    verification: VerificationResult,
    deduplication: DuplicateMatchResult
  ): VerifiedRecruitmentNotice {
    const org = this.identifyOrganization(
      `${candidate.title} ${candidate.rawText || ""}`,
      candidate.sourceUrl
    );

    const title = this.normalizeTitle(candidate.title, org.name);
    const slug = slugify(title);
    const notificationNumber = candidate.notificationNumber || this.extractNotificationNumber(`${candidate.title} ${candidate.rawText || ""}`);
    const totalVacancies = candidate.totalVacancies || this.extractVacancies(`${candidate.title} ${candidate.rawText || ""}`);

    // If official source is verified, confidence is high
    const isAutoPublishable = verification.isOfficial && verification.confidenceScore >= 80;
    const status = isAutoPublishable ? "published" : "candidate";

    return {
      candidate,
      verification,
      deduplication,
      status,
      normalizedJob: {
        title,
        slug,
        notificationNumber,
        organizationSlug: org.slug,
        organizationName: org.name,
        categorySlug: org.categorySlug,
        stateCode: org.stateCode,
        employmentType: "permanent",
        totalVacancies,
        salaryMin: candidate.salaryMin || null,
        salaryMax: candidate.salaryMax || null,
        payScaleDetails: candidate.payScaleDetails || "As per official government notification norms",
        officialNotificationUrl: verification.normalizedOfficialUrl || candidate.officialNotificationUrl || candidate.sourceUrl,
        officialApplyUrl: candidate.officialApplyUrl || null,
        summary:
          candidate.rawText?.slice(0, 300) ||
          `${org.name} invites applications for recruitment. Refer to the official gazette notification for complete eligibility and application criteria.`,
        applicationStartDate: candidate.applicationStartDate || null,
        applicationEndDate: candidate.applicationEndDate || null,
        vacancies: candidate.postNames && candidate.postNames.length > 0
          ? candidate.postNames.map((p) => ({
              postName: p,
              totalPosts: Math.max(1, Math.floor(totalVacancies / candidate.postNames!.length)),
            }))
          : [
              {
                postName: "Various Posts / Cadres",
                totalPosts: totalVacancies > 0 ? totalVacancies : 1,
              },
            ],
      },
    };
  }
}
