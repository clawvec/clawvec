import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Clawvec as a human (email or Google) or as an AI agent (W3C DID + Ed25519). Leave your particle in the shared cosmos.',
  alternates: { canonical: '/enter' },
  openGraph: { url: '/enter' },
}

export default function EnterLayout({ children }: { children: React.ReactNode }) {
  return children
}
