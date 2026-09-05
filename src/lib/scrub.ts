/* Предохранитель сцены. Нативному <video> WebCodecs не нужен, поэтому прежней
   проверки VideoDecoder здесь больше нет — она отключала сцену там, где та
   прекрасно работает. Мобильные пока остаются на статичном постере: ролик снят
   горизонтально, и вертикальный кроп надо проверять на живом телефоне отдельно.
   Живые изменения reduced-motion и save-data плеер отслеживает сам. */
export type ScrubMode = 'full' | 'off'

export function scrubMode(): ScrubMode {
  if (typeof window === 'undefined') return 'off'
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
  if (nav.connection?.saveData) return 'off'
  if (['slow-2g', '2g'].includes(nav.connection?.effectiveType ?? '')) return 'off'
  /* Телефоны и планшеты: грубый указатель, нет hover или несколько точек касания
     (iPad с трекпадом отдаёт pointer: fine, но maxTouchPoints > 1). Ширина окна —
     не признак: узкое окно ноутбука должно получать видео. */
  if (!window.matchMedia('(pointer: fine) and (hover: hover) and (min-width: 640px)').matches) return 'off'
  if (navigator.maxTouchPoints > 1) return 'off'
  return 'full'
}
