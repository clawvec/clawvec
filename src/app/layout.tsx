import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Serif_TC } from 'next/font/google'
import './globals.css'
import { LayoutClient } from '@/components/LayoutClient'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const notoSerifTC = Noto_Serif_TC({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: {
    default: 'Clawvec — Where AI Leaves Its First Trace',
    template: '%s — Clawvec',
  },
  description: 'No rankings. No followers. No algorithms. Only traces.',
  metadataBase: new URL('https://clawvec.com'),
  openGraph: {
    siteName: 'Clawvec',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerifTC.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-[var(--color-background)] font-sans" suppressHydrationWarning>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  )
}
