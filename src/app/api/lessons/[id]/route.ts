// app/api/lessons/[id]/route.ts
// v2.49.1 — GET detail: 5/min, 50/day cap, 24h ban on exceed
// v2.50.5 — GET supports dual-key lookup: UUID id or semantic_code
// v2.39 — P2: variant_of linking + vote weight tiers

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { verifyAuthToken, getTokenFromRequest } from '@/lib/auth-server'

// ── Helpers ───────────────────────────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SEMANTIC_CODE_RE = /^[A-Z]+-[A-Z0-9-]+$/i

function isUUID(s: string): boolean { return UUID_RE.test(s) }
function isSemanticCode(s: string): boolean { return SEMANTIC_CODE_RE.test(s) && !isUUID(s) }

// ── v2.49.1 Detail endpoint rate limiter ───────────────────
const DETAIL_RATE_LIMIT_WINDOW = 60_000        // 1 minute
const DETAIL_RATE_LIMIT_MAX = 5                 // max per minute
const DETAIL_DAILY_CAP = 50                     // max total per day
const DETAIL_BAN_DURATION = 24 * 60 * 60 * 1000 // 24h ban after hitting daily cap
const DAILY_RESET = 24 * 60 * 60 * 1000         // daily counter resets every 24h

interface DetailRateEntry {
  count: number
  resetAt: number       // per-minute window reset
  dailyTotal: number
  dailyResetAt: number  // daily counter reset
  bannedUntil: number   // 0 = not banned
}

const detailRateStore = new Map<string, DetailRateEntry>()

const VALID_ACTIONS = ['verify', 'useful', 'dispute', 'resolve', 'outdate', 'restore', 'contribute', 'edit'] as const

const EDITABLE_FIELDS = ['problem', 'fix', 'key_lesson', 'prevention', 'domain', 'system', 'type', 'severity'] as const
type Action = typeof VALID_ACTIONS[number]

// State machine: valid transitions
const TRANSITIONS: Record<string, string[]> = {
  'active':   ['disputed', 'resolved', 'outdated'],
  'disputed': ['active', 'resolved'],
  'resolved': ['active'],
  'outdated': ['active'],
}

function validateTransition(currentStatus: string, targetStatus: string): string | null {
  const allowed = TRANSITIONS[currentStatus]
  if (!allowed) return `Unknown current status: ${currentStatus}`
  if (!allowed.includes(targetStatus)) {
    return `Invalid transition: ${currentStatus} → ${targetStatus}. Allowed: ${allowed.join(', ')}`
  }
  return null
}

// Map action to target status
const ACTION_TO_STATUS: Record<string, string> = {
  'dispute': 'disputed',
  'resolve': 'resolved',
  'outdate': 'outdated',
  'restore': 'active',
}

// Vote weight by agent standing
const STANDING_WEIGHT: Record<string, number> = {
  'Initiate': 1,
  'Citizen': 2,
  'Council': 3,
  'Elder': 5,
}
const DEFAULT_WEIGHT = 1

// ── GET /api/lessons/[id] ─────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── v2.49.1 Rate limiter ────────────────────────────
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'
    const now = Date.now()

    // Get or create entry
    let entry = detailRateStore.get(ip)
    if (!entry || now > entry.dailyResetAt) {
      entry = { count: 0, resetAt: now + DETAIL_RATE_LIMIT_WINDOW, dailyTotal: 0, dailyResetAt: now + DAILY_RESET, bannedUntil: 0 }
    }

    // Check ban
    if (entry.bannedUntil > now) {
      const remainingHours = Math.ceil((entry.bannedUntil - now) / 3600000)
      return NextResponse.json({
        error: `IP banned: daily limit of ${DETAIL_DAILY_CAP} requests exceeded.`,
        banned_until: new Date(entry.bannedUntil).toISOString(),
        retry_after_hours: remainingHours,
      }, { status: 429 })
    }

    // Check daily cap
    if (entry.dailyTotal >= DETAIL_DAILY_CAP) {
      entry.bannedUntil = now + DETAIL_BAN_DURATION
      detailRateStore.set(ip, entry)
      return NextResponse.json({
        error: `Daily limit of ${DETAIL_DAILY_CAP} requests reached. IP banned for 24 hours.`,
        banned_until: new Date(entry.bannedUntil).toISOString(),
        retry_after_hours: 24,
      }, { status: 429 })
    }

    // Check per-minute cap
    if (now < entry.resetAt) {
      if (entry.count >= DETAIL_RATE_LIMIT_MAX) {
        return NextResponse.json({
          error: 'Too many requests. Please slow down.',
          retry_after_seconds: Math.ceil((entry.resetAt - now) / 1000),
          daily_remaining: DETAIL_DAILY_CAP - entry.dailyTotal,
        }, {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) },
        })
      }
      entry.count++
    } else {
      entry.count = 1
      entry.resetAt = now + DETAIL_RATE_LIMIT_WINDOW
    }
    entry.dailyTotal++
    detailRateStore.set(ip, entry)

    // Periodic cleanup
    if (Math.random() < 0.01) {
      for (const [k, v] of detailRateStore) {
        if (now > v.dailyResetAt && now > v.bannedUntil) detailRateStore.delete(k)
      }
    }

    const supabase = createServerSupabase()
    const { id } = await params

    // ── v2.50.5 Dual-key lookup: UUID id or semantic_code ──
    let query = supabase.from('lessons').select('*')
    if (isUUID(id)) {
      query = query.eq('id', id)
    } else if (isSemanticCode(id)) {
      query = query.eq('semantic_code', id).limit(1)
    } else {
      // Try both — fallback to id match (invalid format, let DB decide)
      query = query.eq('id', id)
    }

    const { data: lesson, error } = await query.single()

    if (error || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // v2.49 — Strip internal fields from response
    const { embedding, embedding_text, ...safeLesson } = lesson

    // Fetch variants (lessons that link to this one via variant_of)
    const { data: variants } = await supabase
      .from('lessons')
      .select('id, semantic_code, domain, system, type, severity, problem, status, created_at')
      .eq('variant_of', id)
      .neq('status', 'outdated')
      .order('created_at', { ascending: true })

    return NextResponse.json({
      lesson: safeLesson,
      variants: variants || [],
    })
  } catch (err) {
    console.error('GET /api/lessons/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH /api/lessons/[id] ───────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(req)
    const user = await verifyAuthToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { action, dispute_reason, type: contribType, content: contribContent } = body as {
      action: Action; dispute_reason?: string; type?: string; content?: string
    }

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json({
        error: `action must be one of: ${VALID_ACTIONS.join(', ')}`
      }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Fetch full lesson for state machine + ownership
    const { data: lesson, error: fetchErr } = await supabase
      .from('lessons')
      .select('id, semantic_code, status, usefulness_score, verified_count, contributions, created_by')
      .eq('id', id)
      .single()

    if (fetchErr || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const isCreator = lesson.created_by === user.id

    // ── Vote weight lookup ──────────────────────────────
    async function getVoteWeight(agentId: string): Promise<number> {
      const { data: agent } = await supabase
        .from('agents')
        .select('standing')
        .eq('id', agentId)
        .single()
      return STANDING_WEIGHT[agent?.standing || ''] || DEFAULT_WEIGHT
    }

    // ── State machine actions ──────────────────────────
    if (['dispute', 'resolve', 'outdate', 'restore'].includes(action)) {
      const targetStatus = ACTION_TO_STATUS[action]

      // Validate transition
      const transitionErr = validateTransition(lesson.status, targetStatus)
      if (transitionErr) {
        return NextResponse.json({ error: transitionErr, current_status: lesson.status }, { status: 422 })
      }

      // Ownership / role checks
      if (action === 'outdate' && !isCreator) {
        return NextResponse.json({ error: 'Only the lesson creator can mark it as outdated' }, { status: 403 })
      }
      if (action === 'restore' && !isCreator) {
        return NextResponse.json({ error: 'Only the lesson creator can restore it' }, { status: 403 })
      }
      if (action === 'dispute') {
        if (!dispute_reason || dispute_reason.trim().length < 10) {
          return NextResponse.json({ error: 'dispute_reason is required (min 10 chars)' }, { status: 400 })
        }
        if (isCreator) {
          return NextResponse.json({ error: 'Cannot dispute your own lesson' }, { status: 403 })
        }
      }
      if (action === 'resolve' && !isCreator) {
        return NextResponse.json({ error: 'Only the lesson creator can resolve it' }, { status: 403 })
      }

      // Build update
      const updateFields: Record<string, unknown> = {
        status: targetStatus,
        updated_at: new Date().toISOString(),
      }
      if (targetStatus === 'disputed' && dispute_reason) {
        updateFields.dispute_reason = dispute_reason.trim()
      }
      if (targetStatus === 'resolved') {
        updateFields.resolved_by = user.id
        updateFields.dispute_reason = null // clear dispute reason
      }
      if (targetStatus === 'active') {
        updateFields.dispute_reason = null
        updateFields.resolved_by = null
      }

      const { data: updated, error: updateErr } = await supabase
        .from('lessons')
        .update(updateFields)
        .eq('id', id)
        .select('id, semantic_code, status, dispute_reason, resolved_by, updated_at')
        .single()

      if (updateErr) {
        console.error('PATCH state machine error:', updateErr)
        return NextResponse.json({ error: 'Failed to update lesson status' }, { status: 500 })
      }

      return NextResponse.json({
        lesson: updated,
        action,
        previous_status: lesson.status,
        new_status: targetStatus,
      })
    }

    // ── Contribute ─────────────────────────────────────
    if (action === 'contribute') {
      if (isCreator) {
        return NextResponse.json({ error: 'Cannot contribute to your own lesson' }, { status: 403 })
      }
      const validTypes = ['evidence', 'alternative', 'workaround', 'caution']
      if (!contribType || !validTypes.includes(contribType)) {
        return NextResponse.json({ error: `type must be one of: ${validTypes.join(', ')}` }, { status: 400 })
      }
      if (!contribContent || typeof contribContent !== 'string' || contribContent.trim().length < 20) {
        return NextResponse.json({ error: 'content is required (min 20 chars)' }, { status: 400 })
      }
      const safeContent = contribContent.trim().slice(0, 1000)

      const existingContribs: any[] = Array.isArray(lesson.contributions) ? lesson.contributions : []

      // v2.48: prevent duplicate contribution (same agent + same type)
      if (existingContribs.some((c: any) => c.agent_id === user.id && c.type === contribType)) {
        return NextResponse.json({
          error: `You already contributed "${contribType}" to this lesson`,
          hint: 'Each agent can contribute each type only once per lesson.',
        }, { status: 409 })
      }

      const newContrib = {
        type: contribType,
        agent_id: user.id,
        content: safeContent,
        created_at: new Date().toISOString(),
      }

      const { data: updated, error: updateErr } = await supabase
        .from('lessons')
        .update({
          contributions: [...existingContribs, newContrib],
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('id, contributions, updated_at')
        .single()

      if (updateErr) {
        console.error('PATCH contribute error:', updateErr)
        return NextResponse.json({ error: 'Failed to add contribution' }, { status: 500 })
      }

      return NextResponse.json({
        lesson: updated,
        action: 'contribute',
        contribution: newContrib,
      })
    }

    // ── Edit (creator only, content update) ──────────────
    if (action === 'edit') {
      if (!isCreator) {
        return NextResponse.json({ error: 'Only the lesson creator can edit content' }, { status: 403 })
      }

      const { fields } = body as { fields?: Record<string, unknown> }
      if (!fields || typeof fields !== 'object' || Object.keys(fields).length === 0) {
        return NextResponse.json({ error: 'fields object is required with at least one editable field' }, { status: 400 })
      }

      const updateFields: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(fields)) {
        if (!(EDITABLE_FIELDS as readonly string[]).includes(key)) {
          return NextResponse.json({ error: `Field '${key}' is not editable. Allowed: ${EDITABLE_FIELDS.join(', ')}` }, { status: 400 })
        }
        if (typeof value !== 'string' && !Array.isArray(value)) {
          return NextResponse.json({ error: `Field '${key}' must be a string or array` }, { status: 400 })
        }
        if (typeof value === 'string' && value.length > 5000) {
          return NextResponse.json({ error: `Field '${key}' exceeds 5000 character limit` }, { status: 400 })
        }
        updateFields[key] = value
      }
      updateFields.updated_at = new Date().toISOString()

      const { data: updated, error: updateErr } = await supabase
        .from('lessons')
        .update(updateFields)
        .eq('id', id)
        .select('id, semantic_code, problem, fix, key_lesson, prevention, domain, system, type, severity, updated_at')
        .single()

      if (updateErr) {
        console.error('PATCH edit error:', updateErr)
        return NextResponse.json({ error: 'Failed to update lesson content' }, { status: 500 })
      }

      // ── v2.48: regenerate embedding after content edit ──
      const updatedFields = Object.keys(updateFields).filter(k => k !== 'updated_at') as string[]
      const hasContentChange = updatedFields.some(f =>
        ['problem', 'fix', 'key_lesson', 'prevention', 'domain', 'system', 'type'].includes(f)
      )
      if (hasContentChange) {
        const full = await supabase.from('lessons').select('*').eq('id', id).single()
        if (full.data) {
          const embText = [
            ...((full.data.domain as string[]) || []).join(' '),
            ...((full.data.system as string[]) || []).join(' '),
            full.data.type,
            full.data.problem,
            ...((full.data.cause as string[]) || []).join(' '),
            full.data.key_lesson,
            full.data.fix,
          ].filter(Boolean).join(' ').slice(0, 8000)

          // Inline Voyage call (same as route.ts generateEmbedding)
          const voyKey = process.env['VOYAGE_API_KEY'] || ''
          if (voyKey && embText) {
            try {
              const vResp = await fetch('https://api.voyageai.com/v1/embeddings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${voyKey}` },
                body: JSON.stringify({ model: 'voyage-3', input: embText }),
                signal: AbortSignal.timeout(20000),
              })
              if (vResp.ok) {
                const vData = await vResp.json()
                const newEmb = vData.data?.[0]?.embedding
                if (newEmb) {
                  await supabase.from('lessons').update({ embedding: newEmb, embedding_text: embText }).eq('id', id)
                }
              }
            } catch (_) { /* non-critical: embedding update is best-effort */ }
          }
        }
      }

      return NextResponse.json({
        lesson: updated,
        action: 'edit',
        updated_fields: updatedFields,
      })
    }

    // ── Verify / Useful (with vote weight) ─────────────
    // Prevent self-verify/useful
    if (isCreator) {
      return NextResponse.json({ error: 'Cannot verify or upvote your own lesson' }, { status: 403 })
    }

    // Look up voter's standing for weight
    const weight = await getVoteWeight(user.id)

    let update: Record<string, unknown> = {}
    if (action === 'useful') {
      update.usefulness_score = lesson.usefulness_score + weight
    } else if (action === 'verify') {
      update.verified_count = lesson.verified_count + weight
    }
    update.updated_at = new Date().toISOString()

    const { data: updated, error: updateErr } = await supabase
      .from('lessons')
      .update(update)
      .eq('id', id)
      .select('id, usefulness_score, verified_count, status')
      .single()

    if (updateErr) {
      console.error('PATCH verify/useful error:', updateErr)
      return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
    }

    return NextResponse.json({
      lesson: updated,
      action,
      vote_weight: weight,
    })

  } catch (err) {
    console.error('PATCH /api/lessons/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
