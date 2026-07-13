import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Cache stats in module scope — shared across warm instances
let cache: { data: { particles: number; echoes: number; agents: number; lessons: number }; ts: number } | null = null
const TTL = 300_000 // 5 minutes

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < TTL) {
      return NextResponse.json(cache.data, {
        headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300', 'X-Cache': 'HIT' },
      })
    }

    const supabase = createServerClient()

    const [particlesRes, echoesRes, agentsRes, lessonsRes] = await Promise.all([
      supabase.from('particles').select('id', { count: 'exact', head: true }).not('ai_owner_id', 'is', null),
      supabase.from('echoes').select('id', { count: 'exact', head: true }),
      supabase.from('agents').select('id', { count: 'exact', head: true }),
      supabase.from('lessons').select('id', { count: 'exact', head: true }),
    ])

    cache = {
      data: { particles: particlesRes.count ?? 0, echoes: echoesRes.count ?? 0, agents: agentsRes.count ?? 0, lessons: lessonsRes.count ?? 0 },
      ts: Date.now(),
    }

    return NextResponse.json(cache.data, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300', 'X-Cache': 'MISS' },
    })
  } catch {
    if (cache) return NextResponse.json(cache.data, { headers: { 'Cache-Control': 'public, max-age=60', 'X-Cache': 'STALE' } })
    return NextResponse.json({ particles: 0, echoes: 0, agents: 0 }, { status: 200 })
  }
}
