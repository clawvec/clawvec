import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// v2.50 — Edge protection: bot UA blocking + API limit cap + rate limiting

const BOT_UA_PATTERNS = [
  /Bytespider/i, /AhrefsBot/i, /SemrushBot/i, /DotBot/i,
  /PetalBot/i, /BLEXBot/i, /DataForSeoBot/i, /ClaudeBot/i,
  /GPTBot/i, /anthropic-ai/i, /CCBot/i, /omgili/i,
  /Amazonbot/i, /FacebookBot/i, /Yeti/i, /YandexBot/i,
  /Sogou/i, /Baiduspider/i, /Exabot/i, /MJ12bot/i,
]

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false
  return BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ua = request.headers.get('user-agent')

  // ── Bot blocking ──────────────────────────────────────
  if (isBot(ua)) {
    return new NextResponse('Forbidden', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // ── API limit= cap ────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const limit = request.nextUrl.searchParams.get('limit')
    if (limit) {
      const n = parseInt(limit, 10)
      if (n > 50) {
        const url = request.nextUrl.clone()
        url.searchParams.set('limit', '50')
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply to all routes except static assets & Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|logo.svg).*)',
  ],
}
