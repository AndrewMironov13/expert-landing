import { useMemo, useState } from 'react'
import { products, spreaders } from '@/lib/content'

const fmt = (n: number) =>
  n.toLocaleString('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 0 })

const bucketsWord = (n: number) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'ведро'
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'ведра'
  return 'вёдер'
}

export function Calculator() {
  const [productId, setProductId] = useState(products[1].id)
  const [area, setArea] = useState(60)
  const [reserve, setReserve] = useState(true)

  const product = products.find((p) => p.id === productId) ?? products[0]
  const availableSpreaders = spreaders.filter((s) => s.kinds.includes(product.kind))
  const [spreaderId, setSpreaderId] = useState(availableSpreaders[0].id)
  const spreader =
    availableSpreaders.find((s) => s.id === spreaderId) ?? availableSpreaders[0]

  const result = useMemo(() => {
    const k = reserve ? 1.05 : 1
    const kgMin = (area * spreader.minG * k) / 1000
    const kgMax = (area * spreader.maxG * k) / 1000
    const buckets = Math.ceil(kgMax / product.packKg)
    return { kgMin, kgMax, buckets }
  }, [area, spreader, reserve, product])

  return (
    <section id="calculator" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">Калькулятор расхода</p>
          <h2 className="text-4xl md:text-5xl">Сколько клея нужно на объект</h2>
          <p className="mt-5 text-lg text-muted">
            Нормы расхода — из технических условий линейки. Двигайте ползунок площади —
            расчёт обновляется мгновенно.
          </p>
        </div>

        <div className="card-label grid gap-10 rounded-3xl p-6 md:grid-cols-[1.2fr_1fr] md:p-10">
          {/* Управление */}
          <div className="space-y-8">
            <div>
              <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted">Клей</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setProductId(p.id)
                      const next = spreaders.filter((s) => s.kinds.includes(p.kind))
                      if (!next.some((s) => s.id === spreaderId)) setSpreaderId(next[0].id)
                    }}
                    aria-pressed={p.id === productId}
                    className={`rounded-lg border px-2 py-2.5 text-center transition ${
                      p.id === productId
                        ? 'border-gold-400 bg-gold-50'
                        : 'border-line bg-white/60 hover:border-gold-200'
                    }`}
                  >
                    <span className="block font-mono text-[0.62rem] text-gold-600">{p.kind}</span>
                    <span className="block text-xs font-semibold text-ink">{p.id}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">{product.name} · {product.pack}</p>
            </div>

            <div>
              <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted">
                Зубчатый шпатель
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableSpreaders.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpreaderId(s.id)}
                    aria-pressed={s.id === spreader.id}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      s.id === spreader.id
                        ? 'border-gold-400 bg-gold-50'
                        : 'border-line bg-white/60 hover:border-gold-200'
                    }`}
                  >
                    <span className="font-semibold text-ink">{s.label}</span>
                    <span className="ml-2 font-mono text-[0.62rem] text-gold-600">
                      {s.minG}–{s.maxG} г/м²
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{s.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted">
                  Площадь укладки
                </p>
                <p className="font-display text-3xl text-ink">
                  {area} <span className="text-lg text-muted">м²</span>
                </p>
              </div>
              <input
                type="range"
                min={10}
                max={2000}
                step={10}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full accent-[var(--color-gold-500)]"
                aria-label="Площадь укладки в квадратных метрах"
              />
              <div className="mt-1 flex justify-between font-mono text-[0.62rem] text-muted">
                <span>10 м² — комната</span>
                <span>2000 м² — крупный объект</span>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={reserve}
                onChange={(e) => setReserve(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-gold-500)]"
              />
              Запас 5 % на неровности основания
            </label>
          </div>

          {/* Результат */}
          <div className="band-noir flex flex-col justify-between rounded-2xl p-7">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-gold-300">
                Потребуется
              </p>
              <p className="mt-4 font-display text-5xl leading-none">
                {fmt(result.kgMin)}–{fmt(result.kgMax)}
                <span className="ml-2 text-2xl text-gold-200">кг</span>
              </p>
              <div className="hairline-gold my-6" />
              <p className="font-display text-3xl">
                {result.buckets}
                <span className="ml-2 text-lg text-gold-200">
                  {bucketsWord(result.buckets)} × {product.packKg} кг
                </span>
              </p>
              <p className="mt-3 text-sm text-[#cfc6b4]">
                {product.sku} · шпатель {spreader.label}
                {reserve ? ' · с запасом 5 %' : ''}
              </p>
            </div>
            <a
              href="#dealer"
              className="mt-8 rounded-full bg-gold-400 px-7 py-3.5 text-center font-semibold text-ink transition hover:bg-gold-300"
            >
              Запросить дилерский прайс
            </a>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted">
          Расчёт ориентировочный: фактический расход зависит от ровности основания и техники
          нанесения. Точную потребность подтвердит технолог CASPOL.
        </p>
      </div>
    </section>
  )
}
