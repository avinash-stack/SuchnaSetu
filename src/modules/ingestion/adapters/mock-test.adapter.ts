import { BaseSourceAdapter } from "./base.adapter";
import { DataNormalizer } from "../interfaces/normalizer.interface";
import { IngestionContext } from "../interfaces/adapter.interface";
import {
  ImportSource,
  ExtractionResult,
  RawItem,
  NormalizationResult,
  NormalizedJobNotice,
} from "../types";

export interface MockNoticeRawItem {
  id: string;
  notice_title: string;
  commission_code: string;
  category_tag: string;
  vacancies: number;
  pdf_link: string;
  apply_link?: string;
  min_education: string;
}

/**
 * Reference Mock Adapter used for architectural validation and test harnesses.
 */
export class MockBenchmarkSourceAdapter extends BaseSourceAdapter<any, MockNoticeRawItem> {
  readonly key = "benchmark_mock_adapter";
  readonly name = "Benchmark Test Feed Adapter";
  readonly targetModule = "jobs";

  async testConnection(source: ImportSource): Promise<{ success: boolean; message?: string }> {
    return { success: true, message: "Mock connection verified successfully" };
  }

  async extract(context: IngestionContext): Promise<ExtractionResult<MockNoticeRawItem>> {
    await context.log("info", "extract", "Generating structured benchmark test payloads");

    const sampleItems: MockNoticeRawItem[] = [
      {
        id: "UPSC-CSE-2026-MOCK",
        notice_title: "UPSC Civil Services Examination 2026 Benchmark Feed",
        commission_code: "upsc",
        category_tag: "civil-services-administrative",
        vacancies: 1105,
        pdf_link: "https://upsc.gov.in/notices/cse-2026.pdf",
        apply_link: "https://upsconline.nic.in",
        min_education: "Graduate degree in any discipline from a recognized University",
      },
    ];

    return {
      items: sampleItems.map((item) => ({
        externalId: item.id,
        rawPayload: item,
        contentType: "application/json",
        extractedAt: new Date(),
      })),
      hasMore: false,
    };
  }
}

/**
 * Normalizer paired with the benchmark mock adapter
 */
export class MockBenchmarkDataNormalizer implements DataNormalizer<MockNoticeRawItem, NormalizedJobNotice> {
  readonly adapterKey = "benchmark_mock_adapter";

  async normalize(
    rawItem: RawItem<MockNoticeRawItem>,
    context: IngestionContext
  ): Promise<NormalizationResult<NormalizedJobNotice>> {
    const raw = rawItem.rawPayload;

    if (!raw.notice_title || !raw.commission_code) {
      return {
        success: false,
        naturalKey: raw.id || "unknown",
        errors: ["Missing required notice title or commission code"],
      };
    }

    const normalizedNotice: NormalizedJobNotice = {
      title: raw.notice_title,
      slug: `mock-${raw.commission_code}-${Date.now().toString().slice(-4)}`,
      notificationNumber: raw.id,
      organizationSlug: raw.commission_code,
      categorySlug: raw.category_tag,
      employmentType: "permanent",
      totalVacancies: raw.vacancies,
      officialNotificationUrl: raw.pdf_link,
      officialApplyUrl: raw.apply_link,
      summary: `Automated normalized recruitment notice from ${raw.commission_code.toUpperCase()}.`,
      eligibility: {
        educationQualification: raw.min_education,
      },
      vacancies: [
        {
          postName: "General Cadre Executive",
          totalPosts: raw.vacancies,
          urPosts: Math.floor(raw.vacancies * 0.4),
          obcPosts: Math.floor(raw.vacancies * 0.27),
          scPosts: Math.floor(raw.vacancies * 0.15),
          stPosts: Math.floor(raw.vacancies * 0.075),
          ewsPosts: Math.floor(raw.vacancies * 0.1),
        },
      ],
    };

    return {
      success: true,
      naturalKey: `mock:${raw.commission_code}:${raw.id}`,
      data: normalizedNotice,
    };
  }
}
