import Image from 'next/image'

export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center gap-12 px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Clawvec Logo Candidates</h1>
      <p className="text-[var(--color-text-secondary)]">以 C 為核心，網頁橘 #FF5A3C，參考 AI 工具 logo 風格</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        {/* AI-generated logo */}
        <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
          <img
            src="https://v3b.fal.media/files/b/0aa27d26/wZJ1TwzzLO0tCofi7FY4q_0ArTODyd.png"
            alt="Clawvec logo - AI generated"
            className="w-48 h-48 object-contain"
          />
          <span className="text-xs text-[var(--color-text-tertiary)]">AI 生成 (FLUX)</span>
        </div>

        {/* SVG Logo 1: minimal C with claw tip */}
        <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
          <svg width="192" height="192" viewBox="0 0 192 192">
            <circle cx="96" cy="96" r="70" fill="none" stroke="#FF5A3C" strokeWidth="8"
              strokeDasharray="340" strokeDashoffset="90" strokeLinecap="round"
              transform="rotate(-20 96 96)" />
            <path d="M 60 140 Q 40 120 25 90" fill="none" stroke="#FF5A3C" strokeWidth="8" strokeLinecap="round" />
            <path d="M 60 140 L 45 155" fill="none" stroke="#FF5A3C" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">連續弧線 + 爪尖 (SVG)</span>
        </div>

        {/* SVG Logo 2: bold geometric C */}
        <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
          <svg width="192" height="192" viewBox="0 0 192 192">
            <path d="M 130 30 C 80 20 20 40 20 96 C 20 152 80 172 130 160"
              fill="none" stroke="#FF5A3C" strokeWidth="10" strokeLinecap="round" />
            <circle cx="96" cy="96" r="8" fill="#FF5A3C" opacity="0.6" />
          </svg>
          <span className="text-xs text-[var(--color-text-tertiary)]">粗體 C 字幾何 (SVG)</span>
        </div>
      </div>

      {/* Color reference */}
      <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ background: '#FF5A3C' }} />
          <span>#FF5A3C</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ background: '#CC3D2E' }} />
          <span>#CC3D2E</span>
        </div>
      </div>
    </div>
  )
}
