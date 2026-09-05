import { dealerBenefits, dealerPromise } from '@/lib/content'

export function Dealer() {
  return (
    <section id="dealer" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-4">Партнёрам</p>
          <h2 className="text-4xl md:text-5xl">Эксклюзивная линейка для тех, кто дорожит результатом</h2>
          <p className="mt-5 text-lg text-muted">
            ЭКСПЕРТ не продаётся на маркетплейсах. Его выбирают те, кто разбирается в паркете
            и бережёт своё время
          </p>
        </div>

        {/* Для кого · для чего · зачем */}
        <div className="grid gap-4 md:grid-cols-3">
          {dealerPromise.map((item) => (
            <div key={item.q} className="band-noir rounded-2xl p-7">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-gold-300">{item.q}</p>
              <h3 className="mt-3 font-display text-2xl leading-snug text-[#f6efe0]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cfc6b4]">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Что получает партнёр */}
        <div className="mb-6 mt-12 flex flex-wrap items-end justify-between gap-4">
          <h3 className="text-3xl md:text-4xl">Что получает партнёр</h3>
          <a href="#cta" className="text-sm font-semibold text-gold-600 underline-offset-4 transition hover:underline">
            Оставить заявку →
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {dealerBenefits.map((b, i) => (
            <div key={b.title} className="card-label group rounded-2xl p-6 transition hover:border-gold-300">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="mb-4">
                <path
                  d={i % 2 ? 'M9 1 L12.5 9 L9 17 L5.5 9 Z' : 'M9 2 L16 9 L9 16 L2 9 Z'}
                  fill="none"
                  stroke="var(--color-gold-500)"
                  strokeWidth="1.4"
                />
              </svg>
              <h4 className="font-sans text-lg font-bold text-ink">{b.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
