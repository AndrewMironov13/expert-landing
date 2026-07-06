import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { products, type Product } from '@/lib/content'

const kindLabel: Record<Product['kind'], string> = {
  '1К': 'Силановый · без смешивания',
  '2К': 'Полиуретановый · с отвердителем',
}

export function Products() {
  const [activeId, setActiveId] = useState(products[1].id)
  const active = products.find((p) => p.id === activeId) ?? products[0]

  return (
    <section id="products" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:py-32">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">Линейка</p>
        <h2 className="text-4xl md:text-5xl">Пять клеёв — любой заказ закрыт</h2>
        <p className="mt-5 text-lg text-muted">
          От мягкого силанового 1К до жёсткого полиуретанового 2К. Какую бы доску и основание
          ни принёс мастер — в линейке ЭКСПЕРТ уже есть решение под его объект.
        </p>
      </div>

      {/* Переключатель продуктов */}
      <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5" role="tablist" aria-label="Продукты линейки">
        {products.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={p.id === activeId}
            onClick={() => setActiveId(p.id)}
            className={`rounded-xl border px-3 py-3 text-left transition ${
              p.id === activeId
                ? 'border-gold-400 bg-gold-50 shadow-[0_14px_30px_-18px_rgba(150,113,58,0.5)]'
                : 'border-line bg-white/50 hover:border-gold-200'
            }`}
          >
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold-600">{p.kind}</span>
            <span className="mt-1 block text-sm font-semibold leading-tight text-ink">
              {p.elasticity}
            </span>
            <span className="mt-1 block font-mono text-[0.62rem] text-muted">{p.id}</span>
          </button>
        ))}
      </div>

      {/* Карточка активного продукта */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="card-label grid gap-8 rounded-3xl p-6 md:grid-cols-[minmax(280px,380px)_1fr] md:p-10"
        >
          <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-b from-paper to-paper-2 p-6">
            <div
              aria-hidden
              className="absolute inset-x-10 bottom-6 h-8 rounded-[50%] bg-ink/10 blur-md"
            />
            <img
              src={active.image}
              alt={`Ведро клея ${active.sku} ${active.badge}`}
              className="relative w-full max-w-[300px] drop-shadow-[0_22px_30px_rgba(60,44,18,0.25)]"
            />
          </div>

          <div>
            <p className="eyebrow mb-2">{kindLabel[active.kind]}</p>
            <h3 className="text-3xl md:text-4xl">{active.name}</h3>
            <p className="mt-1 font-mono text-sm text-muted">{active.sku}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Твердость" value={active.hardness} />
              <Stat label="Прочность на сдвиг" value={active.shear} />
              <Stat label="Упаковка" value={active.pack} />
              <Stat label="Отверждение" value={active.cure} wide />
              {active.ratio && <Stat label="Смешивание" value={active.ratio} />}
            </div>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {active.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 shrink-0" aria-hidden>
                    <path d="M7 1 L9.6 7 L7 13 L4.4 7 Z" fill="var(--color-gold-400)" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-gold-200 bg-gold-50/60 p-4">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold-600">Где использовать</p>
              <p className="mt-1.5 text-sm text-ink-soft">{active.bestFor}</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#cta" className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:bg-ink-soft">
                Запросить прайс
              </a>
              <a href="#calculator" className="rounded-full border border-gold-400 px-7 py-3 text-sm font-semibold text-ink transition hover:bg-gold-50">
                Рассчитать расход
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function Stat({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl border border-line-soft bg-white/70 p-3 ${wide ? 'col-span-2' : ''}`}>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  )
}
