import { dealerBenefits } from '@/lib/content'

const steps = [
  ['Заявка', 'Оставляете контакты — менеджер завода связывается в течение рабочего дня.'],
  ['Условия и образцы', 'Высылаем прайс, шкалу скидок и бесплатные образцы всех пяти формул.'],
  ['Первая отгрузка', 'Договор, палета со склада в Дзержинске за 1–2 дня — полка укомплектована.'],
]

export function Dealer() {
  return (
    <section id="dealer" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">Дилерская программа</p>
          <h2 className="text-4xl md:text-5xl">Линейка, созданная для партнёров</h2>
          <p className="mt-5 text-lg text-muted">
            ЭКСПЕРТ — закрытая профессиональная линейка CASPOL. Мы производим,
            вы зарабатываете на дистрибуции.
          </p>
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
              <h3 className="font-sans text-lg font-bold text-ink">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
            </div>
          ))}
        </div>

        {/* Шаги — это настоящая последовательность, нумерация уместна */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <div key={t} className="relative rounded-2xl border border-gold-200 bg-gold-50/50 p-6">
              <p className="font-display text-4xl text-gold-300">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-sans text-lg font-bold text-ink">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
              {i < 2 && (
                <svg
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block"
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  aria-hidden
                >
                  <path d="M0 6 H20 M15 1 L21 6 L15 11" fill="none" stroke="var(--color-gold-400)" strokeWidth="1.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
