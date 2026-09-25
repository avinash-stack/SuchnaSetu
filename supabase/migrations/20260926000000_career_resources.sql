-- ==============================================================================
-- SUCHNASETU CAREER GUIDANCE & ASPIRANT RESOURCES PLATFORM — SCHEMA MIGRATION
-- ==============================================================================

-- 1. CAREER RESOURCE CATEGORIES
CREATE TABLE IF NOT EXISTS career_resource_categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT DEFAULT 'BookOpen',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Default Categories
INSERT INTO career_resource_categories (slug, name, name_hi, description, display_order, icon, is_active)
VALUES
  ('preparation-strategy', 'Preparation Strategy', 'तैयारी की रणनीति', 'Actionable study plans, timetable routines, and subject-wise strategies for competitive exams.', 1, 'Target', true),
  ('eligibility-rules', 'Eligibility & Rules', 'पात्रता एवं नियम', 'Age relaxations, community quota reservations, academic qualifications, and medical criteria.', 2, 'ShieldCheck', true),
  ('syllabus-guide', 'Syllabus Breakdown', 'पाठ्यक्रम एवं परीक्षा पैटर्न', 'In-depth syllabus explanations, section weightages, and marking scheme analyses.', 3, 'BookOpen', true),
  ('salary-perks', 'Salary & Perks', 'वेतन एवं सुविधाएं', '7th Pay Commission pay matrices, allowances (DA/HRA/TA), and government career benefits.', 4, 'IndianRupee', true),
  ('career-roadmaps', 'Career Roadmaps', 'कैरियर रोडमैप', 'Role hierarchies, promotion ladders, and post comparison guides (e.g. Group A vs Group B).', 5, 'Compass', true),
  ('interview-prep', 'Interview & Personality Test', 'साक्षात्कार एवं व्यक्तित्व परीक्षण', 'Viva guidelines, document verification checklists, and interview board preparation tips.', 6, 'Users', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_hi = EXCLUDED.name_hi,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;

-- 2. CAREER RESOURCES (ARTICLES & GUIDES)
CREATE TABLE IF NOT EXISTS career_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_hi TEXT,
  excerpt TEXT NOT NULL,
  excerpt_hi TEXT,
  content TEXT NOT NULL,
  content_hi TEXT,
  category_slug TEXT NOT NULL REFERENCES career_resource_categories(slug) ON DELETE RESTRICT,
  tags TEXT[] DEFAULT '{}',
  target_exam_ids UUID[] DEFAULT '{}',
  target_job_ids UUID[] DEFAULT '{}',
  faqs JSONB DEFAULT '[]'::jsonb,
  reading_time_minutes INTEGER NOT NULL DEFAULT 6,
  status TEXT NOT NULL DEFAULT 'published', -- 'published' | 'draft' | 'archived'
  author_name TEXT NOT NULL DEFAULT 'SuchnaSetu Career Editorial Desk',
  author_role TEXT NOT NULL DEFAULT 'Public Sector Examination Analyst',
  featured_image TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high-speed queries
CREATE INDEX IF NOT EXISTS idx_career_resources_slug ON career_resources(slug);
CREATE INDEX IF NOT EXISTS idx_career_resources_category ON career_resources(category_slug);
CREATE INDEX IF NOT EXISTS idx_career_resources_status_published ON career_resources(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_career_resources_tags ON career_resources USING GIN(tags);

-- Row Level Security (RLS)
ALTER TABLE career_resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_resources ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
DROP POLICY IF EXISTS "Public can view active resource categories" ON career_resource_categories;
CREATE POLICY "Public can view active resource categories"
  ON career_resource_categories FOR SELECT
  USING (is_active = true);

-- Public can read published resources
DROP POLICY IF EXISTS "Public can view published career resources" ON career_resources;
CREATE POLICY "Public can view published career resources"
  ON career_resources FOR SELECT
  USING (status = 'published');

-- Service role has full access
DROP POLICY IF EXISTS "Service role full access on career_resource_categories" ON career_resource_categories;
CREATE POLICY "Service role full access on career_resource_categories"
  ON career_resource_categories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on career_resources" ON career_resources;
CREATE POLICY "Service role full access on career_resources"
  ON career_resources FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
