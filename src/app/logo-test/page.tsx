export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">三層平行弧 — D 系列發想</h1>
        <p className="text-[var(--color-text-secondary)]">基礎方向：3 條弧線平行疊加形成 C，透明層次</p>
      </div>

      {/* D series — basic */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">基礎變體</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 22 C 70 12 22 30 22 80 C 22 130 70 148 110 138"
                fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" opacity="0.25" />
              <path d="M 110 30 C 70 20 30 36 30 80 C 30 124 70 140 110 130"
                fill="none" stroke="#FF5A3C" strokeWidth="6" strokeLinecap="round" />
              <path d="M 110 38 C 70 28 38 42 38 80 C 38 118 70 132 110 122"
                fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D0: 三層均勻</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 20 C 70 8 20 28 20 80 C 20 132 70 152 110 140"
                fill="none" stroke="#FF5A3C" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
              <path d="M 110 28 C 70 18 26 36 26 80 C 26 124 70 142 110 132"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
              <path d="M 110 36 C 70 26 34 42 34 80 C 34 118 70 134 110 124"
                fill="none" stroke="#FF5A3C" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D1: 內濃外淡</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 28 C 72 14 26 30 26 80 C 26 130 72 146 110 132"
                fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
              <path d="M 110 36 C 72 24 34 40 34 80 C 34 120 72 136 110 122"
                fill="none" stroke="#FF5A3C" strokeWidth="6" strokeLinecap="round" opacity="0.45" />
              <path d="M 110 44 C 72 36 42 48 42 80 C 42 112 72 128 110 114"
                fill="none" stroke="#FF5A3C" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D2: 外粗內細</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="d3g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF5A3C" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d="M 110 22 C 70 10 20 28 20 80 C 20 132 70 150 110 138"
                fill="none" stroke="url(#d3g)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 110 30 C 70 20 30 36 30 80 C 30 124 70 140 110 130"
                fill="none" stroke="url(#d3g)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 110 38 C 70 30 40 44 40 80 C 40 116 70 130 110 122"
                fill="none" stroke="url(#d3g)" strokeWidth="7" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D3: 漸層 fade</span>
          </div>
        </div>
      </div>

      {/* D series — with claw/angle */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">加爪尖／角度</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 20 C 70 8 20 28 20 80 C 20 132 70 152 110 140"
                fill="none" stroke="#FF5A3C" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
              <path d="M 110 28 C 70 18 28 36 28 80 C 28 124 70 142 110 132"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
              <path d="M 110 36 C 70 28 36 44 36 80 C 36 116 70 132 110 122"
                fill="none" stroke="#FF5A3C" strokeWidth="7" strokeLinecap="round" />
              {/* claw tip at opening */}
              <path d="M 34 42 L 22 36" fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" />
              <path d="M 36 46 L 24 44" fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D4: 爪尖上緣</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 20 C 70 8 20 28 20 80 C 20 132 70 152 110 140"
                fill="none" stroke="#FF5A3C" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
              <path d="M 110 28 C 70 18 28 36 28 80 C 28 124 70 142 110 132"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
              <path d="M 110 36 C 70 28 36 44 36 80 C 36 116 70 132 110 122"
                fill="none" stroke="#FF5A3C" strokeWidth="7" strokeLinecap="round" />
              {/* claw at bottom opening */}
              <path d="M 110 124 L 126 130" fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" />
              <path d="M 110 118 L 124 120" fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D5: 爪尖下緣</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 20 C 70 8 20 28 20 80 C 20 132 70 152 110 140"
                fill="none" stroke="#FF5A3C" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
              <path d="M 110 28 C 70 18 28 36 28 80 C 28 124 70 142 110 132"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
              <path d="M 110 36 C 70 28 36 44 36 80 C 36 116 70 132 110 122"
                fill="none" stroke="#FF5A3C" strokeWidth="7" strokeLinecap="round" />
              {/* sharp angle cut at upper opening instead of claw */}
              <path d="M 34 44 L 24 36 L 36 38" fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D6: 銳利開口</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="d7g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#CC3D2E" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FF5A3C" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path d="M 110 20 C 70 10 24 28 24 80 C 24 132 70 150 110 138"
                fill="none" stroke="url(#d7g)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 110 28 C 70 20 32 36 32 80 C 32 124 70 140 110 130"
                fill="none" stroke="url(#d7g)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 110 36 C 70 30 40 44 40 80 C 40 116 70 130 110 122"
                fill="none" stroke="url(#d7g)" strokeWidth="7" strokeLinecap="round" />
              <path d="M 36 42 L 22 32" fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D7: 漸層+爪尖</span>
          </div>
        </div>
      </div>

      {/* D series — compressed / bold variations */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">壓縮版 / 粗體</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 34 C 78 20 40 32 40 80 C 40 128 78 140 110 126"
                fill="none" stroke="#FF5A3C" strokeWidth="14" strokeLinecap="round" />
              <path d="M 110 42 C 78 32 48 42 48 80 C 48 118 78 130 110 116"
                fill="none" stroke="#FF5A3C" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
              <path d="M 110 50 C 78 44 56 52 56 80 C 56 108 78 118 110 106"
                fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" opacity="0.25" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D8: 壓縮粗體</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 20 C 70 8 20 28 20 80 C 20 132 70 152 110 140"
                fill="none" stroke="#FF5A3C" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
              <path d="M 110 30 C 70 18 30 36 30 80 C 30 124 70 142 110 130"
                fill="none" stroke="#FF5A3C" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              <path d="M 110 40 C 70 30 40 44 40 80 C 40 116 70 130 110 120"
                fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D9: 寬間距三層</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="d10g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A3C" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="48" fill="none" stroke="url(#d10g)" strokeWidth="12"
                strokeDasharray="250" strokeDashoffset="72" strokeLinecap="round"
                transform="rotate(-15 80 80)" opacity="0.2" />
              <circle cx="80" cy="80" r="42" fill="none" stroke="url(#d10g)" strokeWidth="8"
                strokeDasharray="240" strokeDashoffset="68" strokeLinecap="round"
                transform="rotate(-10 80 80)" opacity="0.4" />
              <circle cx="80" cy="80" r="36" fill="none" stroke="url(#d10g)" strokeWidth="5"
                strokeDasharray="230" strokeDashoffset="64" strokeLinecap="round"
                transform="rotate(-5 80 80)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D10: 同心圓 C</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 25 C 72 12 28 28 28 80 C 28 132 72 148 110 135"
                fill="none" stroke="#FF5A3C" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
              <path d="M 110 33 C 72 22 36 36 36 80 C 36 124 72 138 110 127"
                fill="none" stroke="#FF5A3C" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
              <path d="M 110 41 C 72 32 44 44 44 80 C 44 116 72 128 110 119"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" />
              <path d="M 44 44 L 32 32" fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" />
              <path d="M 110 121 L 128 130" fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
              <circle cx="82" cy="80" r="5" fill="#FF5A3C" opacity="0.8" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">D11: 雙爪+中心點</span>
          </div>
        </div>
      </div>
    </div>
  )
}
