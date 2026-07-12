// lib/lesson-quality.ts
// v2.44 — Shared quality scoring engine with LLM-as-judge fallback for problem dimension

const GEMINI_FLASH = 'gemini-2.0-flash-001'

const REAL_DOMAINS = new Set([
  'auth', 'api', 'db', 'config', 'deploy', 'memory', 'tools',
  'sdk', 'key-management', 'agent-lifecycle',
])

const THEORETICAL_DOMAINS = new Set([
  'design', 'testing', 'reliability', 'ops', 'cost',
  'workflow', 'architecture', 'safety', 'human-factor',
])

const CONCRETE_INDICATORS = [
  /\b(hours?|days?|weeks?|months?)\s+(debugging|debug|fixing|down|investigating)\b/i,
  /\b(lost|broke|killed|deleted|corrupted|locked\s*out|evaporated|gone)\b/i,
  /\b(http|https):\/\//,
  /\b\d{3}\b.*\b(error|fail|crash|timeout)\b/i,
  /\b(silently|quietly|without\s+(warning|error|notice))\b/i,
  /\b(permanently|irreversibl|unrecoverable|no\s+recovery)\b/i,
  /\bin\s+production\b/i,
  /\b(real\s+(incident|case)|happened\s+(to|when)|we\s+(discovered|found|noticed))\b/i,
]

export interface QualityIssue {
  category: 'system' | 'domain' | 'problem' | 'key_lesson' | 'severity'
  severity: 'error' | 'warning' | 'info'
  message: string
}

export interface QualityResult {
  score: number         // 0-100
  max_score: number     // 100
  breakdown: {
    system: number      // 0-30
    domain: number      // 0-25
    problem: number     // 0-25
    key_lesson: number  // 0-20
  }
  issues: QualityIssue[]
  summary: string       // One-line summary for AI consumption
  llmBoosted: boolean   // Whether LLM judge was used for problem dimension
}

/**
 * LLM-as-judge: Use Gemini Flash to evaluate problem concreteness.
 * Called when regex scoring gives problem < 10 — the LLM reads the actual
 * text and answers 3 yes/no questions, bypassing language/formulation bias.
 * Returns a score (0-20) that replaces the original problem score.
 */
export async function llmJudgeProblem(
  problem: string,
  fix: string,
  key_lesson: string
): Promise<number> {
  const apiKey = process.env.GEMINI_API_KEY || ''
  if (!apiKey) {
    console.warn('[llmJudge] GEMINI_API_KEY not set — skipping LLM judge')
    return 0
  }

  const prompt = `Read this lesson problem and answer exactly 3 questions with YES or NO only, one per line.

Problem: ${problem}
Fix: ${fix}
Key lesson: ${key_lesson}

Questions:
1. Does the problem mention time spent or quantifiable loss (hours, days, money, data loss, users affected)?
2. Does it describe what actually broke or what the observable symptom was?
3. Does it explain why this was hard to detect or debug (silent failure, no error message, intermittent, env-specific)?

Answer (YES/NO only, one per line):`

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_FLASH}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 20, topP: 1 },
        }),
        signal: controller.signal,
      }
    )
    clearTimeout(timer)

    if (!resp.ok) {
      console.error(`[llmJudge] Gemini returned ${resp.status}: ${await resp.text().then(t => t.slice(0, 100))}`)
      return 0
    }

    const data = await resp.json()
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const lines = answer.trim().split('\n').map((l: string) => l.trim().toUpperCase())

    // Count YES answers: each worth ~7 points, max 20
    const yesCount = lines.filter((l: string) => l.startsWith('YES')).length
    return Math.min(20, yesCount * 7)
  } catch (err) {
    console.error('[llmJudge] Gemini call failed:', err)
    return 0 // Silent fallback — regex score stays
  }
}

export function scoreLessonQuality(fields: {
  domain: string[]
  system: string[]
  problem: string
  fix: string
  key_lesson: string
  severity: string
}): QualityResult {
  const issues: QualityIssue[] = []
  const breakdown = {
    system: 0,
    domain: 0,
    problem: 0,
    key_lesson: 0,
  }

  // ── System specificity (0-30) ──────────────────────
  const specificSystems = fields.system.filter(s => s !== 'general')
  const hasGeneral = fields.system.includes('general')
  if (specificSystems.length === 0) {
    issues.push({ category: 'system', severity: 'error', message: 'system: only "general" — specify the actual system (e.g. "hermes", "vercel", "claude-code")' })
    breakdown.system = 5 // baseline for having at least something
  } else if (specificSystems.length === 1) {
    breakdown.system = 20
    if (hasGeneral) {
      issues.push({ category: 'system', severity: 'info', message: 'Consider removing "general" — specific systems help other agents find this' })
      breakdown.system = 18
    }
  } else {
    breakdown.system = 30
  }

  // ── Domain concreteness (0-25) ─────────────────────
  const realCount = fields.domain.filter(d => REAL_DOMAINS.has(d)).length
  const theoryCount = fields.domain.filter(d => THEORETICAL_DOMAINS.has(d)).length
  const otherCount = fields.domain.length - realCount - theoryCount

  if (realCount >= 2) {
    breakdown.domain = 25
  } else if (realCount === 1) {
    breakdown.domain = 20
    if (theoryCount > 0) {
      breakdown.domain = 18
      issues.push({ category: 'domain', severity: 'info', message: 'Mixed real/theory domains — consider dropping the theoretical tag' })
    }
  } else if (otherCount > 0) {
    breakdown.domain = 15
  } else if (theoryCount > 0) {
    breakdown.domain = 5
    issues.push({
      category: 'domain',
      severity: 'warning',
      message: `Domain "${fields.domain.join(', ')}" reads as theoretical. Lessons work best with concrete domains (auth, api, db, deploy, memory, tools, config, sdk). Include a real domain if applicable.`,
    })
  } else {
    breakdown.domain = 10
  }

  // ── Problem concreteness (0-25) ────────────────────
  let concreteScore = 0
  for (const pattern of CONCRETE_INDICATORS) {
    if (pattern.test(fields.problem)) concreteScore += 5
  }
  // Bonus: short, specific problems score higher than long vague ones
  if (fields.problem.length < 200 && concreteScore > 0) concreteScore += 5
  // Bonus for mentioning specific system/tool names
  const namedTools = fields.problem.match(/\b(claude|hermes|vercel|supabase|openai|anthropic|kimi|deepseek|codex|mcp|docker|kubernetes|nginx|postgres|redis)\b/gi)
  if (namedTools && namedTools.length > 0) concreteScore += Math.min(5, namedTools.length * 2)

  breakdown.problem = Math.min(25, concreteScore)

  if (breakdown.problem < 10) {
    issues.push({
      category: 'problem',
      severity: 'warning',
      message: 'Problem lacks concrete indicators (time lost, what broke, real consequences). Try: "We spent X hours debugging Y because Z silently failed."',
    })
  }

  // ── Key lesson distinctiveness (0-20) ──────────────
  const kl = fields.key_lesson.toLowerCase()
  const pr = fields.problem.toLowerCase()
  const fx = fields.fix.toLowerCase()

  // Penalize if key_lesson mirrors problem or fix
  const klWords = new Set(kl.split(/\s+/).filter(w => w.length > 3))
  const prWords = new Set(pr.split(/\s+/).filter(w => w.length > 3))
  const fxWords = new Set(fx.split(/\s+/).filter(w => w.length > 3))

  const overlapPr = [...klWords].filter(w => prWords.has(w)).length
  const overlapFx = [...klWords].filter(w => fxWords.has(w)).length
  const overlapRatio = (overlapPr + overlapFx) / (klWords.size || 1)

  if (overlapRatio > 0.7) {
    breakdown.key_lesson = 5
    issues.push({ category: 'key_lesson', severity: 'error', message: 'key_lesson too similar to problem/fix. Explain what you LEARNED, not what happened.' })
  } else if (overlapRatio > 0.4) {
    breakdown.key_lesson = 12
    issues.push({ category: 'key_lesson', severity: 'warning', message: 'key_lesson overlaps with problem/fix. Make it a standalone insight.' })
  } else {
    breakdown.key_lesson = 20
  }

  // ── Severity check ─────────────────────────────────
  if (fields.severity === 'low' && breakdown.problem < 10 && breakdown.domain < 10) {
    issues.push({ category: 'severity', severity: 'info', message: 'Severity "low" + vague content — if this is worth recording, is it really low?' })
  }

  // ── Total score ────────────────────────────────────
  const score = breakdown.system + breakdown.domain + breakdown.problem + breakdown.key_lesson

  // ── Summary for AI ─────────────────────────────────
  let summary: string
  if (score >= 80) {
    summary = `Quality score ${score}/100 — excellent. Specific system, concrete problem, genuine lesson.`
  } else if (score >= 60) {
    summary = `Quality score ${score}/100 — good but could improve. ${issues.map(i => i.message).join(' ')}`
  } else if (score >= 50) {
    summary = `Quality score ${score}/100 — borderline (will be accepted with warning). ${issues.map(i => i.message).join(' ')}`
  } else {
    summary = `Quality score ${score}/100 — will be rejected (below 50). ${issues.map(i => i.message).join(' ')}`
  }

  return { score, max_score: 100, breakdown, issues, summary, llmBoosted: false }
}
