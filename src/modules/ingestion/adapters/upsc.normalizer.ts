import { DataNormalizer } from "../interfaces/normalizer.interface";
import { IngestionContext } from "../interfaces/adapter.interface";
import { RawItem, NormalizationResult, NormalizedJobNotice } from "../types";
import { UpscNoticeRawPayload } from "./upsc.adapter";
import { slugify } from "@/lib/utils";

/**
 * Normalizer for UPSC Recruitment and Examination notice payloads.
 * Transforms raw UPSC feeds into canonical NormalizedJobNotice domain models.
 */
export class UpscDataNormalizer implements DataNormalizer<UpscNoticeRawPayload, NormalizedJobNotice> {
  readonly adapterKey = "upsc_official_feed";

  async normalize(
    rawItem: RawItem<UpscNoticeRawPayload>,
    context: IngestionContext
  ): Promise<NormalizationResult<NormalizedJobNotice>> {
    const raw = rawItem.rawPayload;

    if (!raw.advertisement_number || !raw.title) {
      return {
        success: false,
        naturalKey: `upsc:${raw.advertisement_number || "missing_advt"}`,
        errors: ["Missing mandatory advertisement_number or title"],
      };
    }

    try {
      // 1. Generate clean deterministic slug
      const baseSlug = slugify(`upsc-${raw.title}-${raw.advertisement_number}`);
      const cleanSlug = baseSlug.length > 100 ? baseSlug.slice(0, 100).replace(/-+$/, "") : baseSlug;

      // 2. Parse application start & end dates
      const startDate = this.parseDate(raw.date_of_notification);
      const endDate = this.parseDate(raw.closing_date);

      // 3. Resolve category slug
      const categorySlug = this.resolveCategory(raw.category_code, raw.title);

      // 4. Calculate approximate reservation breakdown if vacancies > 0
      const totalPosts = Math.max(1, raw.total_vacancies || 1);
      const urPosts = Math.max(1, Math.floor(totalPosts * 0.40));
      const obcPosts = Math.floor(totalPosts * 0.27);
      const scPosts = Math.floor(totalPosts * 0.15);
      const stPosts = Math.floor(totalPosts * 0.075);
      const ewsPosts = Math.floor(totalPosts * 0.10);
      const pwdPosts = Math.floor(totalPosts * 0.04);

      // 5. Construct canonical NormalizedJobNotice
      const normalizedNotice: NormalizedJobNotice = {
        title: raw.title,
        slug: cleanSlug,
        notificationNumber: raw.advertisement_number,
        organizationSlug: "upsc",
        categorySlug,
        employmentType: "permanent",
        totalVacancies: totalPosts,
        payScaleDetails: raw.pay_scale || "Pay Level as per 7th Central Pay Commission (CPC)",
        officialNotificationUrl: raw.pdf_url,
        officialApplyUrl: raw.apply_url || "https://upsconline.nic.in",
        summary: `Official recruitment notification by Union Public Service Commission (Advt No. ${raw.advertisement_number}) for ${totalPosts} vacancies across ${raw.ministry_or_department || "Government of India cadres"}.`,
        applicationStartDate: startDate,
        applicationEndDate: endDate,
        vacancies: [
          {
            postName: raw.post_name || raw.title,
            postCode: raw.advertisement_number,
            totalPosts,
            urPosts,
            obcPosts,
            scPosts,
            stPosts,
            ewsPosts,
            pwdPosts,
            payLevel: raw.pay_scale?.match(/Level-\d+/i)?.[0] || "Level-10",
          },
        ],
        importantDates: [
          {
            eventName: "Notification Released / Application Window Opens",
            eventDate: startDate,
            eventDateText: raw.date_of_notification || "Active",
            isTentative: false,
            displayOrder: 1,
          },
          {
            eventName: "Online Application Closing Date",
            eventDate: endDate,
            eventDateText: raw.closing_date || "Refer to Official Notification",
            isTentative: false,
            displayOrder: 2,
          },
        ],
        eligibility: {
          educationQualification: raw.qualification_summary || "Degree from a recognized University or equivalent (Refer to official notice for detailed discipline criteria).",
          ageRelaxationDetails: raw.age_limit_summary || "Age relaxations applicable as per Government of India rules for SC/ST/OBC/PwD/Ex-Servicemen.",
          selectionProcess: "Written Examination / Computer-based Screening followed by Document Verification & Personality Test (Interview).",
          applicationFeeDetails: {
            general_obc_ews: 25,
            sc_st_pwd_women: 0,
            payment_mode: "Online via SBI Net Banking / Visa / MasterCard / RuPay / UPI",
          },
        },
        officialDocuments: [
          {
            documentType: "full_notification",
            title: `Official UPSC Notification (Advt. No. ${raw.advertisement_number})`,
            fileUrl: raw.pdf_url,
            publishedDate: raw.date_of_notification ? this.formatIsoDateOnly(startDate) : undefined,
          },
        ],
      };

      const sanitizedAdvt = raw.advertisement_number.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
      const naturalKey = `upsc:notice:${sanitizedAdvt}`;

      return {
        success: true,
        naturalKey,
        data: normalizedNotice,
      };
    } catch (err: any) {
      return {
        success: false,
        naturalKey: `upsc:${raw.advertisement_number}`,
        errors: [`Normalization error: ${err?.message || "Unknown error"}`],
      };
    }
  }

  /**
   * Helper: Parse varied Indian date strings (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD)
   */
  private parseDate(dateStr?: string): Date | null {
    if (!dateStr) return null;
    const clean = dateStr.trim();

    // Check DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const parsed = new Date(Date.UTC(year, month, day, 18, 29, 59)); // 23:59 IST is 18:29 UTC
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Standard ISO fallback
    const isoParsed = new Date(clean);
    return isNaN(isoParsed.getTime()) ? null : isoParsed;
  }

  /**
   * Helper: Format Date to YYYY-MM-DD
   */
  private formatIsoDateOnly(date: Date | null): string | undefined {
    if (!date) return undefined;
    try {
      return date.toISOString().split("T")[0];
    } catch {
      return undefined;
    }
  }

  /**
   * Helper: Maps raw category tags or notice keywords to canonical taxonomy slugs
   */
  private resolveCategory(categoryCode?: string, title?: string): string {
    if (categoryCode) return categoryCode;

    const lowerTitle = (title || "").toLowerCase();
    if (lowerTitle.includes("medical") || lowerTitle.includes("professor") || lowerTitle.includes("health")) {
      return "healthcare-medical";
    }
    if (lowerTitle.includes("engineer") || lowerTitle.includes("technical") || lowerTitle.includes("scientific")) {
      return "engineering-technical";
    }
    if (lowerTitle.includes("defence") || lowerTitle.includes("cds") || lowerTitle.includes("nda") || lowerTitle.includes("police")) {
      return "defence-security";
    }
    if (lowerTitle.includes("bank") || lowerTitle.includes("finance") || lowerTitle.includes("accounts")) {
      return "banking-financial";
    }
    if (lowerTitle.includes("railway") || lowerTitle.includes("rrb")) {
      return "railways";
    }
    if (lowerTitle.includes("teaching") || lowerTitle.includes("lecturer") || lowerTitle.includes("university")) {
      return "teaching-research";
    }

    return "central-govt";
  }
}
