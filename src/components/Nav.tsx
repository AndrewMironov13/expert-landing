import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { company } from '@/lib/content'

const links = [
  { href: '#products', label: 'Линейка' },
  { href: '#specs', label: 'Данные' },
  { href: '#calculator', label: 'Калькулятор' },
  { href: '#dealer', label: 'Дилерам' },
  { href: '#faq', label: 'FAQ' },
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
          <a
            href="#cta"
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              onDark ? 'bg-gold-400 text-ink hover:bg-gold-300' : 'bg-ink text-paper hover:bg-ink-soft'
            }`}
          >
            Стать дилером
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
        <nav className="glass mx-4 mt-3 rounded-2xl p-5 md:hidden" aria-label="Мобильная навигация">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line-soft py-3 font-medium text-ink last:border-0"
            >
              {l.label}
            </a>
          ))}
          <a href="#cta" onClick={() => setOpen(false)} className="mt-3 block rounded-full bg-ink px-5 py-3 text-center font-semibold text-paper">
            Стать дилером
          </a>
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
