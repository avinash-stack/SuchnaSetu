export interface ResourceFaq {
  question: string;
  answer: string;
  question_hi?: string;
  answer_hi?: string;
}

export interface CareerResourceCategory {
  slug: string;
  name: string;
  name_hi: string;
  description: string | null;
  display_order: number;
  icon: string;
  is_active: boolean;
}

export interface CareerResource {
  id: string;
  slug: string;
  title: string;
  title_hi: string | null;
  excerpt: string;
  excerpt_hi: string | null;
  content: string;
  content_hi: string | null;
  category_slug: string;
  category?: CareerResourceCategory;
  tags: string[];
  target_exam_ids?: string[];
  target_job_ids?: string[];
  faqs: ResourceFaq[];
  reading_time_minutes: number;
  status: "published" | "draft" | "archived";
  author_name: string;
  author_role: string;
  featured_image: string | null;
  view_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceFilterParams {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ResourceListResult {
  items: CareerResource[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface GeneratedResourcePayload {
  title: string;
  title_hi: string;
  slug: string;
  category_slug: string;
  excerpt: string;
  excerpt_hi: string;
  content: string;
  content_hi: string;
  tags: string[];
  faqs: ResourceFaq[];
  reading_time_minutes: number;
}
