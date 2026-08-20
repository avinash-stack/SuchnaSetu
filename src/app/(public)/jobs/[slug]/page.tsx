import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicJobBySlug } from "@/modules/jobs/service";
import { constructMetadata, buildGovNoticeJsonLd } from "@/lib/seo";
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

  return constructMetadata({
    title: job.meta_title || `${job.title} - ${job.organization?.acronym || orgName}`,
    description:
      job.meta_description ||
      `Official recruitment notice for ${job.total_vacancies} vacancies by ${orgName}. Check eligibility, dates, reservation breakdown, and official gazette notification.`,
    path: `/jobs/${job.slug}`,
  });
}

export default async function PublicJobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getPublicJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const org = job.organization;
  const jsonLd = buildGovNoticeJsonLd({
    title: job.title,
    description: job.summary || `${job.title} by ${org?.name || "Government"}`,
    url: `${getCanonicalSiteUrl()}/jobs/${job.slug}`,
    organizationName: org?.name || "Government of India",
    datePublished: job.published_at,
    dateModified: job.updated_at,
  });

  return (
    <>
      {/* Inject Structured JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Multilingual Reactive Detail View */}
      <JobDetailView job={job} />
    </>
  );
}
