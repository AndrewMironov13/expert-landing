import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { company } from '@/lib/content'
import { Messengers } from './Messengers'

const links = [
  { href: '#products', label: 'Линейка' },
  { href: '#specs', label: 'Сравнение' },
  { href: '#calculator', label: 'Калькулятор' },
  { href: '#dealer', label: 'Партнёрам' },
  { href: '#contacts', label: 'Контакты' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  /* Наверху шапка лежит на тёмном видео — включаем светлую версию */
  const onDark = !scrolled && !open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <NavScrollWatcher onChange={setScrolled} />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Logo light={onDark} />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Основная навигация">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition ${
                onDark ? 'text-[#ece3d0] hover:text-gold-200' : 'text-ink-soft hover:text-gold-600'
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <a
            href={company.phoneHref}
            className={`hidden whitespace-nowrap font-mono text-sm transition lg:inline ${
              onDark ? 'text-[#ece3d0] hover:text-gold-200' : 'text-ink-soft hover:text-gold-600'
            }`}
          >
            {company.phone}
          </a>
          {/* Обёртка, а не className: у компонента свой inline-flex, и hidden с ним спорит */}
          <span className="hidden lg:inline-flex">
            <Messengers tone={onDark ? 'dark' : 'light'} />
          </span>
          <a
            href="#cta"
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              onDark ? 'bg-gold-400 text-ink hover:bg-gold-300' : 'bg-ink text-paper hover:bg-ink-soft'
            }`}
          >
            Стать партнёром
          </a>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border md:hidden ${
            onDark ? 'border-gold-200/40' : ''
          }`}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <div className={`h-px w-5 transition ${onDark ? 'bg-[#f6efe0]' : 'bg-ink'} ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <div className={`h-px w-5 transition ${onDark ? 'bg-[#f6efe0]' : 'bg-ink'} ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </div>
        </button>
      </div>
      {open && (
        /* Компактное меню: четыре ссылки плиткой, кнопка, одна строка контактов.
           «Сравнение» здесь не нужно — оно идёт сразу за каталогом. */
        <nav className="glass mx-4 mt-3 rounded-2xl p-4 md:hidden" aria-label="Мобильная навигация">
          <div className="grid grid-cols-2 gap-2">
            {links
              .filter((l) => l.href !== '#specs')
              .map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-line-soft bg-white/60 px-4 py-3 text-sm font-medium text-ink"
                >
                  {l.label}
                </a>
              ))}
          </div>
          <a href="#cta" onClick={() => setOpen(false)} className="mt-3 block rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-paper">
            Стать партнёром
          </a>
          <div className="mt-3 flex items-center justify-between gap-3">
            <a href={company.phoneHref} className="font-mono text-sm text-ink-soft">{company.phone}</a>
            <Messengers tone="light" />
          </div>
        </nav>
      )}
    </header>
  )
}

/* Отдельный подписчик скролла, чтобы не создавать лишних ререндеров ссылок */
function NavScrollWatcher({ onChange }: { onChange: (scrolled: boolean) => void }) {
  useEffect(() => {
    const onScroll = () => onChange(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onChange])
  return null
}
