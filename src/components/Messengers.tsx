import { messengers, type MessengerId } from '@/lib/content'

/* Круглые кнопки мессенджеров — тот же набор и ссылки, что на sport.caspol.ru.
   `tone` — под тёмный фон (шапка над видео, чёрные блоки) или под светлый. */
const ICON: Record<MessengerId, React.ReactNode> = {
  wa: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
    </svg>
  ),
  tg: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.9 4.3 19 20.1c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.5.5-1 .5l.3-4.6 8.4-7.6c.4-.3-.1-.5-.6-.2L7.4 13.3l-4.5-1.4c-1-.3-1-1 .2-1.4l17.6-6.8c.8-.3 1.5.2 1.2 1.6Z" />
    </svg>
  ),
  /* У MAX нет общеизвестного знака — текстовый бейдж, не выдуманный логотип */
  max: <b className="font-sans text-[10px] font-extrabold tracking-[0.02em]">MAX</b>,
}

export function Messengers({
  tone = 'dark',
  size = 'md',
  className = '',
}: {
  tone?: 'dark' | 'light'
  size?: 'md' | 'lg'
  className?: string
}) {
  if (messengers.length === 0) return null
  const box = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9'
  const skin =
    tone === 'dark'
      ? 'border-gold-300/50 text-[#f6efe0] hover:border-gold-300 hover:bg-gold-400 hover:text-ink'
      : 'border-line text-ink hover:border-gold-400 hover:bg-gold-50'
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {messengers.map((m) => (
        <a
          key={m.id}
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={m.label}
          title={m.label}
          className={`inline-flex items-center justify-center rounded-full border transition ${box} ${skin}`}
        >
          {ICON[m.id]}
        </a>
      ))}
    </span>
  )
}
