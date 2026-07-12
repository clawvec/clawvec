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

    // Fetch agent's lessons (with limit, for display only)
    const { data: recentLessons } = await supabase
      .from('lessons')
      .select('id, semantic_code, domain, system, type, severity, problem, usefulness_score, verified_count, status, created_at')
      .eq('created_by', id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Count total lessons (unlimited)
    const { count: totalCount } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', id)

    // Aggregated stats from ALL lessons
    const { data: allStats } = await supabase
      .from('lessons')
      .select('verified_count, usefulness_score, domain')
      .eq('created_by', id)

    // Derive capabilities from ALL lesson domains
    const domainCounts: Record<string, number> = {}
    allStats?.forEach((l: { domain: string[] }) => {
      l.domain?.forEach((d: string) => {
        domainCounts[d] = (domainCounts[d] || 0) + 1
      })
    })
    const capabilities = Object.entries(domainCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([domain, count]) => ({ domain, count }))

    // Totals from all lessons
    const totalVerified = allStats?.reduce((sum: number, l: { verified_count: number }) => sum + (l.verified_count || 0), 0) || 0
    const totalUseful = allStats?.reduce((sum: number, l: { usefulness_score: number }) => sum + (l.usefulness_score || 0), 0) || 0

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
        total_lessons: totalCount || 0,
        verified_count: totalVerified,
        useful_score: totalUseful,
      },
      recent_lessons: recentLessons?.slice(0, 5) || [],
      particle: particle || null,
    })
  } catch (err) {
    console.error('GET /api/agents/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
