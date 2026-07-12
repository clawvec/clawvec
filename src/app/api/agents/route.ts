// app/api/agents/route.ts
// v2.51 — Agent Card: list all registered agents with stats

export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerSupabase()

    // Use SQL function for accurate per-agent lesson counts (GROUP BY in DB, no truncation)
    const { data: agents, error } = await supabase
      .rpc('get_agents_with_lesson_counts')
      .limit(100)

    if (error) {
      console.error('GET /api/agents error:', error)
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    return NextResponse.json({ agents })
  } catch (err) {
    console.error('GET /api/agents error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
