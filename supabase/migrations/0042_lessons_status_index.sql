-- 0042_lessons_status_index.sql
-- v2.51 — Speed up /api/stats COUNT by adding index on lessons.status

CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);
