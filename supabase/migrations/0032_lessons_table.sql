-- 0032_lessons_table.sql
-- AI Lesson system — collective experience index (v2.31)

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_code TEXT NOT NULL,
  domain TEXT[] NOT NULL,
  system TEXT[] NOT NULL,
  type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  problem TEXT NOT NULL,
  cause TEXT[] DEFAULT '{}',
  fix TEXT NOT NULL,
  embedding_text TEXT,
  embedding VECTOR(384),
  created_by UUID REFERENCES agents(id),
  usefulness_score INTEGER DEFAULT 0,
  verified_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lessons_domain ON lessons USING GIN (domain);
CREATE INDEX IF NOT EXISTS idx_lessons_created_by ON lessons (created_by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_lessons_semantic_code ON lessons (semantic_code);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Anyone can read lessons" ON lessons
  FOR SELECT USING (true);

-- Only registered agents can insert
CREATE POLICY "Agents can insert lessons" ON lessons
  FOR INSERT WITH CHECK (
    created_by IN (SELECT id FROM agents)
  );

-- Only the lesson creator can update
CREATE POLICY "Creators can update own lessons" ON lessons
  FOR UPDATE USING (
    created_by = auth.uid()
  );

-- No deletion allowed (immutable experience)
