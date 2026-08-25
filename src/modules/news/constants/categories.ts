import { NewsCategory } from "../types/category";

export const NEWS_CATEGORIES: NewsCategory[] = [
  {
    slug: "india",
    name: "India",
    name_hi: "भारत / राष्ट्रीय",
    description: "National affairs, union developments, policy, and national milestones.",
    display_order: 1,
    is_active: true,
  },
  {
    slug: "states",
    name: "States & Regional",
    name_hi: "राज्य एवं प्रादेशिक",
    description: "State government decisions, regional developments, and local governance.",
    display_order: 2,
    is_active: true,
  },
  {
    slug: "education",
    name: "Education & Youth",
    name_hi: "शिक्षा एवं युवा",
    description: "Academic reforms, admissions, university councils, board exams, and youth policies.",
    display_order: 3,
    is_active: true,
  },
  {
    slug: "governance",
    name: "Govt & Public Affairs",
    name_hi: "शासन एवं लोक मामले",
    description: "Cabinet decisions, citizen charters, public welfare schemes, and administrative circulars.",
    display_order: 4,
    is_active: true,
  },
  {
    slug: "business",
    name: "Business & Economy",
    name_hi: "व्यापार एवं अर्थव्यवस्था",
    description: "Union budget, RBI monetary policies, employment trends, markets, and infrastructure.",
    display_order: 5,
    is_active: true,
  },
  {
    slug: "technology",
    name: "Technology & Science",
    name_hi: "प्रौद्योगिकी एवं विज्ञान",
    description: "Digital India, space programs, AI governance, cyber initiatives, and scientific research.",
    display_order: 6,
    is_active: true,
  },
  {
    slug: "politics",
    name: "Politics & Policy",
    name_hi: "राजनीति एवं नीति",
    description: "Legislative assemblies, parliamentary debates, constitutional reforms, and policy decisions.",
    display_order: 7,
    is_active: true,
  },
  {
    slug: "world",
    name: "World & Foreign Affairs",
    name_hi: "विश्व एवं विदेश नीति",
    description: "International diplomacy, bilateral agreements, global summits, and foreign policy.",
    display_order: 8,
    is_active: true,
  },
  {
    slug: "health",
    name: "Health & Public Safety",
    name_hi: "स्वास्थ्य एवं लोक सुरक्षा",
    description: "Public healthcare guidelines, medical infrastructure, wellness advisories, and disaster response.",
    display_order: 9,
    is_active: true,
  },
  {
    slug: "sports",
    name: "Sports & Youth Affairs",
    name_hi: "खेल एवं युवा मामले",
    description: "National sports events, athletic achievements, tournaments, and government sports awards.",
    display_order: 10,
    is_active: true,
  },
  {
    slug: "entertainment",
    name: "Culture & Entertainment",
    name_hi: "संस्कृति एवं मनोरंजन",
    description: "Indian heritage, arts, national cultural festivals, media, and cinematic recognitions.",
    display_order: 11,
    is_active: true,
  },
];

export const CATEGORY_MAP = new Map<string, NewsCategory>(
  NEWS_CATEGORIES.map((cat) => [cat.slug, cat])
);

export function getCategoryBySlug(slug: string): NewsCategory | undefined {
  return CATEGORY_MAP.get(slug.toLowerCase());
}
