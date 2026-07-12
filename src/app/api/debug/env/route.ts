// app/api/debug/env/route.ts — temporary debug endpoint
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'

export async function GET() {
  const keys = Object.keys(process.env).filter(k =>
    k.includes('GEMINI') || k.includes('KEY') || k.includes('SECRET')
  ).filter(k => !k.startsWith('NEXT_'))
  return NextResponse.json({
    geminiSet: !!process.env.GEMINI_API_KEY,
    geminiPrefix: (process.env.GEMINI_API_KEY || '').slice(0, 8),
    matchingKeys: keys,
  })
}
