import { useEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.js'
import { asset } from '@/lib/utils'

/* ----------------------------------------------------------------------------
   Скролл-кино «ЭКСПЕРТ»: ролик Higgsfield 1080p, скраб через ScrollyVideo —
   WebCodecs декодирует кадры заранее и рисует на canvas в полном качестве,
   перемотка сглаживается встроенной анимацией. Fallback для Safari — video.
---------------------------------------------------------------------------- */

const VIDEO_SRC = asset('/assets/hero/hero.mp4')
const POSTER_SRC = asset('/assets/hero/poster.jpg')

/* Подписи кадров поверх сцены */
function StageCaption({
  progress,
  at,
  eyebrow,
  children,
  className = '',
}: {
  progress: MotionValue<number>
  at: [number, number, number, number]
  eyebrow: string
  children: React.ReactNode
  className?: string
}) {
  const opacity = useTransform(progress, at, [0, 1, 1, 0])
  const ty = useTransform(progress, [at[0], at[1]], [26, 0])
  return (
    <motion.div
      style={{ opacity, y: ty }}
      className={`pointer-events-none absolute z-30 max-w-[22rem] ${className}`}
    >
      <p className="eyebrow mb-3 !text-gold-300">{eyebrow}</p>
      <p className="font-display text-2xl leading-snug text-[#f6efe0] drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)] md:text-3xl">
        {children}
      </p>
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  /* Спринг — только для текстовых оверлеев */
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.35 })

  /* ScrollyVideo: WebCodecs-декодер рисует кадры 1080p на canvas, скраб без лагов */
  useEffect(() => {
    if (reduced) return
    const el = playerRef.current
    if (!el) return
    const sv = new ScrollyVideo({
      src: VIDEO_SRC,
      scrollyVideoContainer: el,
      trackScroll: false,
      sticky: false,
      full: false,
      cover: true,
      useWebCodecs: true,
      transitionSpeed: 12,
    })
    /* Свой рендер-цикл: lerp-догон + прямая отрисовка кадров WebCodecs.
       Их анимацию не используем — setTargetTimePercent не отменяет прошлые rAF
       и при частых вызовах переходы дерутся между собой. */
    let raf = 0
    let current: number | null = null
    let lastFrame = -1
    let lastSeek = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const target = Math.min(0.999, Math.max(0, scrollYProgress.get()))
      if (current === null) current = target
      current += (target - current) * 0.16
      if (Math.abs(target - current) < 0.0004) current = target

      if (sv.frames.length && sv.frameRate) {
        /* WebCodecs готов: рисуем кадр сами, 60fps */
        const frame = Math.min(
          sv.frames.length - 1,
          Math.round(current * (sv.frames.length - 1)),
        )
        if (frame !== lastFrame) {
          sv.currentTime = frame / sv.frameRate
          sv.targetTime = sv.currentTime
          sv.paintCanvasFrame(frame)
          lastFrame = frame
        }
      } else if (now - lastSeek > 120) {
        /* Кадры ещё декодируются (или Safari): редкие точные сики видео */
        lastSeek = now
        sv.setVideoPercentage(current, { jump: true })
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      sv.destroy()
    }
  }, [scrollYProgress, reduced])

  /* Интро поверх тёмного первого кадра: гаснет при первом же движении */
  const introOpacity = useTransform(progress, [0, 0.06], [1, 0])
  const introY = useTransform(progress, [0, 0.06], [0, -40])
  const hintOpacity = useTransform(progress, [0, 0.045], [1, 0])

  /* Финал: затемнение пола + CTA */
  const finalOpacity = useTransform(progress, [0.88, 0.96], [0, 1])
  const finalY = useTransform(progress, [0.88, 0.96], [40, 0])
  const scrimOpacity = useTransform(progress, [0.86, 0.96], [0, 0.55])

  if (reduced) {
    return (
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="text-center">
          <p className="eyebrow mb-4">Линейка CASPOL для профессионалов</p>
          <h1 className="label-caps text-5xl md:text-7xl">Эксперт</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Клей для паркета. Пять формул для дилеров и дистрибьюторов.
          </p>
          <img src={POSTER_SRC} alt="Ведро клея ЭКСПЕРТ" className="mx-auto mt-10 w-full max-w-xl rounded-2xl" />
          <a href="#dealer" className="mt-10 inline-block rounded-full bg-ink px-8 py-4 font-semibold text-paper">
            Стать дилером
          </a>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} aria-label="ЭКСПЕРТ — клей для паркета" className="relative h-[520vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#14100b]">
        {/* Видео-сцена (ScrollyVideo монтирует внутрь canvas/video) */}
        <div
          ref={playerRef}
          aria-hidden
          className="absolute inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:object-cover [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
          style={{ backgroundImage: `url(${POSTER_SRC})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Интро: светлый заголовок в воздухе тёмной студии, над ведром */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-x-0 top-[12vh] z-30 px-6 text-center md:top-[13vh]"
        >
          <p className="eyebrow mb-3 !text-gold-300">Каспол · Дзержинск · линейка для профессионалов</p>
          <h1 className="label-caps text-[clamp(2.6rem,7vw,4.8rem)] leading-none text-[#f6efe0] drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
            Эксперт
          </h1>
          <div className="mx-auto mt-4 flex max-w-md items-center gap-4">
            <div className="hairline-gold flex-1" />
            <p className="label-caps text-sm text-gold-100 md:text-base">Клей для паркета</p>
            <div className="hairline-gold flex-1" />
          </div>
        </motion.div>

        {/* Подсказка скролла */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
        >
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-gold-200/80">
            листайте — ведро откроется
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="mx-auto mt-3 h-9 w-5 rounded-full border border-gold-400/60"
          >
            <div className="mx-auto mt-1.5 h-2 w-[3px] rounded bg-gold-500" />
          </motion.div>
        </motion.div>

        {/* Подписи кадров — тайминг синхронизирован со сценами ролика */}
        <StageCaption
          progress={progress}
          at={[0.22, 0.28, 0.38, 0.44]}
          eyebrow="Вскрытие"
          className="left-[6vw] top-[18vh] md:left-[9vw] md:top-[24vh]"
        >
          Пять формул. Один стандарт&nbsp;— профессиональный.
        </StageCaption>
        <StageCaption
          progress={progress}
          at={[0.48, 0.54, 0.62, 0.68]}
          eyebrow="Нанесение"
          className="right-[6vw] top-[18vh] text-right md:right-[9vw] md:top-[22vh]"
        >
          Тиксотропная паста без воды и&nbsp;растворителей. Шпатель B3–B15.
        </StageCaption>
        <StageCaption
          progress={progress}
          at={[0.72, 0.78, 0.84, 0.88]}
          eyebrow="Укладка"
          className="left-[6vw] top-[18vh] md:left-[9vw] md:top-[22vh]"
        >
          Держит всё: от штучного паркета до массива и&nbsp;экзотики.
        </StageCaption>

        {/* Затемнение под финальный текст */}
        <motion.div
          style={{ opacity: scrimOpacity }}
          className="absolute inset-0 z-20 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/70"
          aria-hidden
        />

        {/* Финал + CTA */}
        <motion.div
          style={{ opacity: finalOpacity, y: finalY }}
          className="absolute inset-x-0 top-[26vh] z-30 px-6 text-center"
        >
          <h2 className="mx-auto max-w-3xl text-4xl text-[#f6efe0] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] md:text-6xl">
            Продавайте клей, которому доверяют укладчики
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#e8e0cf] drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)]">
            Закрытая линейка для дилеров и дистрибьюторов. Производство — Дзержинск,
            отгрузка за 1–2 дня.
          </p>
          <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#dealer"
              className="rounded-full bg-gold-400 px-9 py-4 font-semibold text-ink shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] transition hover:bg-gold-300"
            >
              Стать дилером
            </a>
            <a
              href="#products"
              className="rounded-full border border-gold-300/70 bg-ink/30 px-9 py-4 font-semibold text-[#f6efe0] backdrop-blur transition hover:bg-ink/50"
            >
              Смотреть линейку
            </a>
          </div>
          <p className="label-caps mt-8 text-[0.72rem] tracking-[0.3em] text-gold-200">
            Экологичный · Надежный · Профессиональный
          </p>
        </motion.div>
      </div>
    </section>
  )
}
