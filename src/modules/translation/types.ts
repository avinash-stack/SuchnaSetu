import { LanguageCode } from "@/lib/i18n/config";

export interface TranslationInputItem {
  id: string;
  type: "job" | "exam" | "bulletin";
  title: string;
  post_name?: string | null;
  qualification_summary?: string | null;
  age_limit_summary?: string | null;
  pay_scale_summary?: string | null;
  selection_process?: string | null;
  description?: string | null;
  summary?: string | null;
  short_title?: string | null;
  eligibility_summary?: string | null;
  content?: string | null;
}

export interface TranslatedOutputItem {
  id: string;
  language_code: LanguageCode;
  title: string;
  post_name?: string | null;
  qualification_summary?: string | null;
  age_limit_summary?: string | null;
  pay_scale_summary?: string | null;
  selection_process?: string | null;
  description?: string | null;
  summary?: string | null;
  short_title?: string | null;
  eligibility_summary?: string | null;
  content?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface TranslationBatchResult {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
}
