import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicJobBySlug } from "@/modules/jobs/service";
import { constructMetadata, buildJobPostingJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { resolveLocalizedJob } from "@/lib/i18n/localize";
import { LanguageCode } from "@/lib/i18n/config";
import { JobDetailView } from "@/modules/jobs/components/job-detail-view";

export const revalidate = 300; // 5 minutes cache for high performance & instant mobile rendering

interface JobDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lang?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const requestedLang = (sParams.lang as LanguageCode) || "en";
  const rawJob = await getPublicJobBySlug(slug);

  if (!rawJob) {
    return constructMetadata({
      title: "Notice Not Found",
      description: "The requested official notice could not be found.",
    });
  }

  const translations = (rawJob.translations || []) as any[];
  const hasGenuineRequestedTranslation = requestedLang === "en" || translations.some((t) => t.language_code === requestedLang);
  const isUntranslatedParameterRequest = requestedLang !== "en" && !hasGenuineRequestedTranslation;

  // Build authentic available languages dictionary only for genuine translations
  const availableLanguages: Record<string, string> = {};
  translations.forEach((t) => {
    if (t.language_code && t.language_code !== "en") {
      availableLanguages[t.language_code] = `${getCanonicalSiteUrl()}/jobs/${rawJob.slug}?lang=${t.language_code}`;
    }
  });

  const job = resolveLocalizedJob(rawJob, requestedLang);
  const orgName = job.organization?.name || "Government Authority";
  const orgAcronym = job.organization?.acronym || "";
  const postCount = job.total_vacancies ? ` (${job.total_vacancies} Posts)` : "";

  return constructMetadata({
    title: job.meta_title || `${job.title} Recruitment 2026${postCount} - ${orgAcronym || orgName}`,
    description:
      job.meta_description ||
      `Official recruitment notice for ${job.total_vacancies || "multiple"} vacancies by ${orgName}. Check eligibility, online application dates, selection process, and official gazette notification.`,
    path: `/jobs/${rawJob.slug}`,
    canonicalPath: `/jobs/${rawJob.slug}`,
    noIndex: isUntranslatedParameterRequest, // Prevent Google from indexing untranslated parameter fallback URLs
    availableLanguages: Object.keys(availableLanguages).length > 0 ? availableLanguages : undefined,
    keywords: [
      `${job.title} 2026`,
      `${orgAcronym || orgName} Recruitment 2026`,
      `${orgAcronym || orgName} Apply Online`,
      `${job.title} Syllabus`,
      `${job.title} Notification PDF`,
    ],
  });
}

export default async function PublicJobDetailPage({ params, searchParams }: JobDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedLang = resolvedSearchParams?.lang || "en";

  const job = await getPublicJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const translations = job.translations || [];
  const hasRequestedTranslation = requestedLang === "en" || translations.some((t) => t.language_code === requestedLang);
  const isUntranslatedParam = requestedLang !== "en" && !hasRequestedTranslation;

  const org = job.organization;
  const baseUrl = getCanonicalSiteUrl();

  // Structured JobPosting schema (only emitted for canonical and genuine translated pages)
  const jobPostingJsonLd = !isUntranslatedParam
    ? buildJobPostingJsonLd({
        title: `${job.title} (${org?.acronym || org?.name || "Govt"})`,
        description: job.summary || `${job.title} official recruitment notification by ${org?.name || "Government of India"}.`,
        url: `${baseUrl}/jobs/${job.slug}`,
        organizationName: org?.name || "Government of India",
        organizationUrl: org?.website_url,
        datePosted: job.published_at,
        validThrough: job.application_end_date,
        stateCode: job.state_code,
        jobLocationState: typeof job.state === "string" ? job.state : job.state?.name,
        employmentType: job.employment_type,
        totalVacancies: job.total_vacancies,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        payScaleDetails: job.pay_scale_details,
        educationRequirements: job.eligibility?.education_qualification || job.qualification_summary || job.qualification?.name,
        experienceRequirements: job.eligibility?.experience_details,
        directApplyUrl: job.official_apply_url,
      })
    : null;

  // Structured Breadcrumbs schema
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Government Jobs", url: "/jobs" },
    ...(job.state_code ? [{ name: job.state_code, url: `/state/${job.state_code.toLowerCase()}` }] : []),
    { name: job.title, url: `/jobs/${job.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      {/* Inject Google Search Central Structured Data */}
      {jobPostingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Multilingual Reactive Detail View */}
      <JobDetailView job={job} />
    </>
  );
}
