import { GovJobDetailed } from "../types";
import { formatDate, formatINR, formatApplicationFee } from "@/lib/utils";
import { LanguageCode } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

export interface VerifiedFaqItem {
  question: string;
  answer: string;
}

/**
 * Generates verified FAQs strictly from authentic fields in the GovJob record.
 * Localized across supported Indic languages.
 */
export function generateVerifiedJobFaqs(
  job: GovJobDetailed,
  lang: LanguageCode = "en"
): VerifiedFaqItem[] {
  const faqs: VerifiedFaqItem[] = [];
  const orgName = job.organization?.name || "the recruiting authority";
  const orgAcronym = job.organization?.acronym || orgName;

  // 1. Application Deadline
  if (job.application_end_date) {
    const formattedDate = formatDate(job.application_end_date);
    faqs.push({
      question: getTranslation(lang, "faq.last_date_q", { title: job.title }),
      answer: getTranslation(lang, "faq.last_date_a", {
        title: job.title,
        org: orgAcronym,
        date: formattedDate,
      }),
    });
  }

  // 2. Application Start Date
  if (job.application_start_date) {
    const formattedDate = formatDate(job.application_start_date);
    faqs.push({
      question: getTranslation(lang, "faq.start_date_q", { title: job.title }),
      answer: getTranslation(lang, "faq.start_date_a", {
        title: job.title,
        org: orgName,
        date: formattedDate,
      }),
    });
  }

  // 3. Total Vacancies
  if (job.total_vacancies && job.total_vacancies > 0) {
    faqs.push({
      question: getTranslation(lang, "faq.vacancies_q", { title: job.title }),
      answer: getTranslation(lang, "faq.vacancies_a", {
        title: job.title,
        org: orgName,
        count: job.total_vacancies,
      }),
    });
  }

  // 4. Educational Qualification
  const qualText =
    job.qualification_summary ||
    job.qualification?.name ||
    job.eligibility?.education_qualification;
  if (qualText) {
    faqs.push({
      question: getTranslation(lang, "faq.qualification_q", { title: job.title }),
      answer: getTranslation(lang, "faq.qualification_a", {
        title: job.title,
        qualification: qualText,
      }),
    });
  }

  // 5. Age Limit
  const minAge = job.eligibility?.min_age;
  const maxAge = job.eligibility?.max_age;
  const ageSummary = job.age_limit_summary;
  if (ageSummary || minAge || maxAge) {
    const ageDesc =
      ageSummary ||
      (minAge && maxAge
        ? `${minAge} - ${maxAge} Years`
        : maxAge
        ? `Up to ${maxAge} Years`
        : `Minimum ${minAge} Years`);
    faqs.push({
      question: getTranslation(lang, "faq.age_limit_q", { title: job.title }),
      answer: getTranslation(lang, "faq.age_limit_a", {
        title: job.title,
        ageLimit: ageDesc,
      }),
    });
  }

  // 6. Application Fee
  const feeObj = job.eligibility?.application_fee_details as any;
  if (feeObj) {
    const feeFormatted = formatApplicationFee(feeObj);
    faqs.push({
      question: getTranslation(lang, "faq.fee_q", { title: job.title }),
      answer: getTranslation(lang, "faq.fee_a", {
        title: job.title,
        fee: feeFormatted || "Refer official notification",
      }),
    });
  }

  // 7. Selection Process
  const selection = job.selection_process || job.eligibility?.selection_process;
  if (selection) {
    faqs.push({
      question: getTranslation(lang, "faq.selection_q", { title: job.title }),
      answer: getTranslation(lang, "faq.selection_a", {
        title: job.title,
        process: selection || "Standard Recruitment Examination",
      }),
    });
  }

  return faqs;
}
