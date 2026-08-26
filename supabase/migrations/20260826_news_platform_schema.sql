-- ==============================================================================
-- SUCHNASETU NEWS PLATFORM — PRODUCTION SCHEMA MIGRATION
-- Architecturally isolated tables with independent RLS policies and indexes.
-- ==============================================================================

-- 1. NEWS CATEGORIES
CREATE TABLE IF NOT EXISTS news_categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Default News Categories
INSERT INTO news_categories (slug, name, name_hi, description, display_order, is_active)
VALUES
  ('india', 'India', 'भारत / राष्ट्रीय', 'National affairs, union developments, policy, and national milestones.', 1, true),
  ('states', 'States & Regional', 'राज्य एवं प्रादेशिक', 'State government decisions, regional developments, and local governance.', 2, true),
  ('education', 'Education & Youth', 'शिक्षा एवं युवा', 'Academic reforms, admissions, university councils, board exams, and youth policies.', 3, true),
  ('governance', 'Govt & Public Affairs', 'शासन एवं लोक मामले', 'Cabinet decisions, citizen charters, public welfare schemes, and administrative circulars.', 4, true),
  ('business', 'Business & Economy', 'व्यापार एवं अर्थव्यवस्था', 'Union budget, RBI monetary policies, employment trends, markets, and infrastructure.', 5, true),
  ('technology', 'Technology & Science', 'प्रौद्योगिकी एवं विज्ञान', 'Digital India, space programs, AI governance, cyber initiatives, and scientific research.', 6, true),
  ('politics', 'Politics & Policy', 'राजनीति एवं नीति', 'Legislative assemblies, parliamentary debates, constitutional reforms, and policy decisions.', 7, true),
  ('world', 'World & Foreign Affairs', 'विश्व एवं विदेश नीति', 'International diplomacy, bilateral agreements, global summits, and foreign policy.', 8, true),
  ('health', 'Health & Public Safety', 'स्वास्थ्य एवं लोक सुरक्षा', 'Public healthcare guidelines, medical infrastructure, wellness advisories, and disaster response.', 9, true),
  ('sports', 'Sports & Youth Affairs', 'खेल एवं युवा मामले', 'National sports events, athletic achievements, tournaments, and government sports awards.', 10, true),
  ('entertainment', 'Culture & Entertainment', 'संस्कृति एवं मनोरंजन', 'Indian heritage, arts, national cultural festivals, media, and cinematic recognitions.', 11, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_hi = EXCLUDED.name_hi,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. NEWS SOURCES REGISTRY
CREATE TABLE IF NOT EXISTS news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'rss', -- 'rss' | 'atom' | 'api' | 'json'
  default_category TEXT REFERENCES news_categories(slug) ON DELETE SET NULL,
  state_code TEXT,
  country TEXT NOT NULL DEFAULT 'IN',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 1,
  fetch_interval_minutes INTEGER NOT NULL DEFAULT 30,
  last_synced_at TIMESTAMPTZ,
  last_error TEXT,
  failure_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Verified News Sources
INSERT INTO news_sources (code, name, website_url, feed_url, source_type, default_category, state_code, is_enabled, priority, fetch_interval_minutes)
VALUES
  ('google_news_india', 'Google News India', 'https://news.google.com', 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en', 'rss', 'india', NULL, true, 1, 15),
  ('dd_news', 'DD News National', 'https://ddnews.gov.in', 'https://ddnews.gov.in/rss-feeds', 'rss', 'india', NULL, true, 1, 30),
  ('zee_news_india', 'Zee News National', 'https://zeenews.india.com', 'https://zeenews.india.com/rss/india-national-news.xml', 'rss', 'india', NULL, true, 2, 30),
  ('abp_news', 'ABP News', 'https://news.abplive.com', 'https://news.abplive.com/home/feed', 'rss', 'india', NULL, true, 2, 30),
  ('ndtv_india', 'NDTV National News', 'https://ndtv.com', 'https://feeds.feedburner.com/ndtvnews-india-news', 'rss', 'india', NULL, true, 2, 30),
  ('the_hindu_national', 'The Hindu (National Feed)', 'https://thehindu.com', 'https://www.thehindu.com/news/national/feeder/default.rss', 'rss', 'india', NULL, true, 2, 30),
  ('indian_express_edu', 'Indian Express Education', 'https://indianexpress.com', 'https://indianexpress.com/section/education/feed/', 'rss', 'education', NULL, true, 2, 30),
  ('times_tech', 'ET Tech & Digital India', 'https://economictimes.indiatimes.com', 'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms', 'rss', 'technology', NULL, true, 3, 45),
  ('pib_national', 'Press Information Bureau (PIB)', 'https://pib.gov.in', 'https://pib.gov.in/RssMain.aspx', 'rss', 'governance', NULL, false, 9, 60),
  ('aaj_tak', 'Aaj Tak', 'https://aajtak.in', 'https://aajtak.in/rssfeeds/latest-news.xml', 'rss', 'india', NULL, false, 9, 60)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  website_url = EXCLUDED.website_url,
  feed_url = EXCLUDED.feed_url,
  default_category = EXCLUDED.default_category,
  is_enabled = EXCLUDED.is_enabled;

-- 3. NEWS ARTICLES
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  source_id UUID REFERENCES news_sources(id) ON DELETE SET NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  canonical_url TEXT,
  author TEXT,
  image_url TEXT,
  image_caption TEXT,
  category_slug TEXT NOT NULL REFERENCES news_categories(slug) ON DELETE RESTRICT,
  subcategory TEXT,
  state_code TEXT,
  tags TEXT[] DEFAULT '{}',
  entities JSONB DEFAULT '{}'::jsonb,
  importance TEXT NOT NULL DEFAULT 'standard', -- 'breaking' | 'high' | 'standard' | 'digest'
  ai_status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'enriched' | 'failed' | 'skipped'
  ai_model TEXT,
  content_hash TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_published BOOLEAN NOT NULL DEFAULT true,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast news querying
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category_slug, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_state ON news_articles(state_code, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_published ON news_articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_importance ON news_articles(importance, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_hash ON news_articles(content_hash);
CREATE INDEX IF NOT EXISTS idx_news_articles_source_url ON news_articles(source_url);

-- 4. NEWS TRANSLATIONS CACHE
CREATE TABLE IF NOT EXISTS news_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(article_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_news_translations_lookup ON news_translations(article_id, language_code);

-- 5. NEWS INGESTION LOGS (Observability)
CREATE TABLE IF NOT EXISTS news_ingestion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES news_sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL, -- 'success' | 'partial' | 'failed'
  fetched_count INTEGER NOT NULL DEFAULT 0,
  inserted_count INTEGER NOT NULL DEFAULT 0,
  duplicate_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_ingestion_logs_created ON news_ingestion_logs(created_at DESC);

-- Enable RLS for public read access
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_ingestion_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read news_categories" ON news_categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read news_sources" ON news_sources FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read published news_articles" ON news_articles FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read news_translations" ON news_translations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin full access news_articles" ON news_articles FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin full access news_sources" ON news_sources FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
