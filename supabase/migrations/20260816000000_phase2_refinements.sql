-- =============================================================================
-- SuchnaSetu Phase 2 Schema Refinements:
-- Departments, Master Qualifications, Soft-Delete & Granular SEO Fields
-- =============================================================================

-- 1. Departments Master Table (Under Organizations / Ministries)
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(50),
    slug VARCHAR(255) UNIQUE NOT NULL,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_departments_org ON departments(organization_id);
CREATE INDEX IF NOT EXISTS idx_departments_slug ON departments(slug);

-- Enable RLS on departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Active Departments" ON departments FOR SELECT USING (is_active = true);
CREATE POLICY "Admin All Departments" ON departments FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

-- 2. Master Qualifications Registry
CREATE TABLE IF NOT EXISTS qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    level VARCHAR(50) NOT NULL CHECK (level IN ('10th', '12th', 'diploma', 'graduate', 'post_graduate', 'doctorate', 'professional')),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qualifications_slug ON qualifications(slug);
CREATE INDEX IF NOT EXISTS idx_qualifications_level ON qualifications(level);

-- Enable RLS on qualifications
ALTER TABLE qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Active Qualifications" ON qualifications FOR SELECT USING (is_active = true);
CREATE POLICY "Admin All Qualifications" ON qualifications FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

-- 3. Enhance gov_jobs with Soft Delete, Department, Min Qualification & Custom SEO fields
ALTER TABLE gov_jobs 
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS min_qualification_id UUID REFERENCES qualifications(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_gov_jobs_department ON gov_jobs(department_id);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_qualification ON gov_jobs(min_qualification_id);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_deleted ON gov_jobs(deleted_at) WHERE deleted_at IS NULL;

-- 4. Initial Seed Data for Qualifications
INSERT INTO qualifications (name, slug, level, display_order, is_active) VALUES
('10th / Matriculation', '10th-matriculation', '10th', 1, true),
('12th / Intermediate (10+2)', '12th-intermediate', '12th', 2, true),
('ITI / Vocational Diploma', 'iti-diploma', 'diploma', 3, true),
('Polytechnic Engineering Diploma', 'polytechnic-diploma', 'diploma', 4, true),
('Bachelor''s Degree (Graduation)', 'graduate-degree', 'graduate', 5, true),
('B.E. / B.Tech (Engineering)', 'be-btech', 'graduate', 6, true),
('MBBS / BDS (Medical)', 'mbbs-bds', 'graduate', 7, true),
('LL.B. (Law)', 'llb-law', 'graduate', 8, true),
('Master''s Degree (Post Graduation)', 'post-graduate', 'post_graduate', 9, true),
('M.Tech / M.E.', 'mtech-me', 'post_graduate', 10, true),
('Ph.D. / Doctorate', 'phd-doctorate', 'doctorate', 11, true)
ON CONFLICT (slug) DO NOTHING;

-- 5. Initial Seed Data for Benchmark Departments
INSERT INTO departments (organization_id, name, acronym, slug, is_active) VALUES
((SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1), 'Civil Services Wing', 'CSW', 'upsc-civil-services-wing', true),
((SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1), 'Engineering Services Wing', 'ESW', 'upsc-engineering-services-wing', true),
((SELECT id FROM organizations WHERE slug = 'ssc' LIMIT 1), 'Combined Graduate Level (CGL) Cell', 'CGL-CELL', 'ssc-cgl-cell', true),
((SELECT id FROM organizations WHERE slug = 'ssc' LIMIT 1), 'Central Armed Police Forces (CAPF) Cell', 'CAPF-CELL', 'ssc-capf-cell', true),
((SELECT id FROM organizations WHERE slug = 'rrb' LIMIT 1), 'Non-Technical Popular Categories (NTPC) Cell', 'RRB-NTPC', 'rrb-ntpc-cell', true),
((SELECT id FROM organizations WHERE slug = 'rrb' LIMIT 1), 'Railway Technical & ALP Wing', 'RRB-TECH', 'rrb-tech-alp-wing', true)
ON CONFLICT (slug) DO NOTHING;
