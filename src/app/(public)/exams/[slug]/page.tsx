import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicExamBySlug } from "@/modules/exams/service";
import { constructMetadata, buildGovExamJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { resolveLocalizedExam } from "@/lib/i18n/localize";
import { LanguageCode } from "@/lib/i18n/config";
import { ExamDetailView } from "@/modules/exams/components/exam-detail-view";

interface ExamDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lang?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: ExamDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const lang = (sParams.lang as LanguageCode) || "en";
  const rawExam = await getPublicExamBySlug(slug);

  if (!rawExam) {
    return constructMetadata({
      title: "Examination Not Found",
      description: "The requested official examination schedule could not be found.",
    });
  }

  const exam = resolveLocalizedExam(rawExam, lang);
  const orgName = exam.organization?.name || "Official Examination Authority";

  return constructMetadata({
    title: exam.meta_title || `${exam.title} - ${exam.organization?.acronym || orgName}`,
    description:
      exam.meta_description ||
      `Official examination schedule and syllabus guide for ${exam.title} conducted by ${orgName}. Check exam dates, shift timings, multi-stage pattern, and eligibility criteria.`,
    path: `/exams/${exam.slug}`,
  });
}

export default async function PublicExamDetailPage({ params }: ExamDetailPageProps) {
  const { slug } = await params;
  const exam = await getPublicExamBySlug(slug);

  if (!exam) {
    notFound();
  }

  const org = exam.organization;
  const dates = exam.important_dates || [];
  const examStartDate = dates.find((d) => d.date_type === "exam_start");
  const examEndDate = dates.find((d) => d.date_type === "exam_end");

  const jsonLd = buildGovExamJsonLd({
    title: exam.title,
    description: exam.description,
    url: `${getCanonicalSiteUrl()}/exams/${exam.slug}`,
    organizationName: org?.name || "Government Authority",
    startDate: examStartDate?.event_date || exam.published_at,
    endDate: examEndDate?.event_date,
    mode: exam.mode,
    datePublished: exam.published_at,
    dateModified: exam.updated_at,
  });

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Multilingual Reactive Detail View */}
      <ExamDetailView exam={exam} />
    </>
  );
}
