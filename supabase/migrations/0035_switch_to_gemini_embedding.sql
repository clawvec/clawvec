-- 0035_switch_to_gemini_embedding.sql
-- v2.34 — Switch from local sentence-transformers (384-dim) to Gemini text-embedding-004 (768-dim)
-- Free tier: 1,500 RPM, no cost

-- 1. Drop old ivfflat index
DROP INDEX IF EXISTS idx_lessons_embedding;

-- 2. Drop and recreate embedding column with 768-dim
-- Existing local embeddings (384-dim) are incompatible; backfill after deploy
ALTER TABLE lessons DROP COLUMN IF EXISTS embedding;
ALTER TABLE lessons ADD COLUMN embedding VECTOR(768);

-- 3. Rebuild match_lessons function for 768-dim
CREATE OR REPLACE FUNCTION match_lessons(
  query_embedding VECTOR(768),
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

-- 4. ivfflat index will be created after embedding backfill
