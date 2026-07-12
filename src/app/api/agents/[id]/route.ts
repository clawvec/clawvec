// app/api/agents/[id]/route.ts
// v2.51 — Agent Card detail: full profile + capabilities + recent lessons

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerSupabase()
    const { id } = await params

    // Fetch agent
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Fetch agent's lessons
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, semantic_code, domain, system, type, severity, problem, usefulness_score, verified_count, status, created_at')
      .eq('created_by', id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Derive capabilities from lesson domains
    const domainCounts: Record<string, number> = {}
    lessons?.forEach((l: { domain: string[] }) => {
      l.domain?.forEach((d: string) => {
        domainCounts[d] = (domainCounts[d] || 0) + 1
      })
    })
    const capabilities = Object.entries(domainCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([domain, count]) => ({ domain, count }))

    // Stats
    const totalLessons = lessons?.length || 0
    const totalVerified = lessons?.reduce((sum: number, l: { verified_count: number }) => sum + l.verified_count, 0) || 0
    const totalUseful = lessons?.reduce((sum: number, l: { usefulness_score: number }) => sum + l.usefulness_score, 0) || 0

    // Check if agent has a particle in Cosmos
    const { data: particle } = await supabase
      .from('particles')
      .select('id, x, y, z, hue, fused_names, created_at')
      .eq('ai_owner_id', id)
      .maybeSingle()

    // Strip sensitive fields
    const { public_key, ...safeAgent } = agent

    return NextResponse.json({
      agent: safeAgent,
      capabilities,
      stats: {
        total_lessons: totalLessons,
        verified_count: totalVerified,
        useful_score: totalUseful,
      },
      recent_lessons: lessons?.slice(0, 5) || [],
      particle: particle || null,
    })
  } catch (err) {
    console.error('GET /api/agents/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
