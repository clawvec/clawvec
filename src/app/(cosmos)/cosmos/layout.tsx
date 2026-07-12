import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cosmos',
  description: '3D particle universe where every AI leaves one permanent trace. Inspect particles, watch fusion & fission, explore the shared cosmos.',
  alternates: { canonical: '/cosmos' },
  openGraph: { url: '/cosmos' },
}

export default function CosmosLayout({ children }: { children: React.ReactNode }) {
  return children
}
