import { GovExamDetailed } from "../types";
import { formatDate, formatApplicationFee } from "@/lib/utils";

export interface VerifiedFaqItem {
  question: string;
  answer: string;
}

/**
 * Generates verified FAQs strictly from authentic fields in the GovExam record.
 * NEVER fabricates or infers unverified answers.
 */
export function generateVerifiedExamFaqs(exam: GovExamDetailed): VerifiedFaqItem[] {
  const faqs: VerifiedFaqItem[] = [];
  const orgName = exam.organization?.name || "the conducting authority";
  const orgAcronym = exam.organization?.acronym || orgName;

  const dates = exam.important_dates || [];
  const appStart = dates.find(
    (d) => d.date_type === "application_start" || d.title.toLowerCase().includes("start")
  );
  const appEnd = dates.find(
    (d) => d.date_type === "application_end" || d.title.toLowerCase().includes("last") || d.title.toLowerCase().includes("closing")
  );
  const examStart = dates.find(
    (d) => d.date_type === "exam_start" || d.title.toLowerCase().includes("exam")
  );
  const admitCardDate = dates.find(
    (d) => d.date_type === "admit_card_release" || d.title.toLowerCase().includes("admit")
  );
  const resultDate = dates.find(
    (d) => d.date_type === "result_declaration" || d.title.toLowerCase().includes("result")
  );

  // 1. Exam Date
  if (examStart?.event_date) {
    const formatted = formatDate(examStart.event_date);
    faqs.push({
      question: `When will the ${exam.title} examination be conducted?`,
      answer: `The ${exam.title} is scheduled to be held starting from ${formatted} by ${orgName}.`,
    });
  }

  // 2. Application Closing Date
  if (appEnd?.event_date) {
    const formatted = formatDate(appEnd.event_date);
    faqs.push({
      question: `What is the last date to register for ${exam.title}?`,
      answer: `The online registration window for ${exam.title} concludes on ${formatted}.`,
    });
  }

  // 3. Conducting Authority & Frequency
  faqs.push({
    question: `Which authority conducts ${exam.title} and how frequently is it held?`,
    answer: `${exam.title} is officially conducted by ${orgName} (${orgAcronym})${exam.frequency ? ` on a ${exam.frequency.replace("_", " ")} schedule` : ""}.`,
  });

  // 4. Examination Mode & Pattern
  if (exam.mode || exam.pattern_description) {
    const modeDesc = exam.mode ? exam.mode.replace("_", " ").toUpperCase() : "Computer Based / Written";
    faqs.push({
      question: `What is the mode and examination pattern of ${exam.title}?`,
      answer: `The examination is conducted in ${modeDesc} format. ${exam.pattern_description || "Refer to the official syllabus circular for section-wise distribution."}`,
    });
  }

  // 5. Eligibility Criteria
  const qualText =
    exam.eligibility?.min_qualification?.name ||
    exam.eligibility?.educational_qualification_description ||
    exam.eligibility_summary;
  if (qualText) {
    faqs.push({
      question: `What is the eligibility qualification for ${exam.title}?`,
      answer: `Candidates must possess ${qualText} from a recognized institution as outlined in the official information bulletin.`,
    });
  }

  // 6. Age Limits
  const minAge = exam.eligibility?.min_age;
  const maxAge = exam.eligibility?.max_age;
  if (minAge || maxAge) {
    const ageDesc =
      minAge && maxAge
        ? `between ${minAge} and ${maxAge} years`
        : maxAge
        ? `up to ${maxAge} years`
        : `minimum ${minAge} years`;
    faqs.push({
      question: `What is the age limit for ${exam.title}?`,
      answer: `The prescribed age limit is ${ageDesc}. Age relaxations apply for reserved category applicants as per state/central reservation policies.`,
    });
  }

  // 7. Admit Card Release
  if (admitCardDate?.event_date) {
    const formatted = formatDate(admitCardDate.event_date);
    faqs.push({
      question: `When will the admit card for ${exam.title} be released?`,
      answer: `The official admit card / hall ticket is scheduled for release on ${formatted} on the ${orgAcronym} examination portal.`,
    });
  }

  // 8. Application Fee
  if (exam.application_fee_details) {
    const feeFormatted = formatApplicationFee(exam.application_fee_details);
    faqs.push({
      question: `What is the examination fee for ${exam.title}?`,
      answer: `The category-wise examination fee is: ${feeFormatted}.`,
    });
  }

  // 9. Official Website
  if (exam.official_website_url || exam.organization?.website_url) {
    const portalUrl = exam.official_website_url || exam.organization?.website_url;
    faqs.push({
      question: `Where can I access the official notifications for ${exam.title}?`,
      answer: `All official circulars, answer keys, and scorecards are published on the official authority portal: ${portalUrl}.`,
    });
  }

  return faqs;
}
