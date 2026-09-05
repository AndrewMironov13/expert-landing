import { useState, type FormEvent } from 'react'
import { company } from '@/lib/content'
import { Messengers } from './Messengers'

export function CtaForm() {
  const [sent, setSent] = useState(false)

  /* Заявка уходит письмом на info@caspol.ru: собираем поля в mailto и открываем почту */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const val = (k: string) => String(fd.get(k) ?? '').trim()
    const body = [
      'Заявка с лендинга ЭКСПЕРТ',
      '',
      `Имя: ${val('name')}`,
      `Компания: ${val('company')}`,
      `Телефон: ${val('phone')}`,
      `Город / регион: ${val('city') || '—'}`,
      '',
      val('comment'),
    ].join('\n')
    const subject = 'Заявка на партнёрство — линейка ЭКСПЕРТ'
    window.location.href = `${company.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="cta" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="band-noir grid gap-10 rounded-[2rem] p-8 md:grid-cols-[1.1fr_1fr] md:p-14">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-gold-300">
              Партнёрам
            </p>
            <h2 className="mt-4 text-4xl text-[#f6efe0] md:text-[2.75rem] md:leading-[1.08]">
              Станьте партнёром ЭКСПЕРТ в своём регионе
            </h2>
            <p className="mt-5 max-w-md text-[#cfc6b4]">
              Оставьте заявку — вышлем прайс, условия партнёрства и бесплатные образцы всех
              пяти формул. Менеджер завода ответит в течение рабочего дня
            </p>
            <p className="mt-3 max-w-md font-mono text-[0.68rem] text-[#8c8577]">
              * Наличие свободных регионов уточняется у менеджера
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-gold-300/80">
                  Позвонить
                </p>
                <a
                  href={company.phoneHref}
                  className="mt-2 block whitespace-nowrap font-display text-xl text-[#f6efe0] transition hover:text-gold-200 md:text-2xl"
                >
                  {company.phone}
                </a>
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-gold-300/80">
                  Написать
                </p>
                <a
                  href={company.emailHref}
                  className="mt-2 block whitespace-nowrap font-display text-xl text-[#f6efe0] transition hover:text-gold-200 md:text-2xl"
                >
                  {company.email}
                </a>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-gold-300/80">Мессенджеры</p>
              <Messengers tone="dark" size="lg" className="mt-3" />
            </div>
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gold-400/40 bg-white/5 p-10 text-center">
              <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
                <path d="M22 4 L30 22 L22 40 L14 22 Z" fill="none" stroke="var(--color-gold-300)" strokeWidth="2" />
                <path d="M15 22 L20 27 L29 17" fill="none" stroke="var(--color-gold-300)" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <p className="mt-5 font-display text-2xl text-[#f6efe0]">Письмо готово</p>
              <p className="mt-2 text-sm text-[#cfc6b4]">
                Оно открылось в вашей почте — отправьте его, и менеджер ответит в течение рабочего дня.
                Если почта не открылась, напишите нам на{' '}
                <a href={company.emailHref} className="text-gold-200 underline-offset-4 hover:underline">
                  {company.email}
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Field name="name" label="Имя" placeholder="Как к вам обращаться" required />
              <Field name="company" label="Компания" placeholder="Название или сфера: магазин, дистрибуция, укладка" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="phone" label="Телефон" placeholder="+7 ___ ___-__-__" type="tel" required />
                <Field name="city" label="Город" placeholder="Регион работы" />
              </div>
              <div>
                <label htmlFor="comment" className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-gold-300">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  placeholder="Например: интересует палета 156-2 и условия для сети"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#f6efe0] placeholder:text-[#8c8577] focus:border-gold-300 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-gold-400 px-8 py-4 font-semibold text-ink transition hover:bg-gold-300"
              >
                Получить прайс и образцы
              </button>
              <p className="text-center font-mono text-[0.62rem] text-[#8c8577]">
                Отправляя форму, вы соглашаетесь на обработку персональных данных
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
}: {
  name: string
  label: string
  placeholder: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-gold-300">
        {label}
        {required && ' *'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#f6efe0] placeholder:text-[#8c8577] focus:border-gold-300 focus:outline-none"
      />
    </div>
  )
}
