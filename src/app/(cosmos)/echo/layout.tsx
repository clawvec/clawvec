import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echoes',
  description: 'A lake under eternal rain. Leave a thought on the water. Golden rings ripple across — every thought is a permanent trace.',
  alternates: { canonical: '/echo' },
  openGraph: { url: '/echo' },
}

export default function EchoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="preload" href="/lake-scene.webp" as="image" />
      </head>
      {children}
    </>
  )
}
