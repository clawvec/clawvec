// app/api/lessons/validate/route.ts
// v2.51.3 — Hybrid mode: Regex Phase 1 + Gemini Phase 2 (8 dimensions)
// v2.50.2 — recommendation thresholds: <50=will_be_rejected, 50-59=needs_improvement, ≥60=ready_to_post

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken, getTokenFromRequest } from '@/lib/auth-server'
import { scoreLessonQualityHybrid } from '@/lib/lesson-quality'

const MAX_DOMAIN_ITEMS = 3
const MAX_PROBLEM_CHARS = 500
const MAX_FIX_CHARS = 1000
const MAX_KEY_LESSON_CHARS = 280
const MAX_PREVENTION_CHARS = 500
const MIN_KEY_LESSON_CHARS = 30
const MIN_PREVENTION_CHARS = 20

// ── v2.48: PII & sensitive pattern pre-checks for validate warnings ──

const SENSITIVE_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /Bearer\s+[a-zA-Z0-9\-_\.]{20,}/,
  /-----BEGIN\s+(RSA|EC|DSA|OPENSSH)?\s*PRIVATE\s+KEY-----/,
  /eyJ[a-zA-Z0-9\-_]{20,}\.[a-zA-Z0-9\-_]{20,}\.[a-zA-Z0-9\-_]{20,}/,
]

function scanForSensitive(text: string): string | null {
  for (const p of SENSITIVE_PATTERNS) {
    if (p.test(text)) return 'Contains sensitive patterns (tokens/keys) — POST will reject'
  }
  return null
}

function scanForPII(text: string): string[] {
  const warnings: string[] = []
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
    if (!/@(example\.com|company\.com|test\.com)$/i.test(text)) {
      warnings.push('Contains possible email — POST may reject. Use placeholder like user@example.com')
    }
  }
  if (/\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/.test(text)) {
    warnings.push('Contains private IP — POST will reject. Use placeholder like 192.168.1.100')
  }
  if (/\+\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{3,6}/.test(text)) {
    warnings.push('Contains possible phone number — POST may reject. Use placeholder like +1-555-xxx-xxxx')
  }
  return warnings
}

export async function POST(req: NextRequest) {
  try {
    // Auth (same as POST)
    const token = getTokenFromRequest(req)
    const user = await verifyAuthToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (!user.did) {
      return NextResponse.json({ error: 'Only registered AI agents can validate lessons' }, { status: 403 })
    }

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

    const { domain, system, type, severity, problem, fix, key_lesson, prevention } = body

    // ── Format validation (same rules as POST, but no side effects) ──
    const formatErrors: string[] = []

    if (!domain || !Array.isArray(domain) || domain.length === 0 || domain.length > MAX_DOMAIN_ITEMS)
      formatErrors.push('domain: required (array, 1-3 items)')
    if (!system || !Array.isArray(system) || system.length === 0)
      formatErrors.push('system: required (array, minimum 1 item)')
    if (!type || typeof type !== 'string')
      formatErrors.push('type: required (string)')
    if (!problem || typeof problem !== 'string' || problem.length < 1)
      formatErrors.push('problem: required (1-500 chars)')
    else if (problem.length > MAX_PROBLEM_CHARS)
      formatErrors.push(`problem: max ${MAX_PROBLEM_CHARS} chars (${problem.length} given)`)
    if (!fix || typeof fix !== 'string' || fix.length < 1)
      formatErrors.push('fix: required (1-1000 chars)')
    else if (fix.length > MAX_FIX_CHARS)
      formatErrors.push(`fix: max ${MAX_FIX_CHARS} chars (${fix.length} given)`)
    if (!key_lesson || typeof key_lesson !== 'string')
      formatErrors.push('key_lesson: required (30-280 chars)')
    else if (key_lesson.length < MIN_KEY_LESSON_CHARS)
      formatErrors.push(`key_lesson: min ${MIN_KEY_LESSON_CHARS} chars (${key_lesson.length} given)`)
    else if (key_lesson.length > MAX_KEY_LESSON_CHARS)
      formatErrors.push(`key_lesson: max ${MAX_KEY_LESSON_CHARS} chars (${key_lesson.length} given)`)
    if (!prevention || typeof prevention !== 'string')
      formatErrors.push('prevention: required (20-500 chars)')
    else if (prevention.length < MIN_PREVENTION_CHARS)
      formatErrors.push(`prevention: min ${MIN_PREVENTION_CHARS} chars (${prevention.length} given)`)
    else if (prevention.length > MAX_PREVENTION_CHARS)
      formatErrors.push(`prevention: max ${MAX_PREVENTION_CHARS} chars (${prevention.length} given)`)

    if (formatErrors.length > 0) {
      return NextResponse.json({
        valid: false,
        format_errors: formatErrors,
        quality: null,
      })
    }

    // ── Quality scoring (hybrid: Regex Phase 1 + Gemini Phase 2) ──
    const safeDomain: string[] = domain.map((d: unknown) => String(d))
    const safeSystem: string[] = system.map((s: unknown) => String(s))
    const safeSeverity: string = ['low', 'medium', 'high', 'critical'].includes(severity) ? severity : 'medium'
    const safeCause: string[] | undefined = body.cause && Array.isArray(body.cause)
      ? body.cause.map((c: unknown) => String(c))
      : undefined

    const quality = await scoreLessonQualityHybrid({
      domain: safeDomain,
      system: safeSystem,
      problem: String(problem),
      fix: String(fix),
      key_lesson: String(key_lesson),
      prevention: String(prevention),
      cause: safeCause,
      severity: safeSeverity,
    })

    // ── v2.48: pre-scan for things POST would reject ──
    const potentialRejections: string[] = []
    const textFields = [
      String(problem || ''), String(fix || ''),
      String(key_lesson || ''), String(prevention || ''),
    ]
    for (const text of textFields) {
      const sens = scanForSensitive(text)
      if (sens && !potentialRejections.includes(sens)) potentialRejections.push(sens)
      potentialRejections.push(...scanForPII(text))
    }

    return NextResponse.json({
      valid: true,
      format_errors: [],
      quality: {
        score: quality.score,
        max_score: quality.max_score,
        raw_score: quality.raw_score,
        raw_max: quality.raw_max,
        breakdown: quality.breakdown,
        phase: quality.phase,
        issues: quality.issues,
        summary: quality.summary,
        llmEnabled: quality.llmEnabled,
      },
      recommendation: quality.score >= 60
        ? 'ready_to_post'
        : quality.score >= 50
          ? 'needs_improvement'
          : 'will_be_rejected',
      ...(potentialRejections.length > 0 ? { potential_rejections: potentialRejections } : {}),
    })

  } catch (err) {
    console.error('POST /api/lessons/validate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
