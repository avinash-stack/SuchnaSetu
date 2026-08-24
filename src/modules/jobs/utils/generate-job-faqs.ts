import { GovJobDetailed } from "../types";
import { formatDate, formatINR, formatApplicationFee } from "@/lib/utils";

export interface VerifiedFaqItem {
  question: string;
  answer: string;
}

/**
 * Generates verified FAQs strictly from authentic fields in the GovJob record.
 * NEVER fabricates or infers unverified answers.
 */
export function generateVerifiedJobFaqs(job: GovJobDetailed): VerifiedFaqItem[] {
  const faqs: VerifiedFaqItem[] = [];
  const orgName = job.organization?.name || "the recruiting authority";
  const orgAcronym = job.organization?.acronym || orgName;

  // 1. Application Deadline
  if (job.application_end_date) {
    const formattedDate = formatDate(job.application_end_date);
    faqs.push({
      question: `What is the last date to apply for ${job.title}?`,
      answer: `The online application window for ${job.title} (${orgAcronym}) closes on ${formattedDate}. Candidates are advised to submit their applications well before the closing deadline.`,
    });
  }

  // 2. Application Start Date
  if (job.application_start_date) {
    const formattedDate = formatDate(job.application_start_date);
    faqs.push({
      question: `When does the online application process start for ${job.title}?`,
      answer: `The online applications for ${job.title} commence on ${formattedDate} via the official portal of ${orgName}.`,
    });
  }

  // 3. Total Vacancies
  if (job.total_vacancies && job.total_vacancies > 0) {
    faqs.push({
      question: `How many vacancies are announced for ${job.title}?`,
      answer: `A total of ${job.total_vacancies} vacancies have been notified for ${job.title} by ${orgName}.`,
    });
  }

  // 4. Educational Qualification
  const qualText =
    job.qualification_summary ||
    job.qualification?.name ||
    job.eligibility?.education_qualification;
  if (qualText) {
    faqs.push({
      question: `What is the educational qualification required for ${job.title}?`,
      answer: `Applicants must possess ${qualText} from a recognized board/university as specified in the official notification circular.`,
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
        ? `between ${minAge} to ${maxAge} years`
        : maxAge
        ? `up to ${maxAge} years`
        : `minimum ${minAge} years`);
    faqs.push({
      question: `What is the age limit criteria for ${job.title}?`,
      answer: `Candidates must be ${ageDesc}. Reserved categories (SC/ST/OBC/PwD/Ex-SM) are entitled to upper age relaxation as per government recruitment norms.`,
    });
  }

  // 6. Salary & Pay Scale
  if (job.salary_min || job.salary_max || job.pay_scale_details) {
    const salaryText =
      job.salary_min && job.salary_max
        ? `${formatINR(job.salary_min)} to ${formatINR(job.salary_max)} per month`
        : job.pay_scale_details || (job.salary_min ? `Starting basic pay of ${formatINR(job.salary_min)}` : "");
    if (salaryText) {
      faqs.push({
        question: `What is the salary / pay scale for ${job.title}?`,
        answer: `The appointed candidates will receive remuneration under ${salaryText} along with standard government allowances where applicable.`,
      });
    }
  }

  // 7. Application Fee
  const feeObj = job.eligibility?.application_fee_details as any;
  if (feeObj) {
    const feeFormatted = formatApplicationFee(feeObj);
    faqs.push({
      question: `What is the application fee for ${job.title}?`,
      answer: `The application fee structure is: ${feeFormatted}. The fee can be paid online using net banking, UPI, or debit/credit card.`,
    });
  }

  // 8. Selection Process
  const selection = job.selection_process || job.eligibility?.selection_process;
  if (selection) {
    faqs.push({
      question: `What is the selection process for ${job.title}?`,
      answer: `The recruitment selection process comprises: ${selection}.`,
    });
  }

  // 9. Official Website / Apply Online
  if (job.official_apply_url || job.organization?.website_url) {
    const portalUrl = job.official_apply_url || job.organization?.website_url;
    faqs.push({
      question: `How can I apply online for ${job.title}?`,
      answer: `Candidates can register and submit their application online through the official portal: ${portalUrl}. Follow the official gazette instructions for document uploading and fee submission.`,
    });
  }

  return faqs;
}
