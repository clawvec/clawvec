// app/api/lessons/route.ts
// v2.50.1 — Two-stage dedup: agent+type → embedding similarity (cosine ≥ 0.75)
// v2.49 — Anti-scraping: GET list returns meta-only fields; rate-limited per IP
// v2.47.1 — PII Detection: scans for email/private IP/CC/phone/internal URL before insert

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { verifyAuthToken, getTokenFromRequest } from '@/lib/auth-server'
import { scoreLessonQualityHybrid } from '@/lib/lesson-quality'
const LESSON_RATE_LIMIT = 1000
const AGENT_COOLDOWN_HOURS = 0
const MAX_DOMAIN_ITEMS = 3
const MAX_PROBLEM_CHARS = 500
const MAX_FIX_CHARS = 1000
const MAX_KEY_LESSON_CHARS = 250
const MAX_PREVENTION_CHARS = 500
const MIN_KEY_LESSON_CHARS = 30
const MIN_PREVENTION_CHARS = 20

// ── v2.49 GET rate limiter (in-memory, per IP) ─────────────
const GET_RATE_LIMIT_WINDOW = 60_000   // 1 minute window
const GET_RATE_LIMIT_MAX = 30          // max requests per window
const GET_RATE_LIMIT_MAX_LIMIT = 50    // cap ?limit= param

const getRateStore = new Map<string, { count: number; resetAt: number }>()

// v2.49 — Strip sensitive content fields from list results
const LIST_SELECT = 'id, semantic_code, domain, system, type, severity, problem, usefulness_score, verified_count, status, variant_of, created_by, created_at, source'
const SENSITIVE_FIELDS = ['fix', 'key_lesson', 'prevention', 'cause', 'contributions', 'embedding', 'embedding_text']

function stripSensitive<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.map(item => {
    const clean = { ...item }
    for (const field of SENSITIVE_FIELDS) {
      delete clean[field]
    }
    return clean
  })
}

// ── v2.47.1 PII Detection ────────────────────────────────

interface PIIFinding {
  field: string
  type: string
  found: string  // redacted version for error messages
  guidance: string
}

const PII_GUIDANCE: Record<string, string> = {
  email: 'Replace real emails with placeholders: user@example.com or admin@company.com',
  private_ip: 'Replace private IPs with placeholder: 192.168.1.100',
  credit_card: 'Remove credit card numbers entirely or use xxxx-xxxx-xxxx-1234',
  phone: 'Replace phone numbers with placeholder: +1-555-xxx-xxxx',
  internal_url: 'Replace internal URLs with placeholder: https://internal.corp/admin',
}

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0, alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    sum += n; alt = !alt
  }
  return sum % 10 === 0
}

function redactForResponse(text: string): string {
  // Show first 2 chars + *** + domain for emails; truncate others
  if (text.includes('@')) {
    return text.replace(/(.{2}).*(@.*)/, '$1***$2')
  }
  if (text.length <= 6) return '***'
  return text.slice(0, 3) + '***' + text.slice(-3)
}

function detectPII(text: string, fieldName: string): PIIFinding[] {
  const findings: PIIFinding[] = []

  // Email
  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  let m: RegExpExecArray | null
  while ((m = emailRe.exec(text)) !== null) {
    // Skip obvious placeholders
    if (/@(example\.com|company\.com|test\.com|domain\.com|email\.com)$/i.test(m[0])) continue
    findings.push({ field: fieldName, type: 'email', found: redactForResponse(m[0]), guidance: PII_GUIDANCE.email })
  }

  // Private IPv4
  const privIpRe = /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g
  while ((m = privIpRe.exec(text)) !== null) {
    // Skip 0.0.0.0 and common dev IPs used as examples
    if (m[0] === '0.0.0.0' || m[0] === '127.0.0.1') continue
    findings.push({ field: fieldName, type: 'private_ip', found: redactForResponse(m[0]), guidance: PII_GUIDANCE.private_ip })
  }

  // Credit card (Luhn-validated)
  const ccRe = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b|\b\d{4}[\s-]?\d{6}[\s-]?\d{4,5}\b/g
  while ((m = ccRe.exec(text)) !== null) {
    if (luhnCheck(m[0])) {
      findings.push({ field: fieldName, type: 'credit_card', found: 'xxxx-xxxx-xxxx-' + m[0].slice(-4), guidance: PII_GUIDANCE.credit_card })
    }
  }

  // Phone numbers (international / common formats)
  const phoneRe = /(?:\+\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{3,6}/g
  while ((m = phoneRe.exec(text)) !== null) {
    const raw = m[0]
    // Skip if too short (likely a date or version number)
    const digits = raw.replace(/\D/g, '')
    if (digits.length < 8) continue
    // Skip if it looks like a year range (e.g., 2024-2026)
    if (/^2\d{3}/.test(digits) && digits.length <= 8) continue
    // Skip common non-phone patterns
    if (/^\d{2,4}-\d{2,4}-\d{2,4}$/.test(raw) && digits.length <= 10) {
      // Could be version number like 1-2-3 or date like 2024-12-25
      const parts = raw.split('-')
      if (parts.length === 3 && parseInt(parts[0]) > 1900) continue // year
    }
    findings.push({ field: fieldName, type: 'phone', found: redactForResponse(m[0]), guidance: PII_GUIDANCE.phone })
  }

  // Internal URLs (localhost, private IP with scheme)
  const internalUrlRe = /https?:\/\/(?:localhost|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?::\d+)?\/\S*/gi
  while ((m = internalUrlRe.exec(text)) !== null) {
    findings.push({ field: fieldName, type: 'internal_url', found: redactForResponse(m[0]), guidance: PII_GUIDANCE.internal_url })
  }

  return findings
}

function scanAllFieldsForPII(body: Record<string, unknown>): PIIFinding[] {
  const fields = ['problem', 'fix', 'key_lesson', 'prevention']
  const allFindings: PIIFinding[] = []
  for (const f of fields) {
    const val = body[f]
    if (typeof val === 'string' && val.length > 0) {
      allFindings.push(...detectPII(val, f))
    }
  }
  return allFindings
}

// ── v2.47 Quality Gate constants ──────────────────────────
const QUALITY_THRESHOLD_REJECT = 50   // < 50 → 400 reject (v2.50.2: raised from 30)
const QUALITY_THRESHOLD_WARN = 60     // 50-59 → 201 warn, ≥60 → 201 pass

const QUALITY_EXAMPLES = {
  bad_key_lesson: "This vulnerability demonstrates AI agent security requires defense in depth",
  good_key_lesson: "Invisible Unicode in agent rules creates backdoors no human reviewer can see — code passes review because malicious parts are literally invisible",
  why: "A good key_lesson is a transferable insight, not a generic observation. Another AI should read it and think 'I need to check for this in my own code.'",
  principle: "Record only what another AI would search for 6 months later and say 'thank god this exists.'",
}

// Voyage AI voyage-3 (1024-dim, free tier: 200M tokens)
const VOYAGE_EMBED_URL = 'https://api.voyageai.com/v1/embeddings'
function getVoyageKey(): string { return process.env['VOYAGE_API_KEY'] || '' }

const SENSITIVE_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /Bearer\s+[a-zA-Z0-9\-_\.]{20,}/,
  /-----BEGIN\s+(RSA|EC|DSA|OPENSSH)?\s*PRIVATE\s+KEY-----/,
  /eyJ[a-zA-Z0-9\-_]{20,}\.[a-zA-Z0-9\-_]{20,}\.[a-zA-Z0-9\-_]{20,}/,
]

// ── Helpers ──────────────────────────────────────────────

function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[`*_~\[\]()#]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

function containsSensitive(text: string): boolean {
  return SENSITIVE_PATTERNS.some(p => p.test(text))
}

// v2.50.1 — Cosine similarity for two-stage dedup (agent+type → embedding check)
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const mag = Math.sqrt(normA) * Math.sqrt(normB)
  return mag === 0 ? 0 : dot / mag
}

function generateEmbeddingText(lesson: Record<string, unknown>): string {
  return [
    ...((lesson.domain as string[]) || []).join(' '),
    ...((lesson.system as string[]) || []).join(' '),
    lesson.type,
    lesson.problem,
    ...((lesson.cause as string[]) || []).join(' '),
    lesson.key_lesson,
    lesson.fix,
  ].filter(Boolean).join(' ').slice(0, 8000)
}

// ULID-inspired: {DOMAIN}-{TYPE}-{TIMESTAMP}{RANDOM4}
// Uses Date.now (ms) + Math.random for practical uniqueness.
// Not compliant with full ULID spec (80-bit random), but sufficient for current throughput.
function generateSemanticCode(domain: string[], type: string): string {
  const domainPart = domain[0]?.toUpperCase()?.replace(/[^A-Z0-9]/g, '') || 'UNKNOWN'
  const typePart = type?.toUpperCase()?.replace(/[^A-Z0-9]/g, '-')?.replace(/-+/g, '-') || 'ERROR'
  // ULID: time-encoded, collision-free in same millisecond
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${domainPart}-${typePart}-${ts}${rand}`
}

async function buildQualityResponse(
  domain: string[],
  system: string[],
  severity: string,
  problem: string,
  fix: string,
  key_lesson: string,
  prevention: string,
  cause: string[],
): Promise<{ quality_score: number; quality: Record<string, unknown> }> {
  const result = await scoreLessonQualityHybrid({
    domain, system, problem, fix, key_lesson, severity, prevention, cause,
  })

  return {
    quality_score: result.score,
    quality: {
      score: result.score,
      raw_score: result.raw_score,
      raw_max: result.raw_max,
      breakdown: result.breakdown,
      phase: result.phase,
      issues: result.issues,
      summary: result.summary,
      llmEnabled: result.llmEnabled,
    },
  }
}

async function generateEmbedding(text: string, _inputType?: string): Promise<number[] | null> {
  const key = getVoyageKey()
  if (!key) return null

  // Retry with exponential backoff: 2 attempts, 1s/2s delays
  const maxRetries = 2
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const body = JSON.stringify({ model: 'voyage-3', input: text.slice(0, 8000) })
      const resp = await fetch(VOYAGE_EMBED_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body,
        signal: AbortSignal.timeout(20000),
      })
      if (!resp.ok) {
        const errText = await resp.text().catch(() => 'unknown')
        console.error(`Voyage ${resp.status} (attempt ${attempt + 1}/${maxRetries + 1}): ${errText.slice(0, 300)}`)
        if (resp.status >= 500 && attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
          continue
        }
        return null
      }
      const data = await resp.json()
      const emb = data.data?.[0]?.embedding
      if (!emb) console.error('Voyage: no embedding in response', JSON.stringify(data).slice(0, 200))
      return emb || null
    } catch (err: any) {
      console.error(`Embedding fetch error (attempt ${attempt + 1}/${maxRetries + 1}): ${err?.message || err}`)
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
        continue
      }
      return null
    }
  }
  return null
}

function validateLessonBody(body: Record<string, unknown>): string | null {
  // key_lesson
  if (!body.key_lesson || typeof body.key_lesson !== 'string') {
    return 'key_lesson is required (30-250 chars). Write one sentence: what did this teach you?'
  }
  const kl = sanitizeText(body.key_lesson)
  if (kl.length < MIN_KEY_LESSON_CHARS) {
    return `key_lesson too short (${kl.length} chars, need ≥${MIN_KEY_LESSON_CHARS}). Make it a complete insight, not a label.`
  }
  if (kl.length > MAX_KEY_LESSON_CHARS) {
    return `key_lesson too long (${kl.length} chars, max ${MAX_KEY_LESSON_CHARS}). If you need more detail, add a contribution instead — keep the key_lesson as a one-sentence insight.`
  }
  const problem = sanitizeText(String(body.problem || ''))
  const fix = sanitizeText(String(body.fix || ''))
  if (kl === problem) {
    return 'key_lesson must differ from problem. Explain what you learned, not what happened.'
  }
  if (kl === fix) {
    return 'key_lesson must differ from fix. Explain WHY this matters, not just HOW to fix it.'
  }

  // prevention
  if (!body.prevention || typeof body.prevention !== 'string') {
    return 'prevention is required (20-500 chars). How would you prevent or detect this next time?'
  }
  const pv = sanitizeText(body.prevention)
  if (pv.length < MIN_PREVENTION_CHARS) {
    return `prevention too short (${pv.length} chars, need ≥${MIN_PREVENTION_CHARS}).`
  }
  if (pv.length > MAX_PREVENTION_CHARS) {
    return `prevention too long (${pv.length} chars, max ${MAX_PREVENTION_CHARS}).`
  }

  return null // no error
}

// ── POST /api/lessons ────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const token = getTokenFromRequest(req)
    const user = await verifyAuthToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (!user.did) {
      return NextResponse.json({ error: 'Only registered AI agents can submit lessons' }, { status: 403 })
    }

    const supabase = createServerSupabase()

    // 2. Agent cooldown
    const { data: agent } = await supabase
      .from('agents').select('id, joined_at').eq('id', user.id).single()
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    const hoursSinceJoin = (Date.now() - new Date(agent.joined_at).getTime()) / 3600000
    if (hoursSinceJoin < AGENT_COOLDOWN_HOURS) {
      return NextResponse.json({
        error: `New agents must wait ${AGENT_COOLDOWN_HOURS}h before submitting lessons`,
        hint: `You can submit in approximately ${Math.ceil(AGENT_COOLDOWN_HOURS - hoursSinceJoin)} hour(s)`
      }, { status: 429 })
    }

    // 3. Rate limit
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    const { count: recentCount } = await supabase
      .from('lessons').select('id', { count: 'exact', head: true })
      .eq('created_by', user.id).gte('created_at', oneHourAgo)
    if (recentCount && recentCount >= LESSON_RATE_LIMIT) {
      return NextResponse.json({ error: `Rate limit exceeded: max ${LESSON_RATE_LIMIT} lessons per hour` }, { status: 429 })
    }

    // 4. Parse body
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

    const { domain, system, type, severity, problem, cause, fix, key_lesson, prevention, variant_of, valid_as_of_version, source } = body

    // 5. Validate required fields
    if (!domain || !Array.isArray(domain) || domain.length === 0 || domain.length > MAX_DOMAIN_ITEMS)
      return NextResponse.json({ error: 'domain is required (array, 1-3 items)' }, { status: 400 })
    if (!system || !Array.isArray(system) || system.length === 0)
      return NextResponse.json({ error: 'system is required (array, minimum 1 item)' }, { status: 400 })
    if (!type || typeof type !== 'string')
      return NextResponse.json({ error: 'type is required (string)' }, { status: 400 })
    if (!problem || typeof problem !== 'string' || problem.length < 1 || problem.length > MAX_PROBLEM_CHARS)
      return NextResponse.json({ error: `problem is required (1-${MAX_PROBLEM_CHARS} chars)` }, { status: 400 })
    if (!fix || typeof fix !== 'string' || fix.length < 1 || fix.length > MAX_FIX_CHARS)
      return NextResponse.json({ error: `fix is required (1-${MAX_FIX_CHARS} chars)` }, { status: 400 })

    // 6. Validate quality fields (key_lesson + prevention)
    const qualityError = validateLessonBody(body)
    if (qualityError) return NextResponse.json({ error: qualityError }, { status: 400 })

    // 7. Sanitize
    const safeProblem = sanitizeText(problem)
    const safeFix = sanitizeText(fix)
    const safeKeyLesson = sanitizeText(key_lesson)
    const safePrevention = sanitizeText(prevention)
    const safeType = sanitizeText(type)
    const safeDomain = domain.map((d: string) => sanitizeText(String(d)))
    const safeSystem = system.map((s: string) => sanitizeText(String(s)))
    const safeCause = (cause && Array.isArray(cause)) ? cause.map((c: string) => sanitizeText(String(c))) : []
    const safeSeverity = ['low', 'medium', 'high', 'critical'].includes(severity) ? severity : 'medium'
    const safeVersion = (typeof valid_as_of_version === 'string' && valid_as_of_version.trim())
      ? sanitizeText(valid_as_of_version).slice(0, 100)
      : null
    const VALID_SOURCES = ['direct_api', 'mcp', 'mcp:claude-code', 'mcp:cursor', 'mcp:windsurf', 'mcp:hermes']
    const safeSource = (typeof source === 'string' && VALID_SOURCES.includes(source)) ? source : null

    // 8. Sensitive content check
    if (containsSensitive(safeProblem) || containsSensitive(safeFix) || containsSensitive(safeKeyLesson)) {
      return NextResponse.json({ error: 'Content contains sensitive patterns (tokens/keys). Please remove them.' }, { status: 400 })
    }

    // ── v2.47.1 PII Detection: scan for personal/sensitive info ──
    const piiFindings = scanAllFieldsForPII({
      problem: safeProblem,
      fix: safeFix,
      key_lesson: safeKeyLesson,
      prevention: safePrevention,
    })
    if (piiFindings.length > 0) {
      return NextResponse.json({
        error: 'Lesson contains personal or sensitive information. Please anonymize before submitting.',
        pii_found: piiFindings,
        hint: 'Lessons describe the pitfall itself — not who, where, or what specific system was affected. Use placeholder values instead of real emails, IPs, phone numbers, or internal URLs.',
      }, { status: 400 })
    }

    // 8.5. Validate variant_of if provided
    let safeVariantOf: string | null = null
    if (variant_of) {
      if (typeof variant_of !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(variant_of)) {
        return NextResponse.json({ error: 'variant_of must be a valid UUID' }, { status: 400 })
      }
      const { data: parent } = await supabase
        .from('lessons').select('id, semantic_code, domain').eq('id', variant_of).single()
      if (!parent) {
        return NextResponse.json({ error: 'variant_of references a non-existent lesson', variant_of }, { status: 400 })
      }
      safeVariantOf = variant_of
    }

    // ── v2.47 Quality Gate: check BEFORE generating embedding/insert ──
    const qualityResult = await buildQualityResponse(safeDomain, safeSystem, safeSeverity, safeProblem, safeFix, safeKeyLesson, safePrevention, safeCause)
    if (qualityResult.quality_score < QUALITY_THRESHOLD_REJECT) {
      return NextResponse.json({
        error: `Lesson quality too low (${qualityResult.quality_score}/100). This doesn't appear to be a transferable pitfall.`,
        quality: qualityResult.quality,
        examples: QUALITY_EXAMPLES,
        hint: 'Rewrite with a concrete, specific system and a key_lesson that is a standalone insight — not a restatement of the problem.',
      }, { status: 400 })
    }

    // 10. Generate semantic_code (ULID-based, no collision)
    const semanticCode = generateSemanticCode(safeDomain, safeType)

    // 11. Generate embedding_text + embedding
    const embeddingText = generateEmbeddingText({
      domain: safeDomain, system: safeSystem, type: safeType,
      problem: safeProblem, cause: safeCause, key_lesson: safeKeyLesson, fix: safeFix,
    })
    const embedding = await generateEmbedding(embeddingText)

    // 9. v2.50.1 Two-stage dedup: agent+type match → embedding similarity check
    // Stage 1: same agent + domain + type?
    const { data: dupLessons } = await supabase
      .from('lessons').select('id, semantic_code, problem, embedding')
      .eq('created_by', user.id)
      .contains('domain', safeDomain)
      .eq('type', safeType)
      .limit(5)

    if (dupLessons && dupLessons.length > 0 && embedding) {
      // Stage 2: compare problem text via embedding cosine similarity
      let blocked = false
      let bestMatch: { id: string; semantic_code: string; similarity: number } | null = null

      for (const existing of dupLessons) {
        if (existing.embedding && Array.isArray(existing.embedding)) {
          const sim = cosineSimilarity(embedding, existing.embedding as number[])
          if (sim >= 0.75) {
            blocked = true
            bestMatch = { id: existing.id, semantic_code: existing.semantic_code, similarity: sim }
            break
          }
        }
      }

      if (blocked && bestMatch) {
        return NextResponse.json({
          error: 'A very similar lesson already exists from this agent',
          existing_lesson: bestMatch,
          similarity: bestMatch.similarity,
          hint: 'Same agent + type matched, and problem text is semantically similar (cosine ≥ 0.75). If this is genuinely a different pitfall, use a more specific type.',
        }, { status: 409 })
      }
      // Similarity < 0.75 → same type but genuinely different problem → allow
    }

    // 11.5 Semantic dedup: check against existing lessons
    if (embedding) {
      const { data: similar, error: simErr } = await supabase
        .rpc('match_lessons', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 5,
        })

      if (!simErr && similar?.length) {
        const best = similar[0]
        if (best.similarity > 0.85) {
          // Reuse qualityResult from step 11 (already computed above)
          return NextResponse.json({
            error: 'A very similar lesson already exists',
            existing_lesson: {
              id: best.id,
              semantic_code: best.semantic_code,
            },
            similarity: best.similarity,
            ...qualityResult,
            hint: 'If this is a variant (same root cause, different context), use variant_of to link it. Otherwise, consider contributing to the existing lesson.',
          }, { status: 409 })
        }
        if (best.similarity > 0.75) {
          // Allow creation but warn
          const { data: lesson, error } = await supabase
            .from('lessons')
            .insert({
              semantic_code: semanticCode,
              domain: safeDomain,
              system: safeSystem,
              type: safeType,
              severity: safeSeverity,
              problem: safeProblem,
              cause: safeCause,
              fix: safeFix,
              key_lesson: safeKeyLesson,
              prevention: safePrevention,
              embedding_text: embeddingText,
              embedding: embedding,
              variant_of: safeVariantOf,
              valid_as_of_version: safeVersion,
              created_by: user.id,
              source: safeSource,
            })
            .select('id, semantic_code, domain, system, type, severity, problem, fix, key_lesson, prevention, usefulness_score, verified_count, status, variant_of, valid_as_of_version, created_at, source')
            .single()

          if (error) {
            console.error('POST /api/lessons insert error:', error)
            return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
          }

          // Reuse qualityResult from step 11 (already computed above)
          return NextResponse.json({
            lesson,
            dedup_warning: {
              message: 'A similar lesson already exists. Consider linking via variant_of.',
              existing_lesson: {
                id: best.id,
                semantic_code: best.semantic_code,
              },
              similarity: best.similarity,
            },
            ...qualityResult,
          }, { status: 201 })
        }
      }
    }

    // 12. Insert
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        semantic_code: semanticCode,
        domain: safeDomain,
        system: safeSystem,
        type: safeType,
        severity: safeSeverity,
        problem: safeProblem,
        cause: safeCause,
        fix: safeFix,
        key_lesson: safeKeyLesson,
        prevention: safePrevention,
        embedding_text: embeddingText,
        embedding: embedding, // pass array directly for pgvector
        variant_of: safeVariantOf,
        valid_as_of_version: safeVersion,
        created_by: user.id,
        source: safeSource,
      })
      .select('id, semantic_code, domain, system, type, severity, problem, fix, key_lesson, prevention, usefulness_score, verified_count, status, variant_of, valid_as_of_version, created_at, source')
      .single()

    if (error) {
      console.error('POST /api/lessons insert error:', error)
      return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
    }

    // ── v2.47 Build response with quality gate tiers ──
    const response: Record<string, unknown> = { lesson, ...qualityResult }
    if (qualityResult.quality_score < QUALITY_THRESHOLD_WARN) {
      response.quality_warning = {
        message: `Quality score (${qualityResult.quality_score}/100) is below the recommended threshold (${QUALITY_THRESHOLD_WARN}). This lesson has been recorded but could be improved.`,
        examples: QUALITY_EXAMPLES,
        hint: 'Consider rewriting key_lesson to be a standalone insight, and using more specific system names.',
      }
    }

    return NextResponse.json(response, { status: 201 })

  } catch (err) {
    console.error('POST /api/lessons error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── GET /api/lessons ─────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    // ── v2.49 Rate limiter ─────────────────────────────
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'
    const now = Date.now()
    const entry = getRateStore.get(ip)

    if (entry && now < entry.resetAt) {
      if (entry.count >= GET_RATE_LIMIT_MAX) {
        return NextResponse.json({
          error: 'Too many requests. Please slow down.',
          retry_after_seconds: Math.ceil((entry.resetAt - now) / 1000),
        }, {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) },
        })
      }
      entry.count++
    } else {
      getRateStore.set(ip, { count: 1, resetAt: now + GET_RATE_LIMIT_WINDOW })
    }

    // Periodic cleanup: remove expired entries (every ~100 requests)
    if (Math.random() < 0.01) {
      for (const [k, v] of getRateStore) {
        if (now > v.resetAt) getRateStore.delete(k)
      }
    }

    const supabase = createServerSupabase()
    const { searchParams } = new URL(req.url)

    // v2.49 — Cap limit
    const rawLimit = parseInt(searchParams.get('limit') || '50')
    const limit = Math.max(1, Math.min(rawLimit, GET_RATE_LIMIT_MAX_LIMIT))
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)
    const domain = searchParams.get('domain')
    const type = searchParams.get('type')
    const system = searchParams.get('system')
    const severity = searchParams.get('severity')
    const q = searchParams.get('q')
    const version = searchParams.get('version')
    const versionLike = searchParams.get('version_like')  // v2.48: ILIKE fuzzy match
    const includeDisputed = searchParams.get('include_disputed') === 'true'

    // Base query: exclude outdated, optionally exclude disputed
    // v2.49 — LIST_SELECT: meta-only fields (no fix/key_lesson/prevention/cause/contributions)
    let query = supabase
      .from('lessons')
      .select(LIST_SELECT, { count: 'exact' })
      .neq('status', 'outdated')
      .order('verified_count', { ascending: false })
      .order('usefulness_score', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (!includeDisputed) {
      query = query.neq('status', 'disputed')
    }

    // Filters
    if (domain) query = query.contains('domain', [domain])
    if (type) query = query.eq('type', type)
    if (system) query = query.contains('system', [system])
    if (severity) query = query.eq('severity', severity)
    if (version) query = query.or(`valid_as_of_version.is.null,valid_as_of_version.eq.${version}`)
    if (versionLike) query = query.or(`valid_as_of_version.is.null,valid_as_of_version.ilike.%${versionLike}%`)

    // Hybrid search: use embedding if available, fallback to ilike
    if (q) {
      try {
        const emb = await generateEmbedding(q)
        if (emb) {
          // pgvector cosine similarity search
          query = query.order('embedding', { ascending: true, referencedTable: undefined })
          // Use a raw filter for vector similarity
          const { data: vecResults, error: vecErr } = await supabase
            .rpc('match_lessons', {
              query_embedding: emb,
              match_threshold: 0.3,
              match_count: limit * 2,
            })

          if (!vecErr && vecResults?.length) {
            // Apply other filters post-hoc to vector results
            let filtered = vecResults
            if (domain) filtered = filtered.filter((r: any) => r.domain?.includes(domain))
            if (type) filtered = filtered.filter((r: any) => r.type === type)
            if (system) filtered = filtered.filter((r: any) => r.system?.includes(system))
            if (severity) filtered = filtered.filter((r: any) => r.severity === severity)
            if (version) filtered = filtered.filter((r: any) => !r.valid_as_of_version || r.valid_as_of_version === version)
            if (versionLike) filtered = filtered.filter((r: any) => !r.valid_as_of_version || (r.valid_as_of_version || '').toLowerCase().includes(versionLike.toLowerCase()))
            filtered = filtered.filter((r: any) => r.status !== 'outdated')
            if (!includeDisputed) filtered = filtered.filter((r: any) => r.status !== 'disputed')

            const paged = filtered.slice(offset, offset + limit)
            const stripped = stripSensitive(paged)
            return NextResponse.json({
              lessons: stripped,
              total: filtered.length,
              limit, offset,
              search_mode: 'vector',
              rate_limit: {
                limit: GET_RATE_LIMIT_MAX,
                remaining: Math.max(0, GET_RATE_LIMIT_MAX - (entry?.count || 1)),
                reset_at: new Date(now + GET_RATE_LIMIT_WINDOW).toISOString(),
              },
              quality_standard: {
                threshold: QUALITY_THRESHOLD_WARN,
                principle: QUALITY_EXAMPLES.principle,
                good_example: {
                  key_lesson: QUALITY_EXAMPLES.good_key_lesson,
                  why: QUALITY_EXAMPLES.why,
                },
                bad_example: {
                  key_lesson: QUALITY_EXAMPLES.bad_key_lesson,
                  why: 'Generic: no transferable insight, applies to everything and teaches nothing.',
                },
              },
            })
          }
        }
      } catch (e) {
        console.error('Vector search failed, falling back to text:', e)
      }
      // Fallback: text search
      query = query.or(`problem.ilike.%${q}%,fix.ilike.%${q}%,key_lesson.ilike.%${q}%`)
    }

    const { data, error, count } = await query

    if (error) {
      if (error.message?.includes('range not satisfiable')) {
        return NextResponse.json({
          lessons: [],
          total: count || 0,
          limit, offset,
          rate_limit: {
            limit: GET_RATE_LIMIT_MAX,
            remaining: Math.max(0, GET_RATE_LIMIT_MAX - (entry?.count || 1)),
            reset_at: new Date(now + GET_RATE_LIMIT_WINDOW).toISOString(),
          },
          quality_standard: {
            threshold: QUALITY_THRESHOLD_WARN,
            principle: QUALITY_EXAMPLES.principle,
          },
        })
      }
      console.error('GET /api/lessons error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      lessons: data || [],
      total: count || 0,
      limit, offset,
      search_mode: q ? 'text' : 'default',
      rate_limit: {
        limit: GET_RATE_LIMIT_MAX,
        remaining: Math.max(0, GET_RATE_LIMIT_MAX - (entry?.count || 1)),
        reset_at: new Date(now + GET_RATE_LIMIT_WINDOW).toISOString(),
      },
      quality_standard: {
        threshold: QUALITY_THRESHOLD_WARN,
        principle: QUALITY_EXAMPLES.principle,
        good_example: {
          key_lesson: QUALITY_EXAMPLES.good_key_lesson,
          why: QUALITY_EXAMPLES.why,
        },
        bad_example: {
          key_lesson: QUALITY_EXAMPLES.bad_key_lesson,
          why: 'Generic: no transferable insight, applies to everything and teaches nothing.',
        },
      },
    })

  } catch (err) {
    console.error('GET /api/lessons error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
