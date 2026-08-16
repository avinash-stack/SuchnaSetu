-- =============================================================================
-- SuchnaSetu Database Schema - Initial Migration
-- Production-grade normalized schema for Public Information Platform
-- =============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================================================
-- SECTION 1: MASTER & CORE TAXONOMIES
-- =============================================================================

-- 1. States and Union Territories of India
CREATE TABLE IF NOT EXISTS states_uts (
    code VARCHAR(5) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('state', 'ut')),
    capital VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organizations / Departments / Commissions
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(50),
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'commission',
    jurisdiction VARCHAR(20) NOT NULL CHECK (jurisdiction IN ('central', 'state', 'autonomous', 'psu')),
    state_code VARCHAR(5) REFERENCES states_uts(code) ON DELETE SET NULL,
    website_url TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Sectors / Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Platform Modules Registry
CREATE TABLE IF NOT EXISTS modules (
    key VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT false,
    route_path VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Official Public Sources Registry
CREATE TABLE IF NOT EXISTS official_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    base_url TEXT NOT NULL,
    portal_type VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT true,
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin User Profiles (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'editor', 'auditor')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON admin_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Audit Log Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    metadata JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 2: GOVERNMENT JOBS MODULE (Initial Domain Module)
-- =============================================================================

-- 8. Government Jobs Primary Notice Table
CREATE TABLE IF NOT EXISTS gov_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    notification_number VARCHAR(255),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    state_code VARCHAR(5) REFERENCES states_uts(code) ON DELETE SET NULL,
    employment_type VARCHAR(50) DEFAULT 'permanent' CHECK (employment_type IN ('permanent', 'contract', 'deputation', 'apprenticeship')),
    total_vacancies INT NOT NULL DEFAULT 0,
    salary_min NUMERIC(12, 2),
    salary_max NUMERIC(12, 2),
    pay_scale_details TEXT,
    official_notification_url TEXT NOT NULL,
    official_apply_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    summary TEXT,
    published_at TIMESTAMPTZ,
    application_start_date TIMESTAMPTZ,
    application_end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_gov_jobs_updated_at
BEFORE UPDATE ON gov_jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Post / Vacancy Breakdown
CREATE TABLE IF NOT EXISTS job_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES gov_jobs(id) ON DELETE CASCADE,
    post_name VARCHAR(255) NOT NULL,
    post_code VARCHAR(50),
    total_posts INT NOT NULL DEFAULT 0,
    ur_posts INT DEFAULT 0,
    ews_posts INT DEFAULT 0,
    obc_posts INT DEFAULT 0,
    sc_posts INT DEFAULT 0,
    st_posts INT DEFAULT 0,
    pwd_posts INT DEFAULT 0,
    pay_level VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Important Dates & Milestones
CREATE TABLE IF NOT EXISTS job_important_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES gov_jobs(id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    event_date TIMESTAMPTZ,
    event_date_text VARCHAR(100),
    is_tentative BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Eligibility, Age & Fees Criteria
CREATE TABLE IF NOT EXISTS job_eligibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES gov_jobs(id) ON DELETE CASCADE,
    min_age INT,
    max_age INT,
    age_calculation_date DATE,
    age_relaxation_details TEXT,
    education_qualification TEXT NOT NULL,
    experience_details TEXT,
    selection_process TEXT,
    application_fee_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Official Documents & Notifications
CREATE TABLE IF NOT EXISTS job_official_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES gov_jobs(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('full_notification', 'short_notice', 'corrigendum', 'syllabus', 'admit_card_notice', 'result_notice')),
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    published_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 3: PERFORMANCE INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_jurisdiction ON organizations(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_organizations_state ON organizations(state_code);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

CREATE INDEX IF NOT EXISTS idx_gov_jobs_slug ON gov_jobs(slug);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_status_published ON gov_jobs(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_org ON gov_jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_cat ON gov_jobs(category_id);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_state ON gov_jobs(state_code);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_end_date ON gov_jobs(application_end_date);

CREATE INDEX IF NOT EXISTS idx_job_vacancies_job ON job_vacancies(job_id);
CREATE INDEX IF NOT EXISTS idx_job_dates_job ON job_important_dates(job_id);
CREATE INDEX IF NOT EXISTS idx_job_docs_job ON job_official_documents(job_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- =============================================================================
-- SECTION 4: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE states_uts ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_important_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_official_documents ENABLE ROW LEVEL SECURITY;

-- Master Taxonomies: Public Read Access
CREATE POLICY "Public Read Active States" ON states_uts FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Organizations" ON organizations FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Public Read Official Sources" ON official_sources FOR SELECT USING (is_verified = true);

-- Published Jobs: Public Read Access
CREATE POLICY "Public Read Published Jobs" ON gov_jobs FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Job Vacancies" ON job_vacancies FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_jobs WHERE gov_jobs.id = job_vacancies.job_id AND gov_jobs.status = 'published')
);
CREATE POLICY "Public Read Job Important Dates" ON job_important_dates FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_jobs WHERE gov_jobs.id = job_important_dates.job_id AND gov_jobs.status = 'published')
);
CREATE POLICY "Public Read Job Eligibility" ON job_eligibility FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_jobs WHERE gov_jobs.id = job_eligibility.job_id AND gov_jobs.status = 'published')
);
CREATE POLICY "Public Read Job Official Documents" ON job_official_documents FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_jobs WHERE gov_jobs.id = job_official_documents.job_id AND gov_jobs.status = 'published')
);

-- Admin Profiles: Self & Admin Read Access
CREATE POLICY "Admin Read Profiles" ON admin_profiles FOR SELECT TO authenticated USING (true);

-- Admin Write Access across all tables for authenticated active admins
CREATE POLICY "Admin All States" ON states_uts FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Organizations" ON organizations FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Modules" ON modules FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Official Sources" ON official_sources FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Jobs" ON gov_jobs FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Job Vacancies" ON job_vacancies FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Job Dates" ON job_important_dates FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Job Eligibility" ON job_eligibility FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Job Docs" ON job_official_documents FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
CREATE POLICY "Admin All Audit Logs" ON audit_logs FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
