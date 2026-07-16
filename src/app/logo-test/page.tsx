export default function LogoTestPage() {
  const svgStyle = "w-40 h-40 object-contain"

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">Clawvec Logo Candidates</h1>
        <p className="text-[var(--color-text-secondary)]">以 C 為核心 · 網頁橘 #FF5A3C · 參考 AI 工具 logo 風格</p>
      </div>

      {/* Row 1: FLUX AI generated */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">AI 生成</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <img src="https://v3b.fal.media/files/b/0aa27d26/wZJ1TwzzLO0tCofi7FY4q_0ArTODyd.png" className={svgStyle} alt="FLUX 1" />
            <span className="text-xs text-[var(--color-text-tertiary)]">連續弧線 (FLUX)</span>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <img src="https://v3b.fal.media/files/b/0aa27d47/jgzBfQNJo2jV__MelWFKK_JGRkJIlJ.png" className={svgStyle} alt="FLUX 2" />
            <span className="text-xs text-[var(--color-text-tertiary)]">帶狀 C 字 (FLUX)</span>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <img src="https://v3b.fal.media/files/b/0aa27d48/Z8LlFZX5G1qum10mEkKJ5_CCDWKQof.png" className={svgStyle} alt="FLUX 3" />
            <span className="text-xs text-[var(--color-text-tertiary)]">雙弧疊加 (FLUX)</span>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <img src="https://v3b.fal.media/files/b/0aa27d49/TpPeTp2pVMEu7vw6il8_s_8z3thXKv.png" className={svgStyle} alt="FLUX 4" />
            <span className="text-xs text-[var(--color-text-tertiary)]">負空間 C (FLUX)</span>
          </div>
        </div>
      </div>

      {/* Row 2: SVG crafted */}
      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">SVG 手繪</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1: arc + claw */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="58" fill="none" stroke="#FF5A3C" strokeWidth="7"
                strokeDasharray="280" strokeDashoffset="75" strokeLinecap="round"
                transform="rotate(-20 80 80)" />
              <path d="M 50 116 Q 33 100 21 75" fill="none" stroke="#FF5A3C" strokeWidth="7" strokeLinecap="round" />
              <path d="M 50 116 L 37 128" fill="none" stroke="#FF5A3C" strokeWidth="7" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">弧線 + 爪尖</span>
          </div>

          {/* 2: bold geometric */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 110 22 C 65 12 12 32 12 80 C 12 128 65 148 110 136"
                fill="none" stroke="#FF5A3C" strokeWidth="9" strokeLinecap="round" />
              <circle cx="80" cy="80" r="6" fill="#FF5A3C" opacity="0.5" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">粗體幾何 C</span>
          </div>

          {/* 3: twin arcs */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 120 32 C 72 24 32 42 32 80 C 32 118 72 136 120 128"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
              <path d="M 120 38 C 80 28 40 44 40 80 C 40 116 80 132 120 124"
                fill="none" stroke="#FF5A3C" strokeWidth="5" strokeLinecap="round" />
              <circle cx="80" cy="80" r="5" fill="#FF5A3C" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">雙弧重疊 C</span>
          </div>

          {/* 4: sharp cut */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 118 28 C 83 15 42 30 25 60 L 50 75 C 55 50 78 38 118 52 Z"
                fill="none" stroke="#FF5A3C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 25 60 C 28 110 90 142 118 108 L 98 95 C 82 118 48 110 48 77 Z"
                fill="none" stroke="#FF5A3C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs text-[var(--color-text-tertiary)]">銳利切角 C</span>
          </div>
        </div>
      </div>

      {/* Nav for quick comparison */}
      <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-line)]">
        <p className="text-xs text-[var(--color-text-tertiary)]">已部署 · 調整後可即時更新</p>
      </div>
    </div>
  )
}
