/* Предохранитель для WebCodecs-скраба (см. landing-craft/assets/canScrubVideo.ts).
   Декодер держит КАЖДЫЙ кадр ролика в памяти как ImageBitmap: 361 × 1920 × 1080 × 4 байта ≈ 2,85 ГБ.
   На телефоне это роняет вкладку, на слабом десктопе — свопит. Поэтому:
   · телефоны/планшеты (грубый указатель, нет hover, несколько точек касания) — статичный постер;
   · deviceMemory < 4 ГБ, save-data, reduced-motion, нет WebCodecs — статичный постер;
   · deviceMemory 4–7 ГБ — каждый второй кадр (≈1,4 ГБ), блендинг прикрывает разреженность;
   · иначе — полный набор. */
export const HERO_VIDEO = { width: 1920, height: 1080, frames: 361 } as const

export type ScrubMode = 'full' | 'half' | 'off'

export function scrubMode(): ScrubMode {
  if (typeof window === 'undefined') return 'off'
  const w = window as Window & { VideoDecoder?: unknown }
  if (typeof w.VideoDecoder !== 'function') return 'off'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return 'off'
  /* Телефоны и планшеты: грубый указатель, нет hover или несколько точек касания
     (iPad с трекпадом отдаёт pointer: fine, но maxTouchPoints > 1). Ширина окна —
     не признак: узкое окно ноутбука должно получать видео. */
  if (!window.matchMedia('(pointer: fine) and (hover: hover) and (min-width: 640px)').matches) return 'off'
  if (navigator.maxTouchPoints > 1) return 'off'
  const mem = nav.deviceMemory // только Chromium, квантовано до 0.25…8
  if (typeof mem === 'number' && mem < 4) return 'off'
  if (typeof mem === 'number' && mem < 8) return 'half'
  return 'full'
}
