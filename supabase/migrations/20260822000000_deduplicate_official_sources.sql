-- =============================================================================
-- Migration: Deduplicate Official Sources & Enforce Unique URL Constraint
-- 1. Keeps the oldest canonical record for each unique base_url
-- 2. Deletes duplicate official_sources entries
-- 3. Adds UNIQUE constraint on LOWER(TRIM(TRAILING '/' FROM base_url))
-- =============================================================================

BEGIN;

-- Step 1: Remove duplicate official_sources rows, keeping the earliest created canonical record
WITH ranked_official_sources AS (
  SELECT 
    id,
    base_url,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(TRAILING '/' FROM base_url)) 
      ORDER BY created_at ASC, id ASC
    ) as rn
  FROM official_sources
  WHERE base_url IS NOT NULL AND base_url != ''
)
DELETE FROM official_sources
WHERE id IN (
  SELECT id FROM ranked_official_sources WHERE rn > 1
);

-- Step 2: Ensure unique index on normalized base_url so future seeds/syncs cannot insert duplicates
CREATE UNIQUE INDEX IF NOT EXISTS uq_official_sources_base_url 
ON official_sources (LOWER(TRIM(TRAILING '/' FROM base_url)));

COMMIT;
