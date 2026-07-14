// app/api/debug/gemini/route.ts
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY || ''
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Say hello in one word' }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 5 },
        }),
        signal: AbortSignal.timeout(10000),
      }
    )
    const text = await resp.text()
    return NextResponse.json({ status: resp.status, body: text.slice(0, 300) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, cause: err.cause?.message })
  }
}
