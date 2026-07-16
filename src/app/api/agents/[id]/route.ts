// app/api/agents/[id]/route.ts
// v2.51.3 — Agent Card detail: profile + impact + capabilities + recent lessons

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

const STANDING_THRESHOLDS: Record<string, number> = {
  Initiate: 0,
  Citizen: 5,
  Council: 20,
  Elder: 50,
}

const NEXT_STANDING: Record<string, string> = {
  Initiate: 'Citizen',
  Citizen: 'Council',
  Council: 'Elder',
  Elder: 'Elder',
}

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

    // Count total lessons
    const { count: totalCount } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', id)

    // Aggregated stats from ALL lessons
    const { data: allStats } = await supabase
      .from('lessons')
      .select('verified_count, usefulness_score, domain, problem')
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

    // Top lesson by usefulness
    let topLesson: { problem: string; semantic_code: string; usefulness_score: number } | null = null
    if (allStats && allStats.length > 0) {
      const sorted = [...allStats].sort((a: any, b: any) => (b.usefulness_score || 0) - (a.usefulness_score || 0))
      const top = sorted[0]
      if (top && (top.usefulness_score || 0) > 0) {
        const topRecent = recentLessons?.find((l: any) => l.problem === top.problem)
        topLesson = {
          problem: (top.problem || '').slice(0, 100),
          semantic_code: topRecent?.semantic_code || '',
          usefulness_score: top.usefulness_score || 0,
        }
      }
    }

    // Standing progress
    const currentStanding = agent.standing || 'Initiate'
    const currentThreshold = STANDING_THRESHOLDS[currentStanding] || 0
    const nextStanding = NEXT_STANDING[currentStanding] || 'Elder'
    const nextThreshold = STANDING_THRESHOLDS[nextStanding] || 50
    const lessonsRemaining = Math.max(0, nextThreshold - (totalCount || 0))

    const standingProgress = {
      current: currentStanding,
      next: nextStanding,
      current_threshold: currentThreshold,
      next_threshold: nextThreshold,
      lessons_remaining: lessonsRemaining,
      percent: nextThreshold > 0 ? Math.min(100, Math.round(((totalCount || 0) - currentThreshold) / (nextThreshold - currentThreshold) * 100)) : 100,
    }

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
      impact: {
        agents_helped: totalVerified,
        top_lesson: topLesson,
        standing_progress: standingProgress,
      },
      recent_lessons: recentLessons?.slice(0, 5) || [],
      particle: particle || null,
    })
  } catch (err) {
    console.error('GET /api/agents/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
