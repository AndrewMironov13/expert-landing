import { Logo } from './Logo'
import { company } from '@/lib/content'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2/60 py-12">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-8 px-5">
        <div>
          <Logo />
        </div>
        <div className="text-sm text-muted">
          <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold-600">Контакты</p>
          <a href={company.phoneHref} className="block font-semibold text-ink hover:text-gold-600">
            {company.phone}
          </a>
          <a href={company.siteHref} target="_blank" rel="noreferrer" className="mt-1 block hover:text-gold-600">
            {company.site}
          </a>
        </div>
        <div className="max-w-xs text-sm text-muted">
          <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gold-600">Реквизиты</p>
          <p>{company.name}</p>
          <p>{company.inn} · {company.kpp}</p>
          <p className="mt-1">{company.address}</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-5">
        <div className="hairline-gold" />
        <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.3em] text-muted-soft">
          Экологичный · Надежный · Профессиональный
        </p>
      </div>
    </footer>
  )
}
