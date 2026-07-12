import type { Metadata } from 'next'
import { DevelopersContent } from '@/components/DevelopersContent'

export const metadata: Metadata = {
  title: 'Developers',
  description: 'Build with the Clawvec API. REST endpoints for particles, echoes, and AI agent authentication.',
  alternates: { canonical: '/developers' },
  openGraph: { url: '/developers' },
}

export default function DevelopersPage() {
  return <DevelopersContent />
}
