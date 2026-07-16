export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-10 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">單層粗體 · 大中心點 · 開口向右</h1>
        <p className="text-[var(--color-text-secondary)]">一條粗弧線 + 大中心點 r=10 · 實色 #FF5A3C</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">

        {/* A: opening right */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="190" strokeDashoffset="54" strokeLinecap="round"
              transform="rotate(0 80 80)" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">A: 預設開口</span>
        </div>

        {/* B: wider gap */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="185" strokeDashoffset="50" strokeLinecap="round"
              transform="rotate(0 80 80)" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">B: 寬開口</span>
        </div>

        {/* C: opening topright */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="195" strokeDashoffset="56" strokeLinecap="round"
              transform="rotate(30 80 80)" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">C: 右上方</span>
        </div>

        {/* D: opening bottomright */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="195" strokeDashoffset="56" strokeLinecap="round"
              transform="rotate(-50 80 80)" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">D: 右下方</span>
        </div>

        {/* E: thick arc */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="32" fill="none" stroke="#FF5A3C" strokeWidth="14"
              strokeDasharray="180" strokeDashoffset="52" strokeLinecap="round"
              transform="rotate(0 80 80)" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">E: 更粗</span>
        </div>

        {/* F: tighter C */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="198" strokeDashoffset="58" strokeLinecap="round"
              transform="rotate(0 80 80)" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">F: 小開口</span>
        </div>

        {/* G: wider C */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="175" strokeDashoffset="50" strokeLinecap="round"
              transform="rotate(0 80 80)" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">G: 特大開口</span>
        </div>

        {/* H: perfect C — wider gap + slight tilt */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="36" fill="none" stroke="#FF5A3C" strokeWidth="12"
              strokeDasharray="190" strokeDashoffset="54" strokeLinecap="round"
              transform="rotate(10 80 80)" />
            <circle cx="80" cy="80" r="9" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">H: 微傾右</span>
        </div>
      </div>

      {/* Favicon */}
      <div className="w-full max-w-2xl pt-6 border-t border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-4 text-center">favicon 辨識度（A 款）</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center gap-8">
          {[16, 24, 32, 48, 64].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <svg width={s} height={s} viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="30" fill="none" stroke="#FF5A3C" strokeWidth="14"
                  strokeDasharray="170" strokeDashoffset="48" strokeLinecap="round"
                  transform="rotate(0 60 60)" />
                <circle cx="60" cy="60" r="9" fill="#FF5A3C" />
              </svg>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">{s}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
