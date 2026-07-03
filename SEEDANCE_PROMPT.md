# Seedance 2.0 — промт для hero-ролика ЭКСПЕРТ

## Как генерировать
- Режим **image-to-video**, референс — фото ведра ЭКСПЕРТ, **вес референса максимальный** (иначе этикетку/логотип «поплывёт»).
- Формат: **9:16 vertical** для мобильного hero ИЛИ **16:9** для десктопа. Лучше сгенерировать оба.
- Если движок даёт настройку — **seamless loop** включить.
- Грузить ровно одно ведро; в Negative уже стоит запрет на лишние объекты.

---

## Вариант А — единый ролик (5 сцен)

Ultra photorealistic premium commercial for a professional parquet adhesive.

Use the uploaded CASPOL «ЭКСПЕРТ» adhesive bucket as the exact product reference. Do not redesign the packaging, logo, typography or proportions. Keep the product identical to the reference — white body, black lid, gold champagne label, serif «ЭКСПЕРТ» wordmark must stay razor-sharp and unchanged.

Style: luxury product film, Apple keynote aesthetic, Porsche and Dyson cinematic advertising, macro product cinematography, physically-based realism, no CGI appearance.

Color & light: warm champagne key light, soft warm-white studio, glossy black reflective surface with a subtle gold rim light. Neutral-warm color grade, deep blacks, warm gold highlights. NOT blue, NOT teal, NOT purple.

Scene 1 — Hero shot: the bucket stands alone on glossy black. Very slow cinematic dolly, soft volumetric warm haze, beautiful reflections on the plastic, floating microscopic dust motes, shallow depth of field, 100mm macro lens. Minimal, elegant, expensive.

Scene 2 — Lid opening: without any visible hands, the black lid slowly unlocks with satisfying mechanical precision. Camera eases closer. The adhesive inside is smooth, dense, creamy beige with realistic soft reflections; tiny surface movements make the material feel alive.

Scene 3 — Glue pour: the bucket slowly tilts, thick highly viscous beige adhesive pours out, stretching into elegant ribbons before settling. No splashes, no exaggerated motion. Ultra realistic fluid simulation, real-world physics, macro closeups of the flowing adhesive.

Scene 4 — Spreading: a professional notched trowel enters frame and spreads the glue into perfectly parallel ridges. Very satisfying slow-motion movement, macro texture detail, soft warm studio reflections on every ridge.

Scene 5 — Parquet: a premium warm oak plank slowly lowers onto the adhesive, perfect alignment, camera follows from above, a subtle press locks it into place. Precise, premium, engineered.

Final shot: camera continues forward until the oak floor fills the whole frame, product leaves frame behind camera, warm gold reflections remain, minimal luxury lighting. Hold the final frame for several seconds on a clean floor — leave calm negative space at the top for a headline.

Camera: ARRI Alexa 65, Cooke anamorphic lenses, macro cinematography, ultra-smooth motion-control slider, slow dolly, no handheld movement.

Lighting: luxury studio lighting, soft warm volumetric haze, real reflections, global illumination, ray-traced reflections.

Rendering: photorealistic, maximum realism, film quality, 8K, hyper-detailed materials, physically accurate fluid simulation, no CGI appearance. Seamless loop, first and last frame match. Seamless dark background, no visible floor edges until Scene 5.

Mood: premium, industrial, confident, elegant, minimal.

Negative prompt: cartoon, CGI look, game graphics, Unreal Engine look, plastic-toy materials, blue tint, teal, purple, neon, oversaturated colors, unrealistic glue, fast movement, shaky camera, low detail, watermark, text artifacts, distorted logo, warped label, extra objects, extra buckets, hands, workers, construction site, cheap lighting, low quality.

---

## Вариант Б — 5 отдельных клипов (под скролл)

Общая шапка для КАЖДОГО клипа (вставлять в начало):

> Ultra photorealistic premium product film of the uploaded CASPOL «ЭКСПЕРТ» adhesive bucket. Keep packaging, gold label and serif logo identical and sharp. Apple-keynote aesthetic, macro cinematography, ARRI Alexa 65, Cooke lenses, slow motion-control dolly, no handheld. Warm champagne studio light, glossy black surface, gold rim light, deep blacks, warm grade — NOT blue/teal/purple. Photorealistic, no CGI look, 8K, seamless loop. 9:16 vertical.
> Negative: cartoon, CGI, blue tint, teal, purple, warped logo, distorted label, text artifacts, hands, workers, extra buckets, shaky camera, low quality.

**Клип 1 — Витрина (≈3 c):** bucket stands alone on glossy black, closed. Very slow dolly-in, floating dust motes, shallow DOF, soft reflections. Calm, minimal, expensive.

**Клип 2 — Вскрытие (≈3 c):** the black lid slowly lifts and detaches without hands, revealing smooth creamy beige adhesive with subtle living surface movement. Camera eases closer.

**Клип 3 — Пролив (≈4 c):** bucket tilts, thick viscous beige glue pours in elegant ribbons, settles with no splashes. Ultra-realistic fluid sim, macro on the stream.

**Клип 4 — Нанесение (≈3 c):** notched trowel spreads the glue into perfectly parallel ridges, slow motion, macro texture, warm reflections on each ridge.

**Клип 5 — Укладка + пол (≈4 c):** a warm oak plank lowers onto the ridged glue, aligns, presses into place; camera pulls up until the oak floor fills frame, clean top space for a headline, warm reflections remain. Hold.

---

## Что прислать мне
- Готовые файлы клади в `~/Downloads/expert/` (mp4 или webm).
- Именуй: `hero-1.mp4 … hero-5.mp4` (по сценам) или `hero-full.mp4` (единый).
- Если будет вертикаль и горизонталь — добавь суффикс `-9x16` / `-16x9`.
- Я порежу/сожму (H.264 + WebM), поставлю постеры и привяжу таймлайн видео к прогрессу скролла вместо текущих SVG-заглушек.
