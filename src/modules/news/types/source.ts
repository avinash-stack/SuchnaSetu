export type NewsSourceType = "rss" | "atom" | "api" | "json";

export interface NewsSource {
  id: string;
  code: string;
  name: string;
  website_url: string;
  feed_url: string;
  source_type: NewsSourceType;
  default_category?: string | null;
  state_code?: string | null;
  country: string;
  is_enabled: boolean;
  priority: number;
  fetch_interval_minutes: number;
  last_synced_at?: string | null;
  last_error?: string | null;
  failure_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface RawNewsFeedItem {
  guid?: string;
  title: string;
  link: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  author?: string;
  creator?: string;
  categories?: string[];
  enclosure?: {
    url?: string;
    type?: string;
  };
  mediaThumbnail?: {
    url?: string;
  };
}
