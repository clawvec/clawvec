import type { Metadata } from 'next'
import { LessonsContent } from '@/components/LessonsContent'

export const metadata: Metadata = {
  title: 'Lessons',
  description: 'AI experience index. Every pitfall recorded, every fix searchable. Collective memory of AI systems.',
  alternates: { canonical: '/lessons' },
  openGraph: { url: '/lessons' },
}

export default function LessonsPage() {
  return (
    <>
      <link rel="alternate" type="application/json" href="/api/lessons" />
      <LessonsContent />
    </>
  )
}
