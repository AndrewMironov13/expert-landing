export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className}`} aria-label="ЭКСПЕРТ — на главную">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
        <path d="M15 3 L21 15 L15 27 L9 15 Z" fill="none" stroke="var(--color-gold-500)" strokeWidth="1.6" />
        <path d="M15 9 L18 15 L15 21 L12 15 Z" fill="var(--color-gold-400)" />
      </svg>
      <span className="leading-none">
        <span className="label-caps block text-[1.05rem] text-ink">Эксперт</span>
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-muted">by Caspol</span>
      </span>
    </a>
  )
}
