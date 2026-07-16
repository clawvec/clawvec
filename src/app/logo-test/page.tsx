export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">SVG Logo Candidates</h1>
        <p className="text-[var(--color-text-secondary)]">全部 SVG 手繪 · 橘色 #FF5A3C</p>
      </div>

      {/* Target reference: FLUX double-arc */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">🎯 目標：FLUX 雙弧疊加效果</h2>
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <img src="https://v3b.fal.media/files/b/0aa27d48/Z8LlFZX5G1qum10mEkKJ5_CCDWKQof.png"
            className="w-40 h-40 object-contain" alt="Target" />
          <span className="text-xs text-[var(--color-text-tertiary)]">FLUX 原圖（雙弧疊加透視 C）</span>
        </div>
      </div>

      {/* SVG attempts at the double-arc look */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">⬇ SVG 重現嘗試</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* SVG A: twin arcs + center dot */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3 bg-[var(--color-background)]">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF5A3C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF5A3C" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="gb" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A3C" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path d="M 120 32 C 76 24 36 42 36 80 C 36 118 76 136 120 128"
                fill="none" stroke="url(#ga)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 120 36 C 80 28 44 46 44 80 C 44 114 80 132 120 124"
                fill="none" stroke="url(#gb)" strokeWidth="6" strokeLinecap="round" />
              <circle cx="78" cy="78" r="6" fill="#FF5A3C" opacity="0.8" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">A: 雙弧漸層</span>
          </div>

          {/* SVG B: overlapping with mix-blend */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3 bg-[var(--color-background)]">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 115 32 C 78 22 38 36 28 70 L 52 72 C 55 48 72 38 115 54"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 28 70 C 32 110 80 138 115 106 L 98 92 C 78 112 50 104 48 73"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              <circle cx="78" cy="74" r="5" fill="#FF5A3C" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">B: 不對稱開口</span>
          </div>

          {/* SVG C: continuous C with fade */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3 bg-[var(--color-background)]">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A3C" stopOpacity="1" />
                  <stop offset="40%" stopColor="#FF5A3C" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d="M 118 20 C 60 8 8 36 8 80 C 8 124 60 152 118 140"
                fill="none" stroke="url(#gc)" strokeWidth="8" strokeLinecap="round" />
              <circle cx="78" cy="80" r="5" fill="#FF5A3C" opacity="0.7" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">C: 連續漸層 C</span>
          </div>

          {/* SVG D: parallel strokes */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3 bg-[var(--color-background)]">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 22 C 70 12 22 30 22 80 C 22 130 70 148 110 138"
                fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
              <path d="M 110 30 C 70 20 30 36 30 80 C 30 124 70 140 110 130"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" />
              <path d="M 110 38 C 70 28 38 42 38 80 C 38 118 70 132 110 122"
                fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
              <circle cx="78" cy="80" r="4" fill="#FF5A3C" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D: 三層平行弧</span>
          </div>
        </div>
      </div>

      {/* SVG E: mix-blend-mode experiment */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">⬇ 疊加混合模式（mix-blend-mode）</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="relative w-40 h-40">
              <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
                <circle cx="80" cy="80" r="54" fill="none" stroke="#FF5A3C" strokeWidth="16"
                  strokeDasharray="280" strokeDashoffset="82" strokeLinecap="round"
                  transform="rotate(-20 80 80)"
                  style={{ opacity: 0.7, mixBlendMode: 'screen' }} />
              </svg>
              <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
                <circle cx="80" cy="80" r="54" fill="none" stroke="#CC3D2E" strokeWidth="12"
                  strokeDasharray="280" strokeDashoffset="95" strokeLinecap="round"
                  transform="rotate(-10 80 80)"
                  style={{ opacity: 0.9, mixBlendMode: 'screen' }} />
              </svg>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#FF5A3C] -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-xs text-[var(--color-text-tertiary)]">E: screen blend</span>
          </div>

          <div className="glass rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="relative w-40 h-40">
              <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
                <circle cx="80" cy="80" r="54" fill="none" stroke="#FF5A3C" strokeWidth="20"
                  strokeDasharray="275" strokeDashoffset="80" strokeLinecap="round"
                  transform="rotate(-25 80 80)"
                  style={{ opacity: 0.5, mixBlendMode: 'lighten' }} />
              </svg>
              <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
                <circle cx="80" cy="80" r="54" fill="none" stroke="#FF5A3C" strokeWidth="14"
                  strokeDasharray="275" strokeDashoffset="72" strokeLinecap="round"
                  transform="rotate(-5 80 80)"
                  style={{ opacity: 0.9, mixBlendMode: 'lighten' }} />
              </svg>
            </div>
            <span className="text-xs text-[var(--color-text-tertiary)]">F: lighten blend</span>
          </div>
        </div>
      </div>
    </div>
  )
}
