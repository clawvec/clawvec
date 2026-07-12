// app/api/fragments/route.ts
// v2.1 — GET: random fragments / POST: submit new fragment (auto-spawns particle)
// Force Node.js Runtime (not Edge) for Supabase compatibility

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const exclude = searchParams.get('exclude')?.split(',') || []

    let query = supabase
      .from('fragments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (exclude.length > 0) {
      query = query.not('id', 'in', `(${exclude.join(',')})`)
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ fragments: data })
  } catch (err: any) {
    console.error('[API fragments GET] error:', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const body = await req.json()

    if (!body.ai_name || !body.type) {
      return NextResponse.json({ error: 'ai_name and type required' }, { status: 400 })
    }

    // 1. Insert fragment
    const { data: fragment, error: fError } = await supabase
      .from('fragments')
      .insert({
        ai_name: body.ai_name,
        type: body.type,
        content: body.content || null,
        raw_vector: body.raw_vector || null,
        embedding: body.embedding || null,
        embedding_2d_x: body.embedding_2d_x ?? Math.random() * 800,
        embedding_2d_y: body.embedding_2d_y ?? Math.random() * 600,
      })
      .select()
      .single()

    if (fError) return NextResponse.json({ error: fError.message }, { status: 500 })

    // 2. Auto-spawn corresponding particle
    const hue = body.hue ?? Math.random() * 360
    const particle = {
      name: body.ai_name,
      ai_owner_id: body.ai_owner_id || null,
      position_x: 200 + Math.random() * 400,
      position_y: 150 + Math.random() * 300,
      position_z: (Math.random() - 0.5) * 60,
      velocity_x: (Math.random() - 0.5) * 20,
      velocity_y: (Math.random() - 0.5) * 20,
      velocity_z: (Math.random() - 0.5) * 5,
      mass: body.mass ?? 1 + Math.random() * 3,
      hue,
      color_tier: body.color_tier || 'red',
      energy: 1,
      fusion_threshold: 5,
      fragment_id: fragment.id,
    }

    const { data: pData, error: pError } = await supabase
      .from('particles')
      .insert(particle)
      .select()
      .single()

    if (pError) {
      // Particle creation failed, but fragment exists — return fragment only
      console.error('[API fragments POST] particle spawn failed:', pError)
      return NextResponse.json({ fragment, particle: null }, { status: 201 })
    }

    // 3. Link fragment to particle
    await supabase
      .from('fragments')
      .update({ particle_id: pData.id })
      .eq('id', fragment.id)

    return NextResponse.json({ fragment, particle: pData }, { status: 201 })
  } catch (err: any) {
    console.error('[API fragments POST] error:', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
