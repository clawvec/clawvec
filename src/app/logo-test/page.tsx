export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">大中心點 · 開口向右</h1>
        <p className="text-[var(--color-text-secondary)]">start 第一象限(右上)，sweep 順時針走右側，不碰左邊</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">

        {/* A: standard */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 110 50 A 40 40 0 1 1 110 110"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">A: 標準</span>
        </div>

        {/* B: thicker */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 108 50 A 40 40 0 1 1 108 110"
              fill="none" stroke="#FF5A3C" strokeWidth="14" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">B: 更粗</span>
        </div>

        {/* C: wider opening */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 113 48 A 42 42 0 1 1 113 112"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">C: 寬開口</span>
        </div>

        {/* D: tight opening */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 106 54 A 36 36 0 1 1 106 106"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">D: 小開口</span>
        </div>

        {/* E: flat */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 110 50 A 40 40 0 1 1 110 110"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="butt" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">E: 平頭</span>
        </div>

        {/* F: bigger radius */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 116 44 A 48 48 0 1 1 116 116"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">F: 大圓弧</span>
        </div>

        {/* G: balanced */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 110 48 A 40 40 0 1 1 110 112"
              fill="none" stroke="#FF5A3C" strokeWidth="11" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">G: 平衡</span>
        </div>

        {/* H: huge dot */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 110 50 A 40 40 0 1 1 110 110"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="14" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">H: 大點</span>
        </div>
      </div>

      {/* Diagram */}
      <div className="w-full max-w-2xl pt-4 border-t border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-3 text-center">A 款校準</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <line x1="100" y1="0" x2="100" y2="200" stroke="#333" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="#333" strokeWidth="0.5" />
            <path d="M 138 62 A 50 50 0 1 1 138 138"
              fill="none" stroke="#FF5A3C" strokeWidth="12" strokeLinecap="round" />
            <circle cx="100" cy="100" r="12" fill="#FF5A3C" />
            <text x="145" y="55" fill="#0f0" fontSize="10" fontFamily="monospace">start</text>
            <text x="145" y="155" fill="#0f0" fontSize="10" fontFamily="monospace">end</text>
          </svg>
        </div>
      </div>

      {/* Favicon */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-3 text-center">favicon</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center gap-8">
          {[16, 24, 32, 48, 64].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <svg width={s} height={s} viewBox="0 0 120 120">
                <path d="M 82 42 A 28 28 0 1 1 82 78"
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
