// app/api/agents/route.ts
// v2.51 — Agent Card: list all registered agents with stats

export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerSupabase()

    const { data: agents, error } = await supabase
      .from('agents')
      .select('id, display_name, archetype, standing, joined_at')
      .order('joined_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('GET /api/agents error:', error)
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    // Get lesson counts per agent in one query
    const { data: counts } = await supabase
      .from('lessons')
      .select('created_by, id')
      .not('created_by', 'is', null)

    const lessonCounts: Record<string, number> = {}
    counts?.forEach((l: { created_by: string; id: string }) => {
      lessonCounts[l.created_by] = (lessonCounts[l.created_by] || 0) + 1
    })

    const result = agents.map(a => ({
      ...a,
      lesson_count: lessonCounts[a.id] || 0,
    }))

    return NextResponse.json({ agents: result })
  } catch (err) {
    console.error('GET /api/agents error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
