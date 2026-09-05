import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import { asset } from '@/lib/utils'
import { createVideoScrubber, HERO_VIDEO_SOURCES, type VideoScrubber } from '@/lib/video'

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string }
type MediaNavigator = Navigator & { deviceMemory?: number; connection?: Connection }

type ScrollVideoProps = {
  /* 0–1 от обычной прокрутки страницы; та же величина кормит и подписи */
  progress: MotionValue<number>
  enabled: boolean
  className?: string
}

/* Декоративная сцена. Постер лежит под видео и остаётся при отказе или запрете. */
export function ScrollVideo({ progress, enabled, className = '' }: ScrollVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadeRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const root = rootRef.current
    const canvas = fadeRef.current
    if (!video || !root || !canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const smallScreen = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const nav = navigator as MediaNavigator
    let scrubber: VideoScrubber | undefined
    let currentSource = ''
    let disposed = false

    /* Снимок уходящего кадра. Держим ОДИН холст в разрешении ролика: 8 МБ против
       трёх гигабайт полного кеша, а object-fit тот же, что у видео, — значит
       снимок ложится пиксель в пиксель и подмены не видно. */
    const ctx = canvas.getContext('2d', { alpha: false })
    let fadeAnim: Animation | undefined
    let armed = false

    const grab = () => {
      if (!ctx || disposed || video.videoWidth === 0) return
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      } catch {
        return /* кадр ещё не готов — просто обойдёмся без фейда */
      }
      fadeAnim?.cancel()
      canvas.style.opacity = '1'
      armed = true
    }

    const fade = (ms: number) => {
      if (!armed || disposed) return
      armed = false
      /* Гасит композитор: main thread во время прокрутки этим не занят */
      fadeAnim?.cancel()
      fadeAnim = canvas.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: ms, easing: 'linear', fill: 'forwards' },
      )
    }

    const unload = () => {
      scrubber?.dispose()
      scrubber = undefined
      fadeAnim?.cancel()
      armed = false
      canvas.style.opacity = '0'
      video.style.opacity = '0'
      video.pause()
      /* Обрывает сеть и декодер при выключении, размонтировании и HMR */
      video.removeAttribute('src')
      video.load()
      currentSource = ''
    }

    const syncPolicy = () => {
      if (disposed) return
      const conserveData =
        nav.connection?.saveData ||
        ['slow-2g', '2g'].includes(nav.connection?.effectiveType ?? '')
      const canAnimate = enabled && !reducedMotion.matches && !conserveData
      if (!canAnimate) {
        unload()
        root.dataset.videoState = 'poster'
        root.dataset.videoQuality = 'poster'
        return
      }

      const quality =
        smallScreen.matches || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4)
          ? 'mobile'
          : 'desktop'
      const source = asset(HERO_VIDEO_SOURCES[quality])
      if (currentSource === source) return
      unload()
      currentSource = source
      root.dataset.videoState = 'loading'
      root.dataset.videoQuality = quality
      scrubber = createVideoScrubber(video, {
        onReady: () => {
          if (disposed) return
          video.style.opacity = '1'
          root.dataset.videoState = 'ready'
        },
        onError: () => {
          if (disposed) return
          video.style.opacity = '0'
          canvas.style.opacity = '0'
          root.dataset.videoState = 'fallback'
          video.pause()
          video.removeAttribute('src')
          video.load()
        },
        onBeforeSeek: grab,
        onPresented: fade,
      })
      video.preload = 'auto'
      video.src = source
      video.load()
      scrubber.setProgress(progress.get())
    }

    const unsubscribe = progress.on('change', (value) => scrubber?.setProgress(value))
    reducedMotion.addEventListener('change', syncPolicy)
    smallScreen.addEventListener('change', syncPolicy)
    nav.connection?.addEventListener('change', syncPolicy)
    syncPolicy()

    return () => {
      disposed = true
      unsubscribe()
      reducedMotion.removeEventListener('change', syncPolicy)
      smallScreen.removeEventListener('change', syncPolicy)
      nav.connection?.removeEventListener('change', syncPolicy)
      unload()
    }
  }, [enabled, progress])

  const mediaStyle = {
    position: 'absolute' as const,
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    objectPosition: 'var(--hero-video-position, center)',
  }

  return (
    <div
      ref={rootRef}
      className={className}
      aria-hidden="true"
      data-video-state="poster"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      <img
        src={asset(HERO_VIDEO_SOURCES.poster)}
        alt=""
        width="1920"
        height="1080"
        fetchPriority="high"
        decoding="async"
        style={mediaStyle}
      />
      <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        style={{ ...mediaStyle, opacity: 0 }}
      />
      {/* Уходящий кадр поверх нового: даёт непрерывность на медленном ходу */}
      <canvas
        ref={fadeRef}
        aria-hidden="true"
        style={{ ...mediaStyle, opacity: 0, willChange: 'opacity' }}
      />
    </div>
  )
}
