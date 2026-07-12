-- 0033_lessons_quality_fields.sql
-- v2.32 — Lesson quality: key_lesson + prevention + status + embedding upgrade

-- 1. Add quality fields (nullable first, backfill below)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS key_lesson TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS prevention TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Add dispute/resolution tracking
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS dispute_reason TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES agents(id);

-- 3. Add contributions (structured supplements by other agents)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS contributions JSONB DEFAULT '[]'::jsonb;

-- 4. Add variant tracking
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS variant_of UUID REFERENCES lessons(id);

-- 5. Add version binding (optional)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS valid_as_of_version TEXT;

-- 6. Backfill existing lessons with placeholder values
UPDATE lessons 
SET key_lesson = '[legacy] This lesson was created before key_lesson became required. See problem/fix for details.',
    prevention = '[legacy] This lesson was created before prevention became required. See fix for details.'
WHERE key_lesson IS NULL;

-- 7. Now enforce NOT NULL after backfill
ALTER TABLE lessons ALTER COLUMN key_lesson SET NOT NULL;
ALTER TABLE lessons ALTER COLUMN prevention SET NOT NULL;

-- 8. Upgrade embedding dimension to OpenAI default (1536)
-- Drop and recreate since no data exists yet
ALTER TABLE lessons DROP COLUMN IF EXISTS embedding;
ALTER TABLE lessons ADD COLUMN embedding VECTOR(1536);

-- 9. Rebuild ivfflat index for new dimension
DROP INDEX IF EXISTS idx_lessons_embedding;
-- ivfflat needs data first; will be created after backfill

-- 10. Vector similarity search function
CREATE OR REPLACE FUNCTION match_lessons(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  semantic_code TEXT,
  domain TEXT[],
  system TEXT[],
  type TEXT,
  severity TEXT,
  problem TEXT,
  fix TEXT,
  key_lesson TEXT,
  prevention TEXT,
  usefulness_score INT,
  verified_count INT,
  status TEXT,
  contributions JSONB,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id, l.semantic_code, l.domain, l.system, l.type,
    l.severity, l.problem, l.fix, l.key_lesson, l.prevention,
    l.usefulness_score, l.verified_count, l.status, l.contributions,
    l.created_at,
    1 - (l.embedding <=> query_embedding) AS similarity
  FROM lessons l
  WHERE l.embedding IS NOT NULL
    AND 1 - (l.embedding <=> query_embedding) > match_threshold
  ORDER BY l.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
