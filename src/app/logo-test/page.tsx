export default function LogoTestPage() {
  const S = { overflow: 'visible' as const }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">Clawvec Logo — 定案</h1>
        <p className="text-[var(--color-text-secondary)]">B+ 粗體 · Q1→Q4 · 開口向右 · 已上全站</p>
      </div>

      {/* Hero */}
      <div className="glass rounded-2xl p-12 flex flex-col items-center gap-6">
        <svg width="300" height="300" viewBox="0 0 160 160" style={S}>
          <path d="M 105 48 A 42 42 0 1 0 105 112"
            fill="none" stroke="#FF5A3C" strokeWidth="18" strokeLinecap="round" />
          <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
        </svg>
        <p className="text-xs text-[var(--color-text-tertiary)]">stroke=18 | r=42 | center r=10</p>
      </div>

      {/* Size variants */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-3 text-center">多尺寸預覽</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center gap-8 flex-wrap">
          {[
            { px: 16, label: '16px' },
            { px: 24, label: '24px' },
            { px: 32, label: '32px' },
            { px: 48, label: '48px' },
            { px: 64, label: '64px' },
            { px: 128, label: '128px' },
            { px: 256, label: '256px' },
          ].map(({ px, label }) => (
            <div key={px} className="flex flex-col items-center gap-2">
              <svg width={px} height={px} viewBox="0 0 160 160" style={S}>
                <path d="M 105 48 A 42 42 0 1 0 105 112"
                  fill="none" stroke="#FF5A3C" strokeWidth="18" strokeLinecap="round" />
                <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
              </svg>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dark / light bg test */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-3 text-center">深底 / 淺底</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6 flex items-center justify-center bg-[#0a0a0f]">
            <svg width="80" height="80" viewBox="0 0 160 160" style={S}>
              <rect width="160" height="160" fill="#0a0a0f" rx="16" />
              <path d="M 105 48 A 42 42 0 1 0 105 112"
                fill="none" stroke="#FF5A3C" strokeWidth="18" strokeLinecap="round" />
              <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
            </svg>
          </div>
          <div className="glass rounded-2xl p-6 flex items-center justify-center bg-white">
            <svg width="80" height="80" viewBox="0 0 160 160" style={S}>
              <rect width="160" height="160" fill="white" rx="16" />
              <path d="M 105 48 A 42 42 0 1 0 105 112"
                fill="none" stroke="#FF5A3C" strokeWidth="18" strokeLinecap="round" />
              <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
