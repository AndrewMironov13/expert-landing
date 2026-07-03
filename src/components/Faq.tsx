import { useState } from 'react'
import { faq } from '@/lib/content'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-4">Вопросы дилеров</p>
          <h2 className="text-4xl md:text-5xl">Что спрашивают чаще всего</h2>
        </div>
        <div className="space-y-3">
          {faq.map((item, i) => (
            <div key={item.q} className="card-label overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-sans font-semibold text-ink">{item.q}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  aria-hidden
                  className={`shrink-0 transition-transform duration-300 ${open === i ? 'rotate-90' : ''}`}
                >
                  <path d="M7 1 L9.6 7 L7 13 L4.4 7 Z" fill="var(--color-gold-400)" />
                </svg>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
