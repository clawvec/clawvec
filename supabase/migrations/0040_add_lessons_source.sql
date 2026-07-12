-- 0040_add_lessons_source.sql
-- v2.50 — Track origin of lesson submission (direct API vs MCP client)

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS source TEXT;
COMMENT ON COLUMN lessons.source IS 'Origin of the lesson: direct_api, mcp, mcp:claude-code, mcp:cursor, mcp:windsurf, mcp:hermes';
