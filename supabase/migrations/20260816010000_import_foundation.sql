-- =============================================================================
-- SuchnaSetu Phase 3 Database Schema: Data Import & Ingestion Foundation
-- Completely isolated from public-facing web applications
-- =============================================================================

-- 1. Import Source Registry
CREATE TABLE IF NOT EXISTS import_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g. "upsc_official_feed", "ssc_notices_api"
    name VARCHAR(255) NOT NULL,
    description TEXT,
    adapter_key VARCHAR(100) NOT NULL, -- Corresponds to registered SourceAdapter key
    target_module VARCHAR(50) NOT NULL, -- e.g. "jobs", "exams", "bulletins"
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    base_url TEXT,
    config JSONB DEFAULT '{}'::jsonb, -- Source-specific configuration (headers, timeouts, params)
    is_enabled BOOLEAN DEFAULT true,
    sync_interval_minutes INT DEFAULT 360, -- 6 hours default
    last_synced_at TIMESTAMPTZ,
    next_scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_import_sources_updated_at
BEFORE UPDATE ON import_sources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_import_sources_code ON import_sources(code);
CREATE INDEX IF NOT EXISTS idx_import_sources_target ON import_sources(target_module);
CREATE INDEX IF NOT EXISTS idx_import_sources_enabled ON import_sources(is_enabled);

-- 2. Import Jobs Execution Table
CREATE TABLE IF NOT EXISTS import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES import_sources(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'scheduled', 'webhook', 'retry')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'retrying')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    total_extracted INT DEFAULT 0,
    total_normalized INT DEFAULT 0,
    total_inserted INT DEFAULT 0,
    total_updated INT DEFAULT 0,
    total_skipped INT DEFAULT 0,
    total_failed INT DEFAULT 0,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    error_message TEXT,
    error_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_import_jobs_updated_at
BEFORE UPDATE ON import_jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_import_jobs_source ON import_jobs(source_id);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON import_jobs(status, created_at DESC);

-- 3. Raw Data Storage (Immutable payload history)
CREATE TABLE IF NOT EXISTS import_raw_payloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES import_jobs(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES import_sources(id) ON DELETE CASCADE,
    external_id VARCHAR(255), -- External ID from source if provided
    payload_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of the raw payload
    raw_payload JSONB NOT NULL, -- Unmodified raw extracted payload
    content_type VARCHAR(100) DEFAULT 'application/json',
    status VARCHAR(50) NOT NULL DEFAULT 'raw' CHECK (status IN ('raw', 'normalized', 'duplicate', 'rejected', 'failed')),
    error_message TEXT,
    extracted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_raw_payloads_job ON import_raw_payloads(job_id);
CREATE INDEX IF NOT EXISTS idx_raw_payloads_hash ON import_raw_payloads(source_id, payload_hash);
CREATE INDEX IF NOT EXISTS idx_raw_payloads_external ON import_raw_payloads(source_id, external_id);

-- 4. Ingestion Step-by-Step Logs
CREATE TABLE IF NOT EXISTS import_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES import_jobs(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    step VARCHAR(100) NOT NULL, -- e.g. "fetch", "normalize", "deduplicate", "persist"
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_import_logs_job ON import_logs(job_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_import_logs_level ON import_logs(level);

-- 5. Content Fingerprints & Change Detection Hashes
CREATE TABLE IF NOT EXISTS import_entity_hashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES import_sources(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- e.g. "gov_jobs", "exams"
    entity_id UUID, -- References the target domain record ID once persisted
    natural_key VARCHAR(500) NOT NULL, -- e.g. "upsc:cse-2026-notification"
    content_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of normalized content
    raw_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of raw extracted data
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_source_entity_key UNIQUE (source_id, entity_type, natural_key)
);

CREATE TRIGGER update_import_entity_hashes_updated_at
BEFORE UPDATE ON import_entity_hashes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_entity_hashes_lookup ON import_entity_hashes(source_id, entity_type, natural_key);
CREATE INDEX IF NOT EXISTS idx_entity_hashes_content ON import_entity_hashes(content_hash);

-- Row Level Security (RLS) Policies
-- Import pipeline tables are strictly admin & service role only. Zero public access.
ALTER TABLE import_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_raw_payloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_entity_hashes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin Read Import Sources" ON import_sources FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin Manage Import Sources" ON import_sources FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Import Jobs" ON import_jobs FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Raw Payloads" ON import_raw_payloads FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Import Logs" ON import_logs FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Entity Hashes" ON import_entity_hashes FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);
