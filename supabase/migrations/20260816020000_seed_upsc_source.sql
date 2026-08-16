-- =============================================================================
-- SuchnaSetu Migration: Seed UPSC Official Import Source & Benchmark Source
-- =============================================================================

INSERT INTO import_sources (
    code,
    name,
    description,
    adapter_key,
    target_module,
    organization_id,
    base_url,
    config,
    is_enabled,
    sync_interval_minutes
) VALUES 
(
    'upsc_official_feed',
    'Union Public Service Commission (UPSC) Official Feed',
    'Automated extraction of official recruitment advertisements, specialist cadres, engineering services, and active examination notices directly from upsc.gov.in.',
    'upsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1),
    'https://upsc.gov.in',
    '{"headers": {"User-Agent": "SuchnaSetu-Gov-Pipeline/1.0"}}'::jsonb,
    true,
    360
),
(
    'benchmark_mock_feed',
    'Benchmark Test Reference Feed',
    'Zero-network reference benchmark adapter used for testing change detection, hashing integrity, and queue stability.',
    'benchmark_mock_adapter',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1),
    'https://benchmark.suchnasetu.in',
    '{}'::jsonb,
    true,
    720
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    adapter_key = EXCLUDED.adapter_key,
    target_module = EXCLUDED.target_module,
    organization_id = EXCLUDED.organization_id,
    base_url = EXCLUDED.base_url,
    config = EXCLUDED.config,
    is_enabled = EXCLUDED.is_enabled,
    sync_interval_minutes = EXCLUDED.sync_interval_minutes,
    updated_at = NOW();
