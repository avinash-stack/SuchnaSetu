import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicJobBySlug } from "@/modules/jobs/service";
import { constructMetadata, buildJobPostingJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { resolveLocalizedJob } from "@/lib/i18n/localize";
import { LanguageCode } from "@/lib/i18n/config";
import { JobDetailView } from "@/modules/jobs/components/job-detail-view";

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
  const lang = (sParams.lang as LanguageCode) || "en";
  const rawJob = await getPublicJobBySlug(slug);

  if (!rawJob) {
    return constructMetadata({
      title: "Notice Not Found",
      description: "The requested official notice could not be found.",
    });
  }

  const job = resolveLocalizedJob(rawJob, lang);
  const orgName = job.organization?.name || "Government Authority";
  const orgAcronym = job.organization?.acronym || "";
  const postCount = job.total_vacancies ? ` (${job.total_vacancies} Posts)` : "";

  return constructMetadata({
    title: job.meta_title || `${job.title} Recruitment 2026${postCount} - ${orgAcronym || orgName}`,
    description:
      job.meta_description ||
      `Official recruitment notice for ${job.total_vacancies || "multiple"} vacancies by ${orgName}. Check eligibility, online application dates, selection process, and official gazette notification.`,
    path: `/jobs/${job.slug}`,
    keywords: [
      `${job.title} 2026`,
      `${orgAcronym || orgName} Recruitment 2026`,
      `${orgAcronym || orgName} Apply Online`,
      `${job.title} Syllabus`,
      `${job.title} Notification PDF`,
    ],
  });
}

export default async function PublicJobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getPublicJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const org = job.organization;
  const baseUrl = getCanonicalSiteUrl();

  const stateName = job.state_code || (typeof job.state === "string" ? job.state : (job.state as any)?.name) || "All India";

  // Structured JobPosting schema
  const jobPostingJsonLd = buildJobPostingJsonLd({
    title: `${job.title} (${org?.acronym || org?.name || "Govt"})`,
    description: job.summary || `${job.title} official recruitment notification by ${org?.name}.`,
    url: `${baseUrl}/jobs/${job.slug}`,
    organizationName: org?.name || "Government of India",
    organizationUrl: org?.website_url,
    datePosted: job.published_at,
    validThrough: job.application_end_date,
    jobLocationState: stateName,
    totalVacancies: job.total_vacancies,
  });

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Multilingual Reactive Detail View */}
      <JobDetailView job={job} />
    </>
  );
}
