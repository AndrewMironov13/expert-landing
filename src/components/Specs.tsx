import { useState } from 'react'
import { products } from '@/lib/content'

const rows: Array<{ label: string; value: (p: (typeof products)[number]) => string }> = [
  { label: 'Основа', value: (p) => p.base },
  { label: 'Твердость', value: (p) => p.hardness },
  { label: 'Прочность на сдвиг', value: (p) => p.shear },
  { label: 'Отрыв через 7 дней', value: () => '≥ 1,5 Н/мм²' },
  { label: 'Рабочее время', value: (p) => (p.kind === '2К' ? '≈ 60 мин' : '40–60 мин') },
  { label: 'Пешеходная нагрузка', value: () => 'через 24 ч' },
  { label: 'Шлифовка', value: () => 'через 4–5 суток' },
  { label: 'Упаковка', value: (p) => p.pack },
  { label: 'Гарантийный срок', value: (p) => (p.kind === '2К' ? '12 мес' : '6 мес') },
]

/* Ключевые числа, которые важны на объекте */
const headline = [
  { v: '24 ч', l: 'до пешеходной нагрузки' },
  { v: '≥ 3,0', l: 'Н/мм² прочность на сдвиг' },
  { v: '−30 °С', l: 'выдерживает транспортировку' },
  { v: '0', l: 'воды и растворителей в составе' },
]

export function Specs() {
  const [open, setOpen] = useState(false)

  return (
    <section id="specs" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">Технические данные</p>
          <h2 className="text-4xl md:text-5xl">Цифры, которые важны на объекте</h2>
          <p className="mt-5 text-lg text-muted">
            Каждая формула проходит испытания по ГОСТ Р 58211. Главные показатели — крупно,
            полная таблица сравнения — по клику.
          </p>
        </div>

        {/* Крупные числа */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {headline.map((s) => (
            <div key={s.l} className="card-label rounded-2xl p-6">
              <p className="font-display text-4xl text-gold-600 md:text-5xl">{s.v}</p>
              <p className="mt-2 text-sm leading-snug text-muted">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Разворачиваемая таблица сравнения */}
        <div className="mt-8">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-white/50 px-6 py-4 text-left transition hover:border-gold-200"
          >
            <span className="font-sans font-semibold text-ink">
              Полное сравнение пяти формул
            </span>
            <span className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-gold-600">
              {open ? 'Свернуть' : 'Развернуть'}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                aria-hidden
                className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
              >
                <path d="M7 1 L9.6 7 L7 13 L4.4 7 Z" fill="var(--color-gold-400)" />
              </svg>
            </span>
          </button>

          <div
            className={`grid transition-all duration-500 ${
              open ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="card-label overflow-x-auto rounded-3xl">
                <table className="w-full min-w-[880px] border-collapse text-sm">
                  <thead>
                    <tr className="band-noir">
                      <th className="sticky left-0 z-10 bg-[#1a1611] px-5 py-4 text-left font-mono text-[0.62rem] font-medium uppercase tracking-[0.2em]">
                        Показатель
                      </th>
                      {products.map((p) => (
                        <th key={p.id} className="px-4 py-4 text-left">
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold-300">
                            {p.kind} · {p.id}
                          </span>
                          <span className="label-caps mt-1 block text-[0.72rem] font-normal tracking-[0.12em]">
                            {p.elasticity}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr
                        key={r.label}
                        className={`transition-colors hover:bg-gold-50/70 ${
                          i % 2 ? 'bg-paper-2/60' : 'bg-white/40'
                        }`}
                      >
                        <td className="sticky left-0 z-10 whitespace-nowrap bg-inherit px-5 py-3.5 font-medium text-ink">
                          {r.label}
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="px-4 py-3.5 text-ink-soft">
                            {r.value(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 font-mono text-xs text-muted">
                Данные из ТУ 2025 г. при (23±2) °С и влажности (50±10) %. ГОСТ Р 58211 · ГОСТ 24621.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
