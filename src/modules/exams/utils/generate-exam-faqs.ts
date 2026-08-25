import { GovExamDetailed } from "../types";
import { formatDate, formatApplicationFee } from "@/lib/utils";
import { LanguageCode } from "@/lib/i18n/config";

export interface VerifiedFaqItem {
  question: string;
  answer: string;
}

/**
 * Generates verified FAQs strictly from authentic fields in the GovExam record.
 * Localized across supported Indic languages.
 */
export function generateVerifiedExamFaqs(
  exam: GovExamDetailed,
  lang: LanguageCode = "en"
): VerifiedFaqItem[] {
  const faqs: VerifiedFaqItem[] = [];
  const orgName = exam.organization?.name || "the conducting authority";
  const orgAcronym = exam.organization?.acronym || orgName;

  const dates = exam.important_dates || [];
  const appEnd = dates.find(
    (d) => d.date_type === "application_end" || d.title.toLowerCase().includes("last") || d.title.toLowerCase().includes("closing")
  );
  const examStart = dates.find(
    (d) => d.date_type === "exam_start" || d.title.toLowerCase().includes("exam")
  );

  // 1. Exam Date
  if (examStart?.event_date) {
    const formatted = formatDate(examStart.event_date);
    if (lang === "hi") {
      faqs.push({
        question: `${exam.title} परीक्षा का आयोजन कब किया जाएगा?`,
        answer: `${exam.title} की परीक्षा ${orgName} द्वारा ${formatted} से आयोजित की जानी निर्धारित है।`,
      });
    } else {
      faqs.push({
        question: `When will the ${exam.title} examination be conducted?`,
        answer: `The ${exam.title} is scheduled to be held starting from ${formatted} by ${orgName}.`,
      });
    }
  }

  // 2. Application Closing Date
  if (appEnd?.event_date) {
    const formatted = formatDate(appEnd.event_date);
    if (lang === "hi") {
      faqs.push({
        question: `${exam.title} के लिए पंजीकरण करने की अंतिम तिथि क्या है?`,
        answer: `${exam.title} के लिए ऑनलाइन पंजीकरण की अंतिम तिथि ${formatted} है।`,
      });
    } else {
      faqs.push({
        question: `What is the last date to register for ${exam.title}?`,
        answer: `The online registration window for ${exam.title} concludes on ${formatted}.`,
      });
    }
  }

  // 3. Conducting Authority
  if (lang === "hi") {
    faqs.push({
      question: `${exam.title} परीक्षा का आयोजन किस आयोग द्वारा किया जाता है?`,
      answer: `${exam.title} का आधिकारिक संचालन ${orgName} (${orgAcronym}) द्वारा किया जाता है।`,
    });
  } else {
    faqs.push({
      question: `Which authority conducts ${exam.title}?`,
      answer: `${exam.title} is officially conducted by ${orgName} (${orgAcronym}).`,
    });
  }

  // 4. Examination Mode & Pattern
  if (exam.pattern_description || exam.mode) {
    if (lang === "hi") {
      faqs.push({
        question: `${exam.title} का परीक्षा पैटर्न और माध्यम क्या है?`,
        answer: exam.pattern_description || `यह परीक्षा आधिकारिक नियमों के तहत आयोजित की जाती है।`,
      });
    } else {
      faqs.push({
        question: `What is the exam pattern and scheme for ${exam.title}?`,
        answer: exam.pattern_description || `The examination is conducted as per official syllabus and scheme.`,
      });
    }
  }

  return faqs;
}
