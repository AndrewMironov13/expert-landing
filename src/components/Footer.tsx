import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { company } from '@/lib/content'
import { Messengers } from './Messengers'

const MAP_SRC = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(company.mapQuery)}&z=16`

export function Footer() {
  return (
    <footer id="contacts" className="scroll-mt-24 border-t border-line bg-paper-2/60">
      {/* Контакты + карта офиса */}
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow mb-4">Контакты</p>
          <h2 className="text-4xl md:text-5xl">Производство и офис в Дзержинске</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
          <div className="flex flex-col justify-between gap-8">
            <div className="space-y-6 text-sm text-muted">
              <div>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold-600">Телефон</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <a href={company.phoneHref} className="font-display text-2xl text-ink transition hover:text-gold-600">
                    {company.phone}
                  </a>
                  <Messengers tone="light" />
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold-600">Почта</p>
                <a href={company.emailHref} className="font-display text-2xl text-ink transition hover:text-gold-600">
                  {company.email}
                </a>
              </div>
              <div>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold-600">Сайт</p>
                <a href={company.siteHref} target="_blank" rel="noreferrer" className="font-semibold text-ink hover:text-gold-600">
                  {company.site}
                </a>
              </div>
              <div>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold-600">Адрес</p>
                <p className="max-w-xs text-ink-soft">{company.address}</p>
              </div>
            </div>
            <div className="text-xs text-muted">
              <p>{company.name}</p>
              <p>{company.inn} · {company.kpp}</p>
            </div>
          </div>
          <MapEmbed />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-8">
          <Logo />
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-muted-soft">
            Экологичный · Надежный · Профессиональный
          </p>
          <p className="font-mono text-[0.62rem] text-muted-soft">© {new Date().getFullYear()} {company.name}</p>
        </div>
      </div>
    </footer>
  )
}

/* Карта монтируется не сразу: подключение iframe Яндекс Карт стоит ~0,5 с главного
   потока (замер: разовый кадр 550–650 мс на подъезде к контактам). Поэтому —
   когда контакты уже на экране и прокрутка остановилась;
   на тач-устройствах — только по тапу, иначе карта перехватывает свайп. */
function MapEmbed() {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)
  const [touch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (live || touch) return
    const el = ref.current
    if (!el) return
    /* requestIdleCallback не годится: при плавной прокрутке простой есть между
       кадрами, и подключение iframe (~0,5 с) попадало в движение. Ждём, пока
       контакты на экране И прокрутка стоит 700 мс — тогда рывок никто не увидит. */
    let timer = 0
    let armed = false
    const settle = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setLive(true), 700)
    }
    const onScroll = () => {
      if (armed) settle()
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        armed = true
        settle()
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
    }
  }, [live, touch])

  return (
    <div ref={ref} className="map-frame card-label relative min-h-[380px] overflow-hidden rounded-3xl bg-paper-3">
      {live ? (
        <iframe src={MAP_SRC} title="Каспол на карте — Дзержинск, Красноармейская 15А" allowFullScreen />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="max-w-xs text-sm text-muted">Дзержинск, ул. Красноармейская, 15А</p>
          {touch && (
            <button
              type="button"
              onClick={() => setLive(true)}
              className="rounded-full border border-gold-400 px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-50"
            >
              Показать карту
            </button>
          )}
        </div>
      )}
    </div>
  )
}
