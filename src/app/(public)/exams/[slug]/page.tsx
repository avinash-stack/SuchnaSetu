import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicExamBySlug } from "@/modules/exams/service";
import { constructMetadata, buildGovExamJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
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
  const orgAcronym = exam.organization?.acronym || "";

  return constructMetadata({
    title: exam.meta_title || `${exam.title} 2026 - Notification, Syllabus, Admit Card & Result | ${orgAcronym || orgName}`,
    description:
      exam.meta_description ||
      `Official examination schedule, syllabus, and pattern for ${exam.title} conducted by ${orgName}. Check exam dates, admit card release, answer key, and eligibility.`,
    path: `/exams/${exam.slug}`,
    keywords: [
      `${exam.title} 2026`,
      `${orgAcronym || orgName} Exam Date`,
      `${exam.title} Syllabus PDF`,
      `${exam.title} Admit Card 2026`,
      `${exam.title} Answer Key`,
    ],
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
  const baseUrl = getCanonicalSiteUrl();

  const jsonLd = buildGovExamJsonLd({
    title: `${exam.title} (${org?.acronym || org?.name || "Official"})`,
    description: exam.description,
    url: `${baseUrl}/exams/${exam.slug}`,
    organizationName: org?.name || "Government Authority",
    startDate: examStartDate?.event_date || exam.published_at,
    endDate: examEndDate?.event_date,
    mode: exam.mode,
    datePublished: exam.published_at,
    dateModified: exam.updated_at,
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Examinations", url: "/exams" },
    ...(exam.state_code ? [{ name: exam.state_code, url: `/state/${exam.state_code.toLowerCase()}` }] : []),
    { name: exam.title, url: `/exams/${exam.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Multilingual Reactive Detail View */}
      <ExamDetailView exam={exam} />
    </>
  );
}
