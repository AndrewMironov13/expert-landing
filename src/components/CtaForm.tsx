import { useState, type FormEvent } from 'react'
import { company } from '@/lib/content'

export function CtaForm() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    /* Фронт-мок: подключить CRM/почту на этапе интеграции */
    setSent(true)
  }

  return (
    <section id="cta" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="band-noir grid gap-10 rounded-[2rem] p-8 md:grid-cols-[1.1fr_1fr] md:p-14">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-gold-300">
              Дилерам и дистрибьюторам
            </p>
            <h2 className="mt-4 text-4xl text-[#f6efe0] md:text-5xl">
              Поставьте ЭКСПЕРТ на свою полку
            </h2>
            <p className="mt-5 max-w-md text-[#cfc6b4]">
              Оставьте заявку — вышлем дилерский прайс, шкалу скидок и бесплатные
              образцы всех пяти формул. Менеджер завода ответит в течение рабочего дня.
            </p>
            <div className="mt-8 space-y-2 font-mono text-sm text-[#cfc6b4]">
              <p>
                <a href={company.phoneHref} className="text-gold-300 hover:text-gold-200">
                  {company.phone}
                </a>
              </p>
              <p>{company.name} · {company.inn}</p>
              <p className="max-w-sm">{company.address}</p>
            </div>
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gold-400/40 bg-white/5 p-10 text-center">
              <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
                <path d="M22 4 L30 22 L22 40 L14 22 Z" fill="none" stroke="var(--color-gold-300)" strokeWidth="2" />
                <path d="M15 22 L20 27 L29 17" fill="none" stroke="var(--color-gold-300)" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <p className="mt-5 font-display text-2xl text-[#f6efe0]">Заявка отправлена</p>
              <p className="mt-2 text-sm text-[#cfc6b4]">
                Свяжемся в течение рабочего дня и вышлем прайс с образцами.
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
