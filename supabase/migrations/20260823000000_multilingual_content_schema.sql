-- =============================================================================
-- SuchnaSetu Phase 6 Database Migration:
-- Multilingual Content Architecture & Normalized Translation Schema
-- Covers: English (Default), Hindi (hi), Bengali (bn), Odia (or), Assamese (as), Punjabi (pa)
-- Keeps canonical English records intact without duplicating base entities.
-- =============================================================================

-- 1. Government Job Notice Translations
CREATE TABLE IF NOT EXISTS gov_job_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES gov_jobs(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL CHECK (language_code IN ('hi', 'bn', 'or', 'as', 'pa', 'ta', 'te', 'mr', 'gu')),
    title TEXT NOT NULL,
    post_name VARCHAR(255),
    qualification_summary TEXT,
    age_limit_summary TEXT,
    pay_scale_summary TEXT,
    selection_process TEXT,
    description TEXT,
    fee_details JSONB,
    meta_title TEXT,
    meta_description TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_gov_job_translations UNIQUE (job_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_job_translations_lang ON gov_job_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_job_translations_job_lang ON gov_job_translations(job_id, language_code);

-- 2. Government Examination Notice Translations
CREATE TABLE IF NOT EXISTS gov_exam_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES gov_exams(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL CHECK (language_code IN ('hi', 'bn', 'or', 'as', 'pa', 'ta', 'te', 'mr', 'gu')),
    title TEXT NOT NULL,
    short_title VARCHAR(150),
    description TEXT,
    eligibility_summary TEXT,
    meta_title TEXT,
    meta_description TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_gov_exam_translations UNIQUE (exam_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_exam_translations_lang ON gov_exam_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_exam_translations_exam_lang ON gov_exam_translations(exam_id, language_code);

-- 3. Public Bulletin / Employment News Translations
CREATE TABLE IF NOT EXISTS bulletin_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulletin_id UUID NOT NULL REFERENCES public_bulletins(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL CHECK (language_code IN ('hi', 'bn', 'or', 'as', 'pa', 'ta', 'te', 'mr', 'gu')),
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    meta_title TEXT,
    meta_description TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_bulletin_translations UNIQUE (bulletin_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_bulletin_translations_lang ON bulletin_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_bulletin_translations_bul_lang ON bulletin_translations(bulletin_id, language_code);

-- 4. Organization & Commission Name Translations
CREATE TABLE IF NOT EXISTS organization_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL CHECK (language_code IN ('hi', 'bn', 'or', 'as', 'pa', 'ta', 'te', 'mr', 'gu')),
    name TEXT NOT NULL,
    about_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_organization_translations UNIQUE (organization_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_org_translations_lang ON organization_translations(organization_id, language_code);

-- 5. Category Name Translations
CREATE TABLE IF NOT EXISTS category_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL CHECK (language_code IN ('hi', 'bn', 'or', 'as', 'pa', 'ta', 'te', 'mr', 'gu')),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_category_translations UNIQUE (category_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_cat_translations_lang ON category_translations(category_id, language_code);

-- 6. Enable Row Level Security & Public Read Policies
ALTER TABLE gov_job_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_exam_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletin_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Job Translations" ON gov_job_translations FOR SELECT USING (is_verified = true);
CREATE POLICY "Public Read Exam Translations" ON gov_exam_translations FOR SELECT USING (is_verified = true);
CREATE POLICY "Public Read Bulletin Translations" ON bulletin_translations FOR SELECT USING (is_verified = true);
CREATE POLICY "Public Read Org Translations" ON organization_translations FOR SELECT USING (true);
CREATE POLICY "Public Read Cat Translations" ON category_translations FOR SELECT USING (true);
