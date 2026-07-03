/* Чёрная лента с этикетки — бегущая строка */
const words = ['Экологичный', 'Надежный', 'Профессиональный']

export function NoirBand() {
  const row = Array.from({ length: 4 }).flatMap((_, i) =>
    words.map((w, j) => (
      <span key={`${i}-${j}`} className="mx-7 flex items-center gap-7">
        <span className="label-caps text-sm tracking-[0.34em]">{w}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path d="M6 1 L8.4 6 L6 11 L3.6 6 Z" fill="var(--color-gold-300)" />
        </svg>
      </span>
    )),
  )
  return (
    <div className="band-noir overflow-hidden py-4" aria-hidden>
      <div className="animate-marquee flex w-max" style={{ ['--duration' as string]: '36s' }}>
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  )
}
