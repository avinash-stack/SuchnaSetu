export interface NewsCategory {
  slug: string;
  name: string;
  name_hi: string;
  description?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export type NewsCategorySlug =
  | "india"
  | "states"
  | "education"
  | "governance"
  | "business"
  | "technology"
  | "politics"
  | "world"
  | "health"
  | "sports"
  | "entertainment";
