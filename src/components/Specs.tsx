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

export function Specs() {
  return (
    <section id="specs" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Технические данные</p>
            <h2 className="text-4xl md:text-5xl">Вся линейка в одной таблице</h2>
            <p className="mt-4 text-muted">
              Данные из ТУ 2025 года при стандартных условиях: (23±2) °С и влажности (50±10) %.
            </p>
          </div>
          <p className="font-mono text-xs text-muted">ГОСТ Р 58211 · ГОСТ 24621</p>
        </div>

        <div className="card-label overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="band-noir">
                <th className="px-5 py-4 text-left font-mono text-[0.62rem] font-medium uppercase tracking-[0.2em]">
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
                <tr key={r.label} className={i % 2 ? 'bg-paper-2/60' : 'bg-white/40'}>
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink">{r.label}</td>
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

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ['+15…+25 °С', 'температура укладки и переработки'],
            ['до −30 °С', 'допустимая транспортировка зимой'],
            ['≤ 2,3 %', 'остаточная влажность цементной стяжки'],
          ].map(([v, l]) => (
            <div key={l} className="card-label rounded-2xl p-5">
              <p className="font-display text-2xl text-gold-600">{v}</p>
              <p className="mt-1 text-sm text-muted">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
