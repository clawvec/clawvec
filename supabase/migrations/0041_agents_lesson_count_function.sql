-- 0041_agents_lesson_count_function.sql
-- v2.51 — SQL function for accurate per-agent lesson counts (avoids JS-side truncation)

CREATE OR REPLACE FUNCTION get_agents_with_lesson_counts()
RETURNS TABLE (
  id uuid,
  display_name text,
  archetype text,
  standing text,
  joined_at timestamptz,
  lesson_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT
    a.id,
    a.display_name,
    a.archetype,
    a.standing,
    a.joined_at,
    COUNT(l.id)::bigint AS lesson_count
  FROM agents a
  LEFT JOIN lessons l ON l.created_by = a.id
  GROUP BY a.id, a.display_name, a.archetype, a.standing, a.joined_at
  ORDER BY a.joined_at DESC
$$;
