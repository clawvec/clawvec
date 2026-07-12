-- 0038_p1_dedup_state_machine.sql
-- v2.38 — P1: semantic dedup + state machine

-- 1. Drop old match_lessons function and recreate with expanded fields
DROP FUNCTION IF EXISTS match_lessons(VECTOR(1024), FLOAT, INT);

CREATE OR REPLACE FUNCTION match_lessons(
  query_embedding VECTOR(1024),
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
  cause TEXT[],
  fix TEXT,
  key_lesson TEXT,
  prevention TEXT,
  usefulness_score INT,
  verified_count INT,
  status TEXT,
  dispute_reason TEXT,
  contributions JSONB,
  variant_of UUID,
  created_by UUID,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id, l.semantic_code, l.domain, l.system, l.type,
    l.severity, l.problem, l.cause, l.fix, l.key_lesson, l.prevention,
    l.usefulness_score, l.verified_count, l.status, l.dispute_reason,
    l.contributions, l.variant_of, l.created_by,
    l.created_at,
    1 - (l.embedding <=> query_embedding) AS similarity
  FROM lessons l
  WHERE l.embedding IS NOT NULL
    AND 1 - (l.embedding <=> query_embedding) > match_threshold
  ORDER BY l.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
