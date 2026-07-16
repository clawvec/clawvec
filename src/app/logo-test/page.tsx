export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">大中心點 · 開口向右 · 置中</h1>
        <p className="text-[var(--color-text-secondary)]">圓心右移 + viewBox padding，左側不裁切</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">

        {/* A */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="-20 -20 200 200">
            <path d="M 50 50 A 40 40 0 1 0 50 110"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">A: 標準</span>
        </div>

        {/* B: thicker */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="-20 -20 200 200">
            <path d="M 48 50 A 40 40 0 1 0 48 110"
              fill="none" stroke="#FF5A3C" strokeWidth="14" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">B: 更粗</span>
        </div>

        {/* C: wider gap */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="-20 -20 200 200">
            <path d="M 52 47 A 42 42 0 1 0 52 113"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">C: 寬開口</span>
        </div>

        {/* D: tight gap */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="-20 -20 200 200">
            <path d="M 48 54 A 36 36 0 1 0 48 106"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">D: 小開口</span>
        </div>

        {/* E: flat cut */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="-20 -20 200 200">
            <path d="M 50 50 A 40 40 0 1 0 50 110"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="butt" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">E: 平頭開口</span>
        </div>

        {/* F: larger sweep */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="-20 -20 200 200">
            <path d="M 44 46 A 44 44 0 1 0 44 114"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">F: 大圓弧</span>
        </div>

        {/* G: balanced */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="-20 -20 200 200">
            <path d="M 50 48 A 40 40 0 1 0 50 112"
              fill="none" stroke="#FF5A3C" strokeWidth="11" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">G: 平衡版</span>
        </div>

        {/* H: huge center */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="-20 -20 200 200">
            <path d="M 50 50 A 40 40 0 1 0 50 110"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="14" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">H: 超大點</span>
        </div>
      </div>

      {/* Alignment verification */}
      <div className="w-full max-w-2xl pt-4 border-t border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-3 text-center">A 款校準</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center">
          <svg width="200" height="200" viewBox="-20 -20 240 240">
            <line x1="100" y1="0" x2="100" y2="200" stroke="#333" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="#333" strokeWidth="0.5" />
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="#222" strokeWidth="1" strokeDasharray="4" />
            <path d="M 62 62 A 50 50 0 1 0 62 138"
              fill="none" stroke="#FF5A3C" strokeWidth="12" strokeLinecap="round" />
            <circle cx="100" cy="100" r="12" fill="#FF5A3C" />
            <text x="52" y="55" fill="#0f0" fontSize="10" fontFamily="monospace">start</text>
            <text x="52" y="152" fill="#0f0" fontSize="10" fontFamily="monospace">end</text>
            <text x="155" y="100" fill="#00d4ff" fontSize="11" fontFamily="monospace">← opening</text>
          </svg>
        </div>
      </div>

      {/* Favicon */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-3 text-center">favicon</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center gap-8">
          {[16, 24, 32, 48, 64].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <svg width={s} height={s} viewBox="-10 -10 140 140">
                <path d="M 38 42 A 28 28 0 1 0 38 78"
                  fill="none" stroke="#FF5A3C" strokeWidth="12" strokeLinecap="round" />
                <circle cx="60" cy="60" r="8" fill="#FF5A3C" />
              </svg>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">{s}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
