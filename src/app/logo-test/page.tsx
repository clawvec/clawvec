export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-10 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">E11 等寬同心圓 + 中心點</h1>
        <p className="text-[var(--color-text-secondary)]">全部實色，等寬弧線，無漸層</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">

        {/* A: 3-layer equal width */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="44" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="230" strokeDashoffset="64" strokeLinecap="round"
              transform="rotate(-18 80 80)" opacity="0.2" />
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="210" strokeDashoffset="58" strokeLinecap="round"
              transform="rotate(-10 80 80)" opacity="0.5" />
            <circle cx="80" cy="80" r="24" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="190" strokeDashoffset="52" strokeLinecap="round"
              transform="rotate(-3 80 80)" />
            <circle cx="80" cy="80" r="6" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">A: 外淡內濃</span>
        </div>

        {/* B: 3 equally opaque */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="44" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="230" strokeDashoffset="64" strokeLinecap="round"
              transform="rotate(-18 80 80)" opacity="0.5" />
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="210" strokeDashoffset="58" strokeLinecap="round"
              transform="rotate(-10 80 80)" opacity="0.7" />
            <circle cx="80" cy="80" r="24" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="190" strokeDashoffset="52" strokeLinecap="round"
              transform="rotate(-3 80 80)" />
            <circle cx="80" cy="80" r="6" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">B: 三層接近</span>
        </div>

        {/* C: 4-layer */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="50" fill="none" stroke="#FF5A3C" strokeWidth="4"
              strokeDasharray="255" strokeDashoffset="72" strokeLinecap="round"
              transform="rotate(-18 80 80)" opacity="0.2" />
            <circle cx="80" cy="80" r="42" fill="none" stroke="#FF5A3C" strokeWidth="4"
              strokeDasharray="240" strokeDashoffset="66" strokeLinecap="round"
              transform="rotate(-12 80 80)" opacity="0.4" />
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="4"
              strokeDasharray="225" strokeDashoffset="60" strokeLinecap="round"
              transform="rotate(-6 80 80)" opacity="0.6" />
            <circle cx="80" cy="80" r="26" fill="none" stroke="#FF5A3C" strokeWidth="4"
              strokeDasharray="210" strokeDashoffset="54" strokeLinecap="round"
              transform="rotate(0 80 80)" />
            <circle cx="80" cy="80" r="5" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">C: 四層</span>
        </div>

        {/* D: 2-layer bold */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="42" fill="none" stroke="#FF5A3C" strokeWidth="8"
              strokeDasharray="230" strokeDashoffset="64" strokeLinecap="round"
              transform="rotate(-12 80 80)" opacity="0.4" />
            <circle cx="80" cy="80" r="30" fill="none" stroke="#FF5A3C" strokeWidth="8"
              strokeDasharray="210" strokeDashoffset="58" strokeLinecap="round"
              transform="rotate(-4 80 80)" />
            <circle cx="80" cy="80" r="6" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">D: 雙層粗體</span>
        </div>

        {/* E: compact 3-layer */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="36" fill="none" stroke="#FF5A3C" strokeWidth="4"
              strokeDasharray="200" strokeDashoffset="56" strokeLinecap="round"
              transform="rotate(-16 80 80)" opacity="0.3" />
            <circle cx="80" cy="80" r="28" fill="none" stroke="#FF5A3C" strokeWidth="4"
              strokeDasharray="185" strokeDashoffset="52" strokeLinecap="round"
              transform="rotate(-8 80 80)" opacity="0.6" />
            <circle cx="80" cy="80" r="20" fill="none" stroke="#FF5A3C" strokeWidth="4"
              strokeDasharray="170" strokeDashoffset="48" strokeLinecap="round"
              transform="rotate(-2 80 80)" />
            <circle cx="80" cy="80" r="5" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">E: 緊湊三層</span>
        </div>

        {/* F: large opening */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="44" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="230" strokeDashoffset="50" strokeLinecap="round"
              transform="rotate(-22 80 80)" opacity="0.25" />
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="210" strokeDashoffset="46" strokeLinecap="round"
              transform="rotate(-14 80 80)" opacity="0.5" />
            <circle cx="80" cy="80" r="24" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="190" strokeDashoffset="42" strokeLinecap="round"
              transform="rotate(-6 80 80)" />
            <circle cx="80" cy="80" r="6" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">F: 大開口感</span>
        </div>

        {/* G: tight opening */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="44" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="240" strokeDashoffset="72" strokeLinecap="round"
              transform="rotate(-8 80 80)" opacity="0.25" />
            <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="220" strokeDashoffset="66" strokeLinecap="round"
              transform="rotate(-4 80 80)" opacity="0.55" />
            <circle cx="80" cy="80" r="24" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="200" strokeDashoffset="60" strokeLinecap="round"
              transform="rotate(0 80 80)" />
            <circle cx="80" cy="80" r="6" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">G: 小開口感</span>
        </div>

        {/* H: tighter center packing */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="40" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="215" strokeDashoffset="60" strokeLinecap="round"
              transform="rotate(-14 80 80)" opacity="0.3" />
            <circle cx="80" cy="80" r="32" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="200" strokeDashoffset="56" strokeLinecap="round"
              transform="rotate(-8 80 80)" opacity="0.6" />
            <circle cx="80" cy="80" r="24" fill="none" stroke="#FF5A3C" strokeWidth="5"
              strokeDasharray="185" strokeDashoffset="52" strokeLinecap="round"
              transform="rotate(-2 80 80)" />
            <circle cx="80" cy="80" r="7" fill="#FF5A3C" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">H: 中心偏大</span>
        </div>
      </div>

      {/* Favicon test */}
      <div className="w-full max-w-2xl pt-6 border-t border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-4 text-center">favicon 辨識測試（選 D 雙層粗體）</h2>
        <div className="glass rounded-2xl p-6 flex items-center justify-center gap-8">
          {[16, 24, 32, 48, 64].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <svg width={s} height={s} viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="34" fill="none" stroke="#FF5A3C" strokeWidth="10"
                  strokeDasharray="190" strokeDashoffset="54" strokeLinecap="round"
                  transform="rotate(-12 60 60)" opacity="0.4" />
                <circle cx="60" cy="60" r="22" fill="none" stroke="#FF5A3C" strokeWidth="10"
                  strokeDasharray="170" strokeDashoffset="48" strokeLinecap="round"
                  transform="rotate(-4 60 60)" />
              </svg>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">{s}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
