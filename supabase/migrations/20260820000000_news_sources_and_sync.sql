-- =============================================================================
-- SuchnaSetu Migration - News & Public Bulletins Ingestion Expansion
-- =============================================================================

-- 1. Extend category check constraint and add metadata columns to public_bulletins
ALTER TABLE public_bulletins DROP CONSTRAINT IF EXISTS public_bulletins_category_check;

ALTER TABLE public_bulletins ADD CONSTRAINT public_bulletins_category_check CHECK (
    category IN (
        'government_updates',
        'recruitment_jobs',
        'exams',
        'education',
        'government_schemes',
        'important_notifications',
        'employment_news',
        'student_advisory',
        'legal_update',
        'press_release'
    )
);

-- Add optional thumbnail image, tags, author, and manual edit protection
ALTER TABLE public_bulletins ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public_bulletins ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public_bulletins ADD COLUMN IF NOT EXISTS author VARCHAR(255);
ALTER TABLE public_bulletins ADD COLUMN IF NOT EXISTS is_manually_edited BOOLEAN DEFAULT false;
ALTER TABLE public_bulletins ADD COLUMN IF NOT EXISTS meta_title VARCHAR(500);
ALTER TABLE public_bulletins ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public_bulletins ADD COLUMN IF NOT EXISTS imported_at TIMESTAMPTZ DEFAULT NOW();

-- Create index on tags and updated category column
CREATE INDEX IF NOT EXISTS idx_bulletins_tags ON public_bulletins USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_bulletins_imported_at ON public_bulletins(imported_at DESC);

-- 2. Seed Official News Ingestion Pipelines into import_sources (target_module = 'bulletins')
INSERT INTO import_sources (code, name, description, adapter_key, target_module, organization_id, base_url, sync_interval_minutes, is_enabled)
VALUES
    (
        'pib_national_news',
        'Press Information Bureau (PIB) - National Civic & Policy Releases',
        'Official press communiques, union cabinet decisions, and government public notices from PIB India.',
        'pib_national_news_adapter',
        'bulletins',
        (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1),
        'https://pib.gov.in',
        180,
        true
    ),
    (
        'employment_news_digest',
        'Employment News (Rozgar Samachar) Official Digest',
        'Weekly gazette summaries, consolidated vacancy circulars, and public sector employment communiques.',
        'employment_news_digest_adapter',
        'bulletins',
        (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1),
        'http://employmentnews.gov.in',
        360,
        true
    ),
    (
        'education_ministry_news',
        'Ministry of Education & UGC Academic Advisories',
        'Higher education policies, university entrance advisories, curriculum reforms, and UGC notifications.',
        'education_ministry_news_adapter',
        'bulletins',
        (SELECT id FROM organizations WHERE slug = 'aiims-new-delhi' LIMIT 1),
        'https://www.education.gov.in',
        360,
        true
    ),
    (
        'exam_advisories_news',
        'Central & State Examination Boards Public Notices',
        'Exam date revisions, biometric authentication advisories, center changes, and court ruling digests.',
        'exam_advisories_news_adapter',
        'bulletins',
        (SELECT id FROM organizations WHERE slug = 'ssc' LIMIT 1),
        'https://ssc.gov.in',
        180,
        true
    ),
    (
        'govt_schemes_news',
        'Government Welfare Schemes & Direct Benefit Notifications',
        'National and state welfare flagship schemes, scholarship eligibility expansions, and portal launches.',
        'govt_schemes_news_adapter',
        'bulletins',
        (SELECT id FROM organizations WHERE slug = 'department-of-posts' LIMIT 1),
        'https://www.myscheme.gov.in',
        360,
        true
    ),
    (
        'legal_court_bulletins',
        'Judicial Decisions & State Administrative Tribunal Advisories',
        'High Court & Supreme Court judgments impacting recruitment rules, age relaxations, and reservation policies.',
        'legal_court_bulletins_adapter',
        'bulletins',
        (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1),
        'https://main.sci.gov.in',
        720,
        true
    )
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    adapter_key = EXCLUDED.adapter_key,
    target_module = EXCLUDED.target_module,
    base_url = EXCLUDED.base_url,
    sync_interval_minutes = EXCLUDED.sync_interval_minutes,
    is_enabled = EXCLUDED.is_enabled;

-- 3. Seed Verified Public News Sources in official_sources
INSERT INTO official_sources (name, portal_type, base_url, is_verified, organization_id)
VALUES
    ('Press Information Bureau (PIB)', 'portal', 'https://pib.gov.in', true, (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1)),
    ('Employment News (Rozgar Samachar)', 'portal', 'http://employmentnews.gov.in', true, (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1)),
    ('Ministry of Education Portal', 'portal', 'https://www.education.gov.in', true, (SELECT id FROM organizations WHERE slug = 'aiims-new-delhi' LIMIT 1)),
    ('myScheme National Platform', 'portal', 'https://www.myscheme.gov.in', true, (SELECT id FROM organizations WHERE slug = 'department-of-posts' LIMIT 1))
ON CONFLICT DO NOTHING;
