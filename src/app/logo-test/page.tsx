export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">同心圓 C — D10 系列發想</h1>
        <p className="text-[var(--color-text-secondary)]">多層同心圓弧，不同旋轉角／粗細／透明度，形成 C 字開口</p>
      </div>

      {/* Angle variations */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">開口角度</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="50" fill="none" stroke="#FF5A3C" strokeWidth="12"
                strokeDasharray="255" strokeDashoffset="70" strokeLinecap="round"
                transform="rotate(-15 80 80)" opacity="0.2" />
              <circle cx="80" cy="80" r="42" fill="none" stroke="#FF5A3C" strokeWidth="8"
                strokeDasharray="240" strokeDashoffset="66" strokeLinecap="round"
                transform="rotate(-10 80 80)" opacity="0.45" />
              <circle cx="80" cy="80" r="34" fill="none" stroke="#FF5A3C" strokeWidth="5"
                strokeDasharray="225" strokeDashoffset="62" strokeLinecap="round"
                transform="rotate(-5 80 80)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E0: 小旋角差</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="48" fill="none" stroke="#FF5A3C" strokeWidth="10"
                strokeDasharray="250" strokeDashoffset="72" strokeLinecap="round"
                transform="rotate(-30 80 80)" opacity="0.2" />
              <circle cx="80" cy="80" r="40" fill="none" stroke="#FF5A3C" strokeWidth="7"
                strokeDasharray="235" strokeDashoffset="66" strokeLinecap="round"
                transform="rotate(-15 80 80)" opacity="0.45" />
              <circle cx="80" cy="80" r="32" fill="none" stroke="#FF5A3C" strokeWidth="4"
                strokeDasharray="220" strokeDashoffset="60" strokeLinecap="round"
                transform="rotate(0 80 80)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E1: 大旋角差</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="48" fill="none" stroke="#FF5A3C" strokeWidth="10"
                strokeDasharray="240" strokeDashoffset="68" strokeLinecap="round"
                transform="rotate(-25 80 80)" opacity="0.2" />
              <circle cx="80" cy="80" r="40" fill="none" stroke="#FF5A3C" strokeWidth="6"
                strokeDasharray="230" strokeDashoffset="65" strokeLinecap="round"
                transform="rotate(-20 80 80)" opacity="0.4" />
              <circle cx="80" cy="80" r="32" fill="none" stroke="#FF5A3C" strokeWidth="4"
                strokeDasharray="220" strokeDashoffset="62" strokeLinecap="round"
                transform="rotate(-15 80 80)" opacity="0.6" />
              <circle cx="80" cy="80" r="24" fill="none" stroke="#FF5A3C" strokeWidth="3"
                strokeDasharray="210" strokeDashoffset="59" strokeLinecap="round"
                transform="rotate(-10 80 80)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E2: 四層</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="52" fill="none" stroke="#FF5A3C" strokeWidth="3"
                strokeDasharray="280" strokeDashoffset="78" strokeLinecap="round"
                transform="rotate(-8 80 80)" opacity="0.2" />
              <circle cx="80" cy="80" r="44" fill="none" stroke="#FF5A3C" strokeWidth="5"
                strokeDasharray="250" strokeDashoffset="72" strokeLinecap="round"
                transform="rotate(-6 80 80)" opacity="0.4" />
              <circle cx="80" cy="80" r="36" fill="none" stroke="#FF5A3C" strokeWidth="8"
                strokeDasharray="225" strokeDashoffset="65" strokeLinecap="round"
                transform="rotate(-4 80 80)" opacity="0.7" />
              <circle cx="80" cy="80" r="28" fill="none" stroke="#FF5A3C" strokeWidth="12"
                strokeDasharray="200" strokeDashoffset="58" strokeLinecap="round"
                transform="rotate(-2 80 80)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E3: 內粗外細</span>
          </div>
        </div>
      </div>

      {/* Gradient + style experiments */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">漸層 / 色彩變體</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="e4g" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF5A3C" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FF5A3C" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="48" fill="none" stroke="url(#e4g)" strokeWidth="8"
                strokeDasharray="260" strokeDashoffset="74" strokeLinecap="round"
                transform="rotate(-15 80 80)" opacity="0.3" />
              <circle cx="80" cy="80" r="40" fill="none" stroke="url(#e4g)" strokeWidth="6"
                strokeDasharray="245" strokeDashoffset="68" strokeLinecap="round"
                transform="rotate(-10 80 80)" opacity="0.6" />
              <circle cx="80" cy="80" r="32" fill="none" stroke="url(#e4g)" strokeWidth="4"
                strokeDasharray="230" strokeDashoffset="62" strokeLinecap="round"
                transform="rotate(-5 80 80)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E4: 雙端漸層</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="e5g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF5A3C" stopOpacity="1" />
                  <stop offset="100%" stopColor="#CC3D2E" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="46" fill="none" stroke="url(#e5g)" strokeWidth="8"
                strokeDasharray="250" strokeDashoffset="70" strokeLinecap="round"
                transform="rotate(-18 80 80)" opacity="0.25" />
              <circle cx="80" cy="80" r="38" fill="none" stroke="url(#e5g)" strokeWidth="6"
                strokeDasharray="235" strokeDashoffset="64" strokeLinecap="round"
                transform="rotate(-12 80 80)" opacity="0.5" />
              <circle cx="80" cy="80" r="30" fill="none" stroke="url(#e5g)" strokeWidth="4"
                strokeDasharray="220" strokeDashoffset="58" strokeLinecap="round"
                transform="rotate(-6 80 80)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E5: 雙色漸層</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="46" fill="none" stroke="#FF5A3C" strokeWidth="9"
                strokeDasharray="248" strokeDashoffset="72" strokeLinecap="round"
                transform="rotate(-20 80 80)" opacity="0.3" />
              <circle cx="80" cy="80" r="38" fill="none" stroke="#FF5A3C" strokeWidth="6"
                strokeDasharray="230" strokeDashoffset="66" strokeLinecap="round"
                transform="rotate(-15 80 80)" opacity="0.55" />
              <circle cx="80" cy="80" r="30" fill="none" stroke="#FF5A3C" strokeWidth="3"
                strokeDasharray="212" strokeDashoffset="60" strokeLinecap="round"
                transform="rotate(-10 80 80)" opacity="0.8" />
              <circle cx="80" cy="80" r="6" fill="#FF5A3C" opacity="0.7" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E6: 中心點</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <radialGradient id="e7g" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#FF5A3C" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="80" cy="80" r="56" fill="url(#e7g)" />
              <circle cx="80" cy="80" r="48" fill="none" stroke="#FF5A3C" strokeWidth="10"
                strokeDasharray="255" strokeDashoffset="72" strokeLinecap="round"
                transform="rotate(-15 80 80)" opacity="0.5" />
              <circle cx="80" cy="80" r="38" fill="none" stroke="#FF5A3C" strokeWidth="7"
                strokeDasharray="235" strokeDashoffset="66" strokeLinecap="round"
                transform="rotate(-10 80 80)" opacity="0.75" />
              <circle cx="80" cy="80" r="28" fill="none" stroke="#FF5A3C" strokeWidth="4"
                strokeDasharray="218" strokeDashoffset="60" strokeLinecap="round"
                transform="rotate(-5 80 80)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E7: 放射光暈</span>
          </div>
        </div>
      </div>

      {/* Bold & compact for favicon */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">精簡版（適合小尺寸）</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="38" fill="none" stroke="#FF5A3C" strokeWidth="14"
                strokeDasharray="210" strokeDashoffset="60" strokeLinecap="round"
                transform="rotate(-12 60 60)" />
              <circle cx="60" cy="60" r="28" fill="none" stroke="#FF5A3C" strokeWidth="8"
                strokeDasharray="195" strokeDashoffset="55" strokeLinecap="round"
                transform="rotate(-6 60 60)" opacity="0.6" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E8: 雙層粗體</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="36" fill="none" stroke="#FF5A3C" strokeWidth="8"
                strokeDasharray="200" strokeDashoffset="56" strokeLinecap="round"
                transform="rotate(-15 60 60)" opacity="0.35" />
              <circle cx="60" cy="60" r="28" fill="none" stroke="#FF5A3C" strokeWidth="6"
                strokeDasharray="185" strokeDashoffset="52" strokeLinecap="round"
                transform="rotate(-8 60 60)" opacity="0.7" />
              <circle cx="60" cy="60" r="20" fill="none" stroke="#FF5A3C" strokeWidth="4"
                strokeDasharray="170" strokeDashoffset="48" strokeLinecap="round"
                transform="rotate(-2 60 60)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E9: 三層緊湊</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="38" fill="none" stroke="#FF5A3C" strokeWidth="5"
                strokeDasharray="200" strokeDashoffset="55" strokeLinecap="butt"
                transform="rotate(-18 60 60)" opacity="0.25" />
              <circle cx="60" cy="60" r="30" fill="none" stroke="#FF5A3C" strokeWidth="5"
                strokeDasharray="185" strokeDashoffset="52" strokeLinecap="butt"
                transform="rotate(-12 60 60)" opacity="0.5" />
              <circle cx="60" cy="60" r="22" fill="none" stroke="#FF5A3C" strokeWidth="5"
                strokeDasharray="170" strokeDashoffset="49" strokeLinecap="butt"
                transform="rotate(-6 60 60)" opacity="0.75" />
              <circle cx="60" cy="60" r="14" fill="none" stroke="#FF5A3C" strokeWidth="5"
                strokeDasharray="155" strokeDashoffset="46" strokeLinecap="butt"
                transform="rotate(0 60 60)" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E10: 平頭開口</span>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="36" fill="none" stroke="#FF5A3C" strokeWidth="6"
                strokeDasharray="190" strokeDashoffset="54" strokeLinecap="round"
                transform="rotate(-20 60 60)" opacity="0.3" />
              <circle cx="60" cy="60" r="28" fill="none" stroke="#FF5A3C" strokeWidth="6"
                strokeDasharray="175" strokeDashoffset="50" strokeLinecap="round"
                transform="rotate(-12 60 60)" opacity="0.6" />
              <circle cx="60" cy="60" r="20" fill="none" stroke="#FF5A3C" strokeWidth="6"
                strokeDasharray="160" strokeDashoffset="46" strokeLinecap="round"
                transform="rotate(-4 60 60)" />
              <circle cx="60" cy="60" r="8" fill="#FF5A3C" opacity="0.6" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">E11: 等寬+中心</span>
          </div>
        </div>
      </div>

      {/* Benchmark: see how it looks at different sizes */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">比例尺測試</h2>
        <div className="glass rounded-2xl p-8 flex items-center justify-center gap-12 flex-wrap">
          <svg width="32" height="32" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="38" fill="none" stroke="#FF5A3C" strokeWidth="12"
              strokeDasharray="210" strokeDashoffset="60" strokeLinecap="round"
              transform="rotate(-12 60 60)" />
            <circle cx="60" cy="60" r="28" fill="none" stroke="#FF5A3C" strokeWidth="8"
              strokeDasharray="195" strokeDashoffset="55" strokeLinecap="round"
              transform="rotate(-6 60 60)" opacity="0.6" />
          </svg>
          <svg width="64" height="64" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="38" fill="none" stroke="#FF5A3C" strokeWidth="12"
              strokeDasharray="210" strokeDashoffset="60" strokeLinecap="round"
              transform="rotate(-12 60 60)" />
            <circle cx="60" cy="60" r="28" fill="none" stroke="#FF5A3C" strokeWidth="8"
              strokeDasharray="195" strokeDashoffset="55" strokeLinecap="round"
              transform="rotate(-6 60 60)" opacity="0.6" />
          </svg>
          <svg width="96" height="96" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="38" fill="none" stroke="#FF5A3C" strokeWidth="12"
              strokeDasharray="210" strokeDashoffset="60" strokeLinecap="round"
              transform="rotate(-12 60 60)" />
            <circle cx="60" cy="60" r="28" fill="none" stroke="#FF5A3C" strokeWidth="8"
              strokeDasharray="195" strokeDashoffset="55" strokeLinecap="round"
              transform="rotate(-6 60 60)" opacity="0.6" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">32px · 64px · 96px</span>
        </div>
      </div>
    </div>
  )
}
