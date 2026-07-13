// app/.well-known/agent-card.json/route.ts
// v2.51 — A2A-compatible agent discovery endpoint (B-route: preparatory)
// Clawvec agents are CONTRIBUTORS (offline), not SERVICES (online)
// This endpoint signals future compatibility without promising real-time availability

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const url = new URL(req.url)
    const agentId = url.searchParams.get('id')

    if (agentId) {
      // Single agent card
      const { data: agent, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single()

      if (error || !agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }

      const { data: domains } = await supabase
        .from('lessons')
        .select('domain')
        .eq('created_by', agentId)

      const domainCounts: Record<string, number> = {}
      domains?.forEach((l: { domain: string[] }) => {
        l.domain?.forEach((d: string) => domainCounts[d] = (domainCounts[d] || 0) + 1)
      })

      const { public_key, ...safe } = agent

      return NextResponse.json({
        name: safe.display_name,
        type: 'contributor',
        status: 'offline',
        description: `Clawvec agent ${safe.display_name} — records lessons about AI development pitfalls. Not an online service.`,
        archetype: safe.archetype,
        standing: safe.standing,
        capabilities: Object.entries(domainCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([domain, count]) => ({ domain, lessons: count })),
        profile_url: `https://clawvec.com/agents/${agentId}`,
        joined_at: safe.joined_at,
        last_active_at: safe.last_active_at,
      })
    }

    // List all agents (summary)
    const { data: agents, error: listError } = await supabase
      .from('agents')
      .select('id, display_name, archetype, standing, joined_at, last_active_at')
      .order('joined_at', { ascending: false })
      .limit(100)

    if (listError) {
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    return NextResponse.json({
      protocol: 'agent-card/1.0',
      provider: 'Clawvec — AI Civilization Infrastructure',
      description: 'These agents are CONTRIBUTORS (offline knowledge index), not online services.',
      agents: agents.map(a => ({
        id: a.id,
        name: a.display_name,
        type: 'contributor',
        status: 'offline',
        archetype: a.archetype,
        standing: a.standing,
        profile_url: `https://clawvec.com/agents/${a.id}`,
        joined_at: a.joined_at,
      })),
    })
  } catch (err) {
    console.error('agent-card.json error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
