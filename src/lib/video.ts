/* Скролл-видео «ЭКСПЕРТ»: нативный <video> по кадрам + кроссфейд соседних кадров.

   Движок: обычный приостановленный <video> и один активный seek — браузер сам
   держит буферы, вместо 361 ImageBitmap в GPU (замер: 3072 МБ против 206 МБ,
   628 выгрузок на диск против нуля на M1/8 ГБ).
   Кино: между кадрами исходника картинка перетекает, а не переключается
   ступенькой. Снимок уходящего кадра лежит на canvas поверх видео, и его
   прозрачность гасит композитор — main thread за это не платит.
   Ролик 24 fps: на медленном ходу кадр живёт 3–4 такта экрана, и без фейда
   это читается как слайд-шоу (замер: 228 обновлений против 798 с фейдом). */
export const HERO_VIDEO_FPS = 24
export const HERO_VIDEO_SOURCES = {
  desktop: '/assets/hero/hero-scroll-desktop.mp4',
  mobile: '/assets/hero/hero-scroll-mobile.mp4',
  poster: '/assets/hero/poster.jpg',
} as const

/* Верхняя граница фейда: длиннее — заметное двоение на быстрой прокрутке. */
const MAX_FADE_MS = 55
/* Короче четверти такта экрана фейд не даёт ничего, кроме работы. */
const MIN_FADE_MS = 6

export type VideoScrubber = {
  setProgress: (progress: number) => void
  dispose: () => void
}

type Hooks = {
  onReady: () => void
  onError: () => void
  /* Вызывается ПЕРЕД сменой позиции: снять уходящий кадр, пока он ещё на экране. */
  onBeforeSeek?: () => void
  /* Вызывается, когда новый кадр реально показан; ms — сколько гасить снимок. */
  onPresented?: (fadeMs: number) => void
}

export function createVideoScrubber(video: HTMLVideoElement, callbacks: Hooks): VideoScrubber {
  let progress = 0
  let raf = 0
  let seeking = false
  let disposed = false
  let watchdog = 0
  let presented = false
  let rvfc = 0
  let lastPresentAt = 0
  /* Интервал между показами кадров — по нему подбираем длину фейда:
     быстрая прокрутка даёт короткий интервал и почти мгновенный фейд. */
  let presentGap = 1000 / HERO_VIDEO_FPS

  const frameDuration = 1 / HERO_VIDEO_FPS
  const targetTime = () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return 0
    /* Не сикать в саму duration: она за последним показываемым кадром. */
    const lastFrame = Math.max(0, Math.round(video.duration * HERO_VIDEO_FPS) - 1)
    return Math.round(progress * lastFrame) * frameDuration
  }

  const fail = () => {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(raf)
    window.clearTimeout(watchdog)
    callbacks.onError()
  }

  const show = () => {
    if (presented || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return
    presented = true
    callbacks.onReady()
  }

  const flush = () => {
    raf = 0
    if (disposed || document.hidden || video.readyState < HTMLMediaElement.HAVE_METADATA) return
    if (seeking || video.seeking) return

    const target = targetTime()
    if (Math.abs(video.currentTime - target) < frameDuration / 2) {
      show()
      return
    }

    /* Снимок уходящего кадра — до того, как декодер подменит картинку */
    if (presented) callbacks.onBeforeSeek?.()

    seeking = true
    try {
      video.currentTime = target
      window.clearTimeout(watchdog)
      watchdog = window.setTimeout(() => {
        if (!video.seeking && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          seeking = false
          schedule()
        } else {
          fail()
        }
      }, 12_000)
    } catch {
      seeking = false
      fail()
    }
  }

  const schedule = () => {
    if (!disposed && !raf && !document.hidden) raf = requestAnimationFrame(flush)
  }

  const seeked = () => {
    seeking = false
    window.clearTimeout(watchdog)
    show()
    /* Всегда переспрашиваем цель: рука могла уехать, пока шёл предыдущий seek */
    schedule()
  }

  /* Момент, когда кадр реально отдан композитору, — единственная честная точка
     для старта фейда. `seeked` про это ничего не знает. */
  type FrameCb = (now: number, meta: { mediaTime: number }) => void
  const rv = video as HTMLVideoElement & {
    requestVideoFrameCallback?: (cb: FrameCb) => number
    cancelVideoFrameCallback?: (id: number) => void
  }
  const onFrame: FrameCb = (now) => {
    if (disposed) return
    if (lastPresentAt) {
      const gap = now - lastPresentAt
      /* Сглаживаем, иначе один тяжёлый кадр раздувает фейд для всех следующих */
      presentGap = presentGap * 0.6 + Math.min(gap, 400) * 0.4
    }
    lastPresentAt = now
    const fade = Math.max(MIN_FADE_MS, Math.min(MAX_FADE_MS, presentGap * 0.9))
    callbacks.onPresented?.(fade)
    if (rv.requestVideoFrameCallback) rvfc = rv.requestVideoFrameCallback(onFrame)
  }
  if (rv.requestVideoFrameCallback) rvfc = rv.requestVideoFrameCallback(onFrame)

  const visibilityChanged = () => {
    video.pause()
    if (document.hidden) {
      cancelAnimationFrame(raf)
      raf = 0
    } else {
      schedule()
    }
  }

  const loaded = () => {
    video.pause()
    schedule()
  }

  video.addEventListener('loadedmetadata', loaded)
  video.addEventListener('loadeddata', loaded)
  video.addEventListener('canplay', schedule)
  video.addEventListener('seeked', seeked)
  video.addEventListener('error', fail)
  document.addEventListener('visibilitychange', visibilityChanged)

  return {
    setProgress(value) {
      progress = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
      schedule()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      window.clearTimeout(watchdog)
      if (rvfc && rv.cancelVideoFrameCallback) rv.cancelVideoFrameCallback(rvfc)
      video.pause()
      video.removeEventListener('loadedmetadata', loaded)
      video.removeEventListener('loadeddata', loaded)
      video.removeEventListener('canplay', schedule)
      video.removeEventListener('seeked', seeked)
      video.removeEventListener('error', fail)
      document.removeEventListener('visibilitychange', visibilityChanged)
    },
  }
}
