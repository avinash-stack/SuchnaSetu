-- =============================================================================
-- SuchnaSetu Database Schema - Public Bulletins & Student Advisories
-- =============================================================================

CREATE TABLE IF NOT EXISTS public_bulletins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('employment_news', 'student_advisory', 'legal_update', 'press_release')),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    related_job_id UUID REFERENCES gov_jobs(id) ON DELETE SET NULL,
    summary TEXT NOT NULL,
    content TEXT,
    source_url TEXT NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    is_breaking BOOLEAN DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_public_bulletins_updated_at
BEFORE UPDATE ON public_bulletins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for high-speed queries
CREATE INDEX IF NOT EXISTS idx_bulletins_slug ON public_bulletins(slug);
CREATE INDEX IF NOT EXISTS idx_bulletins_category_status ON public_bulletins(category, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulletins_breaking ON public_bulletins(is_breaking, published_at DESC) WHERE is_breaking = true;
CREATE INDEX IF NOT EXISTS idx_bulletins_org ON public_bulletins(organization_id);

-- Enable RLS
ALTER TABLE public_bulletins ENABLE ROW LEVEL SECURITY;

-- Public Read Policy for Published Bulletins
CREATE POLICY "Public Read Published Bulletins" ON public_bulletins FOR SELECT USING (status = 'published');

-- Admin Write Policy for Authenticated Active Admins
CREATE POLICY "Admin All Bulletins" ON public_bulletins FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
