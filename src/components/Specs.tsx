import { useState } from 'react'
import { products, scales, type Product } from '@/lib/content'

/* Одна матрица, как на слайде презентации: строки — показатели, колонки — формулы,
   точки «разбегаются» по эластичности, прочности и твердости. Остальные строки ТУ — по кнопке */
type ScaleKey = keyof (typeof scales)['156-1']
const scaleRows: Array<{ key: ScaleKey; label: string; hint?: (p: Product) => string }> = [
  { key: 'elasticity', label: 'Эластичность' },
  { key: 'strength', label: 'Прочность соединения', hint: (p) => p.shear },
  { key: 'hardness', label: 'Твердость', hint: (p) => p.hardness },
]

const MAX = 6

const tuRows: Array<{ label: string; value: (p: Product) => string }> = [
  { label: 'Основа', value: (p) => p.base },
  { label: 'Отверждение', value: (p) => (p.kind === '2К' ? 'Отвердителем' : 'Влагой воздуха') },
  { label: 'Рабочее время', value: (p) => (p.kind === '2К' ? '≈ 60 мин' : '40–60 мин') },
  { label: 'Отрыв через 7 дней', value: () => '≥ 1,5 Н/мм²' },
  { label: 'Пешеходная нагрузка', value: () => 'через 24 ч' },
  { label: 'Шлифовка', value: () => 'через 4–5 суток' },
  { label: 'Упаковка', value: (p) => p.pack },
  { label: 'Гарантийный срок', value: (p) => (p.kind === '2К' ? '12 мес' : '6 мес') },
]

function Dots({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-center gap-2" role="img" aria-label={`${label}: ${value} из ${MAX}`}>
      {Array.from({ length: MAX }).map((_, i) => (
        <span
          key={i}
          className={`block h-2.5 w-2.5 rotate-45 rounded-[1px] ${i < value ? 'bg-gold-500' : 'bg-gold-100'}`}
        />
      ))}
    </span>
  )
}

const cellBg = (i: number) => (i % 2 ? 'bg-paper-2/70' : 'bg-white/50')

export function Specs() {
  const [all, setAll] = useState(false)

  return (
    <section id="specs" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Сравнение</p>
            <h2 className="text-4xl md:text-5xl">Вся линейка на одной странице</h2>
          </div>
          <p className="max-w-sm text-base text-muted md:pb-2">
            Чем эластичнее формула, тем спокойнее она переносит движение древесины. Чем прочнее, тем
            жёстче держит массив
          </p>
        </div>

        <div className="card-label overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="band-noir">
                {/* Липкая ячейка красится тем же градиентом, что и строка, — без «заплатки» */}
                <th className="band-noir sticky left-0 z-10 w-[148px] px-4 py-5 text-left align-top font-mono text-[0.6rem] font-medium uppercase tracking-[0.16em] text-gold-300 md:w-[200px] md:px-6">
                  Показатель
                </th>
                {products.map((p) => (
                  <th key={p.id} className="px-5 py-5 text-left align-top">
                    <span className="block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold-300">
                      {p.kind} · {p.id}
                    </span>
                    <span className="label-caps mt-2 block text-[0.74rem] font-normal leading-snug tracking-[0.08em] text-[#f6efe0]">
                      {p.elasticity}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scaleRows.map((r, i) => (
                <tr key={r.key} className={cellBg(i)}>
                  <td className="sticky left-0 z-10 bg-inherit px-4 py-6 align-top font-medium text-ink md:px-6">{r.label}</td>
                  {products.map((p) => (
                    <td key={p.id} className="px-5 py-6 align-top">
                      <Dots value={scales[p.id][r.key]} label={r.label} />
                      {r.hint && <span className="mt-2.5 block font-mono text-[0.62rem] text-muted">{r.hint(p)}</span>}
                    </td>
                  ))}
                </tr>
              ))}
              {all &&
                tuRows.map((r, i) => (
                  <tr key={r.label} className={`${cellBg(i + scaleRows.length)} transition-colors hover:bg-gold-50/70`}>
                    <td className="sticky left-0 z-10 bg-inherit px-4 py-3.5 font-medium text-ink md:whitespace-nowrap md:px-6">{r.label}</td>
                    {products.map((p) => (
                      <td key={p.id} className="px-5 py-3.5 text-ink-soft">
                        {r.value(p)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted">
            Шкалы относительные, внутри линейки ЭКСПЕРТ · данные из ТУ 2025 г.
          </p>
          <button
            onClick={() => setAll(!all)}
            aria-expanded={all}
            className="rounded-full border border-gold-400 px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-50"
          >
            {all ? 'Скрыть показатели ТУ' : 'Все показатели ТУ'}
          </button>
        </div>
      </div>
    </section>
  )
}
