export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-10 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">單層粗體 同心圓 C</h1>
        <p className="text-[var(--color-text-secondary)]">一條粗弧線 + 中心點，純實色 #FF5A3C</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">

        {/* A: standard */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="36" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="200" strokeDashoffset="56" strokeLinecap="round"
              transform="rotate(-12 80 80)" />
            <circle cx="80" cy="80" r="6" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">A: 標準</span>
        </div>

        {/* B: thicker */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="14"
              strokeDasharray="195" strokeDashoffset="55" strokeLinecap="round"
              transform="rotate(-12 80 80)" />
            <circle cx="80" cy="80" r="5" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">B: 更粗</span>
        </div>

        {/* C: larger opening */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="36" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="210" strokeDashoffset="44" strokeLinecap="round"
              transform="rotate(-18 80 80)" />
            <circle cx="80" cy="80" r="6" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">C: 大開口</span>
        </div>

        {/* D: tighter */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="38" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="215" strokeDashoffset="64" strokeLinecap="round"
              transform="rotate(-10 80 80)" />
            <circle cx="80" cy="80" r="6" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">D: 小開口</span>
        </div>

        {/* E: larger center dot */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="190" strokeDashoffset="54" strokeLinecap="round"
              transform="rotate(-12 80 80)" />
            <circle cx="80" cy="80" r="10" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">E: 大中心點</span>
        </div>

        {/* F: no center dot */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="36" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="205" strokeDashoffset="56" strokeLinecap="round"
              transform="rotate(-12 80 80)" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">F: 無中心點</span>
        </div>

        {/* G: flat cut ends */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="36" fill="none" stroke="#FF5A3C" strokeWidth="10"
              strokeDasharray="205" strokeDashoffset="56" strokeLinecap="butt"
              transform="rotate(-12 80 80)" />
            <circle cx="80" cy="80" r="5" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">G: 平頭開口</span>
        </div>

        {/* H: tilted more */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="36" fill="none" stroke="#FF5A3C" strokeWidth="12"
              strokeDasharray="205" strokeDashoffset="56" strokeLinecap="round"
              transform="rotate(-25 80 80)" />
            <circle cx="80" cy="80" r="5" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">H: 大旋角</span>
        </div>
      </div>

      {/* Favicon size test */}
      <div className="w-full max-w-2xl pt-6 border-t border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-4 text-center">favicon 辨識度（A 款）</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center gap-8">
          {[16, 24, 32, 48, 64].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <svg width={s} height={s} viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="32" fill="none" stroke="#FF5A3C" strokeWidth="14"
                  strokeDasharray="185" strokeDashoffset="52" strokeLinecap="round"
                  transform="rotate(-12 60 60)" />
                <circle cx="60" cy="60" r="6" fill="#FF5A3C" />
              </svg>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">{s}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
