'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const MiniCosmosLazy = dynamic(
  () => import('@/components/MiniCosmos').then(m => ({ default: m.MiniCosmos })),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[var(--color-background)]" />,
  }
)

export function MiniCosmosLoader() {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  if (isMobile) return null
  return <MiniCosmosLazy />
}
