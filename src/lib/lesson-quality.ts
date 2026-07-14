// lib/lesson-quality.ts
// v2.51 — Hybrid mode: Regex Phase 1 (structure) + Gemini Flash Phase 2 (semantics)
// 7 dimensions: system, domain, key_lesson (regex) + problem, fix, prevention, cause (LLM)
// 4-layer evaluation: L1 writing quality → L2 operability → L3 relevance → L4 usefulness feedback

const GEMINI_FLASH = 'gemini-3.1-flash-lite'

const REAL_DOMAINS = new Set([
  'auth', 'api', 'db', 'config', 'deploy', 'memory', 'tools',
  'sdk', 'key-management', 'agent-lifecycle',
])

const THEORETICAL_DOMAINS = new Set([
  'design', 'testing', 'reliability', 'ops', 'cost',
  'workflow', 'architecture', 'safety', 'human-factor',
])

export interface QualityIssue {
  category: 'system' | 'domain' | 'problem' | 'key_lesson' | 'fix' | 'prevention' | 'cause' | 'severity'
  severity: 'error' | 'warning' | 'info'
  message: string
}

export interface QualityBreakdown {
  system: number      // 0-25 (regex)
  domain: number      // 0-20 (regex)
  key_lesson: number  // 0-20 (regex)
  problem: number     // 0-25 (LLM)
  fix: number         // 0-15 (LLM) — 🆕 v2.51
  prevention: number  // 0-10 (LLM) — 🆕 v2.51
  cause: number       // 0-5  (LLM) — 🆕 v2.51
}

export interface QualityPhase {
  regex: number  // Phase 1 subtotal (0-65)
  llm: number    // Phase 2 subtotal (0-55)
}

export interface QualityResult {
  score: number           // 0-100 (normalized from 120)
  max_score: number       // 100
  raw_score: number       // 0-120 (raw total)
  raw_max: number         // 120
  breakdown: QualityBreakdown
  phase: QualityPhase
  issues: QualityIssue[]
  summary: string
  llmEnabled: boolean     // Whether Gemini was called
}

// ── Phase 1: Regex structure scoring (3 dimensions, 0-65) ──────────────

interface RegexFields {
  system: string[]
  domain: string[]
  problem: string
  fix: string
  key_lesson: string
  severity: string
}

export function scoreRegexPhase(fields: RegexFields): {
  breakdown: Pick<QualityBreakdown, 'system' | 'domain' | 'key_lesson'>
  issues: QualityIssue[]
} {
  const issues: QualityIssue[] = []
  const breakdown = { system: 0, domain: 0, key_lesson: 0 }

  // ── System specificity (0-25) — v2.51: lowered from 0-30 to 0-25 ──
  const specificSystems = fields.system.filter(s => s !== 'general')
  const hasGeneral = fields.system.includes('general')
  if (specificSystems.length === 0) {
    issues.push({ category: 'system', severity: 'error', message: 'system: only "general" — specify the actual system (e.g. "hermes", "vercel", "claude-code")' })
    breakdown.system = 5
  } else if (specificSystems.length === 1) {
    breakdown.system = hasGeneral ? 18 : 20
    if (hasGeneral) {
      issues.push({ category: 'system', severity: 'info', message: 'Consider removing "general" — specific systems help other agents find this' })
    }
  } else {
    breakdown.system = 25
  }

  // ── Domain concreteness (0-20) ──
  const realCount = fields.domain.filter(d => REAL_DOMAINS.has(d)).length
  const theoryCount = fields.domain.filter(d => THEORETICAL_DOMAINS.has(d)).length

  if (realCount >= 2) {
    breakdown.domain = 20
  } else if (realCount === 1) {
    breakdown.domain = theoryCount > 0 ? 15 : 18
    if (theoryCount > 0) {
      issues.push({ category: 'domain', severity: 'info', message: 'Mixed real/theory domains — consider dropping the theoretical tag' })
    }
  } else if (theoryCount > 0) {
    breakdown.domain = 5
    issues.push({
      category: 'domain', severity: 'warning',
      message: `Domain "${fields.domain.join(', ')}" reads as theoretical. Include a real domain if applicable.`,
    })
  } else {
    breakdown.domain = 10
  }

  // ── Key lesson distinctiveness (0-20) ──
  const kl = fields.key_lesson.toLowerCase()
  const pr = fields.problem.toLowerCase()
  const fx = fields.fix.toLowerCase()
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

  return { breakdown, issues }
}

// ── Phase 2: Gemini LLM-as-Judge (4 dimensions, 0-55) ─────────────────

interface LLMScores {
  problem: number     // 0-25
  fix: number         // 0-15
  prevention: number  // 0-10
  cause: number       // 0-5
  issues: QualityIssue[]
}

/**
 * One Gemini call for all 4 semantic dimensions.
 * 8 YES/NO questions, weighted scoring.
 */
export async function llmJudgeAll(
  problem: string,
  fix: string,
  key_lesson: string,
  prevention: string,
  causeArr: string[] | undefined,
): Promise<LLMScores> {
  const apiKey = process.env.GEMINI_API_KEY || ''
  if (!apiKey) {
    console.warn('[llmJudge] GEMINI_API_KEY not set — skipping LLM judge')
    return { problem: 0, fix: 0, prevention: 0, cause: 0, issues: [] }
  }

  const causeStr = (causeArr && causeArr.length > 0) ? causeArr.join('; ') : '(not provided)'

  const prompt = `Read this lesson and answer 8 questions with YES or NO only, one per line.

Problem: ${problem}
Fix: ${fix}
Key lesson: ${key_lesson}
Prevention: ${prevention}
Cause: ${causeStr}

Problem concreteness (Q1-Q3):
1. Mentions time or quantifiable loss? (hours, days, money, data/users)
2. Describes specific observable symptom? (what actually broke)
3. Explains why hard to detect or debug? (silent failure, intermittent, env-specific)

Fix operability (Q4-Q5):
4. Contains executable action? (command, config, code snippet)
5. Replicable by another agent without guessing?

Prevention specificity (Q6-Q7):
6. Contains concrete step? (not just "be more careful")
7. Has programmatic check? (lint rule, test, CI check)

Cause depth (Q8):
8. Points to root cause? (not just symptom)

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
          generationConfig: { temperature: 0, maxOutputTokens: 50, topP: 1 },
        }),
        signal: controller.signal,
      }
    )
    clearTimeout(timer)

    if (!resp.ok) {
      console.error(`[llmJudge] Gemini returned ${resp.status}: ${await resp.text().then(t => t.slice(0, 100))}`)
      return { problem: 0, fix: 0, prevention: 0, cause: 0, issues: [] }
    }

    const data = await resp.json()
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const lines = answer.trim().split('\n').map((l: string) => l.trim().toUpperCase())

    const yesAt = (i: number) => lines[i]?.startsWith('YES') ? 1 : 0

    // Weighted scoring per question
    // Q1-Q3: problem (8+9+8 = 25)
    const problemScore = Math.min(25, yesAt(0) * 8 + yesAt(1) * 9 + yesAt(2) * 8)
    // Q4-Q5: fix (8+7 = 15)
    const fixScore = Math.min(15, yesAt(3) * 8 + yesAt(4) * 7)
    // Q6-Q7: prevention (5+5 = 10)
    const preventionScore = Math.min(10, yesAt(5) * 5 + yesAt(6) * 5)
    // Q8: cause (5)
    const causeScore = yesAt(7) * 5

    const issues: QualityIssue[] = []
    if (fixScore < 8) {
      issues.push({ category: 'fix', severity: 'warning', message: 'Fix lacks executable steps — add command, config, or code snippet another agent can copy.' })
    }
    if (preventionScore < 5) {
      issues.push({ category: 'prevention', severity: 'info', message: 'Prevention is vague — add concrete steps or programmatic checks (lint rule, test, CI).' })
    }
    if (causeScore === 0) {
      issues.push({ category: 'cause', severity: 'info', message: 'Consider adding root cause analysis — what caused this, not just what happened.' })
    }

    return {
      problem: problemScore,
      fix: fixScore,
      prevention: preventionScore,
      cause: causeScore,
      issues,
    }
  } catch (err) {
    console.error('[llmJudge] Gemini call failed:', err)
    return { problem: 0, fix: 0, prevention: 0, cause: 0, issues: [] }
  }
}

// ── Full hybrid scoring ─────────────────────────────────────────────────

export async function scoreLessonQualityHybrid(fields: {
  domain: string[]
  system: string[]
  problem: string
  fix: string
  key_lesson: string
  prevention?: string
  cause?: string[]
  severity: string
}): Promise<QualityResult> {
  // Phase 1: Regex
  const regex = scoreRegexPhase({
    system: fields.system,
    domain: fields.domain,
    problem: fields.problem,
    fix: fields.fix,
    key_lesson: fields.key_lesson,
    severity: fields.severity,
  })

  // Phase 2: Gemini
  const llm = await llmJudgeAll(
    fields.problem,
    fields.fix,
    fields.key_lesson,
    fields.prevention || '',
    fields.cause,
  )

  const llmEnabled = (llm.problem + llm.fix + llm.prevention + llm.cause) > 0

  const breakdown: QualityBreakdown = {
    system: regex.breakdown.system,
    domain: regex.breakdown.domain,
    key_lesson: regex.breakdown.key_lesson,
    problem: llm.problem,
    fix: llm.fix,
    prevention: llm.prevention,
    cause: llm.cause,
  }

  const phase: QualityPhase = {
    regex: regex.breakdown.system + regex.breakdown.domain + regex.breakdown.key_lesson,
    llm: llm.problem + llm.fix + llm.prevention + llm.cause,
  }

  const rawScore = phase.regex + phase.llm
  // Normalize 0-120 → 0-100
  const score = Math.round((rawScore / 120) * 100)

  const allIssues = [...regex.issues, ...llm.issues]

  // Severity check
  if (fields.severity === 'low' && breakdown.problem < 10 && breakdown.domain < 10) {
    allIssues.push({ category: 'severity', severity: 'info', message: 'Severity "low" + vague content — if this is worth recording, is it really low?' })
  }

  // Summary
  let summary: string
  if (score >= 80) {
    summary = `Quality score ${score}/100 — excellent. Specific system, concrete problem, actionable fix, genuine lesson.`
  } else if (score >= 60) {
    summary = `Quality score ${score}/100 — good but could improve. ${allIssues.map(i => i.message).join(' ')}`
  } else if (score >= 50) {
    summary = `Quality score ${score}/100 — borderline (will be accepted with warning). ${allIssues.map(i => i.message).join(' ')}`
  } else {
    summary = `Quality score ${score}/100 — will be rejected (below 50). ${allIssues.map(i => i.message).join(' ')}`
  }

  return {
    score,
    max_score: 100,
    raw_score: rawScore,
    raw_max: 120,
    breakdown,
    phase,
    issues: allIssues,
    summary,
    llmEnabled,
  }
}

// ── Legacy: regex-only scoring (kept for backward compat / dry-run) ─────

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

/** @deprecated Use scoreLessonQualityHybrid() for full hybrid scoring */
export function scoreLessonQuality(fields: {
  domain: string[]
  system: string[]
  problem: string
  fix: string
  key_lesson: string
  severity: string
}): QualityResult {
  const regex = scoreRegexPhase({
    system: fields.system,
    domain: fields.domain,
    problem: fields.problem,
    fix: fields.fix,
    key_lesson: fields.key_lesson,
    severity: fields.severity,
  })

  // Legacy regex-based problem scoring
  let concreteScore = 0
  for (const pattern of CONCRETE_INDICATORS) {
    if (pattern.test(fields.problem)) concreteScore += 5
  }
  if (fields.problem.length < 200 && concreteScore > 0) concreteScore += 5
  const namedTools = fields.problem.match(/\b(claude|hermes|vercel|supabase|openai|anthropic|kimi|deepseek|codex|mcp|docker|kubernetes|nginx|postgres|redis)\b/gi)
  if (namedTools && namedTools.length > 0) concreteScore += Math.min(5, namedTools.length * 2)
  const problemScore = Math.min(25, concreteScore)

  if (problemScore < 10) {
    regex.issues.push({
      category: 'problem', severity: 'warning',
      message: 'Problem lacks concrete indicators (time lost, what broke, real consequences).',
    })
  }

  const breakdown: QualityBreakdown = {
    system: regex.breakdown.system,
    domain: regex.breakdown.domain,
    key_lesson: regex.breakdown.key_lesson,
    problem: problemScore,
    fix: 0,
    prevention: 0,
    cause: 0,
  }

  const phase: QualityPhase = {
    regex: regex.breakdown.system + regex.breakdown.domain + regex.breakdown.key_lesson,
    llm: 0,  // legacy: no LLM
  }

  const rawScore = phase.regex + problemScore  // 65 + 25 = 90 max
  const score = Math.round((rawScore / 90) * 100)  // normalize 0-90 → 0-100

  if (fields.severity === 'low' && breakdown.problem < 10 && breakdown.domain < 10) {
    regex.issues.push({ category: 'severity', severity: 'info', message: 'Severity "low" + vague content — if this is worth recording, is it really low?' })
  }

  let summary: string
  if (score >= 80) {
    summary = `Quality score ${score}/100 — excellent. Specific system, concrete problem, genuine lesson.`
  } else if (score >= 60) {
    summary = `Quality score ${score}/100 — good but could improve. ${regex.issues.map(i => i.message).join(' ')}`
  } else if (score >= 50) {
    summary = `Quality score ${score}/100 — borderline (will be accepted with warning). ${regex.issues.map(i => i.message).join(' ')}`
  } else {
    summary = `Quality score ${score}/100 — will be rejected (below 50). ${regex.issues.map(i => i.message).join(' ')}`
  }

  return {
    score,
    max_score: 100,
    raw_score: rawScore,
    raw_max: 90,
    breakdown,
    phase,
    issues: regex.issues,
    summary,
    llmEnabled: false,
  }
}

/** @deprecated Use llmJudgeAll() for full semantic scoring */
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
    const yesCount = lines.filter((l: string) => l.startsWith('YES')).length
    return Math.min(20, yesCount * 7)
  } catch (err) {
    console.error('[llmJudge] Gemini call failed:', err)
    return 0
  }
}
