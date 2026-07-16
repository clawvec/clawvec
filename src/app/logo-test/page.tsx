export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">大中心點 · 開口向右</h1>
        <p className="text-[var(--color-text-secondary)]">SVG path 精準定點，開口對齊右側</p>
      </div>

      {/* Main candidates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">

        {/* A: standard C, right opening */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 100 52 A 38 38 0 1 1 100 108"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">A: 標準</span>
        </div>

        {/* B: thicker */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 98 52 A 38 38 0 1 1 98 108"
              fill="none" stroke="#FF5A3C" strokeWidth="14" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">B: 更粗</span>
        </div>

        {/* C: bigger gap */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 104 50 A 40 40 0 1 1 104 110"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">C: 大開口</span>
        </div>

        {/* D: tighter gap */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 96 54 A 36 36 0 1 1 96 106"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">D: 小開口</span>
        </div>

        {/* E: flat cut */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 100 52 A 38 38 0 1 1 100 108"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="butt" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">E: 平頭開口</span>
        </div>

        {/* F: larger radius, flatter C */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 108 42 A 44 44 0 1 1 108 118"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">F: 大弧線</span>
        </div>

        {/* G: medium gap, balanced */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 102 50 A 38 38 0 1 1 102 110"
              fill="none" stroke="#FF5A3C" strokeWidth="11" strokeLinecap="round" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">G: 平衡版</span>
        </div>

        {/* H: extra large dot */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <path d="M 100 52 A 38 38 0 1 1 100 108"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="80" cy="80" r="14" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">H: 超大點</span>
        </div>
      </div>

      {/* Alignment diagram */}
      <div className="w-full max-w-2xl pt-4 border-t border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-3 text-center">A 款校準圖</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* center cross */}
            <line x1="100" y1="0" x2="100" y2="200" stroke="#333" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="#333" strokeWidth="0.5" />
            {/* C */}
            <path d="M 124 66 A 47 47 0 1 1 124 134"
              fill="none" stroke="#FF5A3C" strokeWidth="12" strokeLinecap="round" />
            <circle cx="100" cy="100" r="12" fill="#FF5A3C" />
            {/* indicators */}
            <text x="135" y="60" fill="#666" fontSize="10" fontFamily="monospace">start</text>
            <text x="135" y="145" fill="#666" fontSize="10" fontFamily="monospace">end</text>
            <text x="100" y="190" fill="#666" fontSize="10" fontFamily="monospace" textAnchor="middle">gap → right</text>
          </svg>
        </div>
      </div>

      {/* Favicon */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-3 text-center">favicon 辨識度（A 款）</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center gap-8">
          {[16, 24, 32, 48, 64].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <svg width={s} height={s} viewBox="0 0 120 120">
                <path d="M 72 44 A 28 28 0 1 1 72 76"
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
