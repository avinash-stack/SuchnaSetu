import { NewsSource, RawNewsFeedItem } from "../types/source";

export interface NormalizedNewsPayload {
  title: string;
  summary: string;
  content?: string | null;
  sourceUrl: string;
  canonicalUrl?: string | null;
  author?: string | null;
  imageUrl?: string | null;
  imageCaption?: string | null;
  publishedAt: string;
  categorySlug?: string;
  stateCode?: string | null;
  tags?: string[];
  rawItem: RawNewsFeedItem;
}

export interface NewsSourceAdapter {
  source: NewsSource;
  fetch(): Promise<RawNewsFeedItem[]>;
  normalize(rawItem: RawNewsFeedItem): Promise<NormalizedNewsPayload | null>;
}
