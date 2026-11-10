---
tags: [frontend, components, stable]
updated: 2026-11-10
---

# Catalog — Portfolio components

The sections of the portfolio (`src/components/portfolio/`). The view
(`src/views/home.tsx`, a Server Component) composes them and hands each its
slice of the language's content — no component holds copy. Client leaves live
here rather than in `src/views/` because `verify.sh` keeps `"use client"` out of
views.

Content: `src/data/portfolio/{en,es}.ts` (shape in `types.ts`) → see
[[i18n-theme]]. Device tiers → [[adaptive-performance]].

| File | Kind | What it is |
|------|------|-----------|
| `site-header.tsx` | server | The fixed bar (name, section links, language, theme) + the phone's bottom dock of the same three links |
| `hero.tsx` | client | Name at full size (at rest in the HTML — it is the LCP), role, one sentence, and the **project index**: every project one click from the first paint |
| `hero-scene.tsx` | client | The 3D field's box: the SVG still, and the live three.js scene when the tier asks for it |
| `kinetic-band.tsx` | client | A band of type that slides with the scroll (`SpringTrigger` scrub) |
| `work-gallery.tsx` | client | The projects: pinned and travelling sideways on desktop, stacked on phones and the robot form |
| `project-panel.tsx` | server | One project — number, name, summary, technologies, links, and its visual |
| `image-plate.tsx` | client | The project's image, or the moving accent plate that holds its place |
| `signal-pipeline.tsx` | client | "How it works": the path one reading takes, a pulse travelling through the stages |
| `screen-frames.tsx` | client | Real screenshots in browser / phone frames, a sideways-scrolling strip that leans to the pointer |
| `uptime-strip.tsx` | client | SiteTimeline's own example strip (60 checks, tall bars are failures), bars rising once |
| `upcoming-panel.tsx` | server | The slots for what is coming |
| `about.tsx` / `contact.tsx` | client | Short introduction (+ education when there is any) · email and profiles |
| `site-footer.tsx` | server | Copyright, privacy, back to top |
| `section-link.tsx` | client | `<SectionLink>` — a real `#anchor` that scrolls smoothly (Lenis); `scrollToProject(i)` |
| `page-curtain.tsx` / `transition-link.tsx` | client | The page transition: an accent panel covers the page while the route changes |
| `pointer-cursor.tsx` | client | The custom cursor (fine pointers, tier ≥ 2, never the robot form). The native cursor stays |
| `theme-toggle.tsx` / `language-switch.tsx` | client | [[i18n-theme]] |
| `device-tier-probe.tsx` | client | [[adaptive-performance]] |

## Adding a project

1. Append an object to `projects` in `src/data/portfolio/en.ts` **and** `es.ts`
   (same `id`). `visual: "plate"` gives the standard panel.
2. Its picture: put the file in `public/assets/projects/` and set `image`
   (`src`, `alt`, `width`, `height`). Until then the accent plate stands in.
3. Still on the way? Add `{ name, note }` to `upcoming.items` instead — it takes
   the next open slot.

Nothing else changes: the hero index, the gallery's length, the jump buttons and
the numbering all follow the data.

To give the IoT project its real image: set `image` on the
`iot-plant-monitoring` entry in both files.

## The work gallery

One section, `count × 100lvh` tall on desktop, with a sticky `100lvh` box whose
track moves `-(count-1) × 100vw` as the section scrolls past (`SpringTrigger`,
`start="top top"`, `end="bottom bottom"`). It is the page's own scroll, so the
wheel, the keyboard and the scrollbar work unchanged.

- The layout switch is CSS (`lg:`): the served HTML is the same at every width.
  Only `enabled` on the scrub is decided in JS (`useWindowWidth() >= 1024`),
  so there is no hydration mismatch.
- The class strings are **literal** — Tailwind reads the source, so a prefix
  built at runtime (`"lg:" + name`) produces no CSS. (That mistake left the
  gallery invisible for one build.)
- A link focused in an off-screen panel: `onFocus` scrolls the page to that
  panel and resets the box's `scrollLeft` (the browser scrolls a clipped box to
  reveal the focused element).
- The robot form never pins: the panels stack, all in the HTML.
- A project is a scroll *position* when pinned — `scrollToProject(index)` does
  the arithmetic; the hero index and the `01 02 03` buttons use it.

## The hero scene

`src/lib/scene/signal-field.ts` — a field of bars that swells where the pointer
is. One instanced draw call; heights, the moving bands on the bars' sides and
the swell are computed in the shaders, so a frame costs the CPU a few uniforms.

- three.js is `import()`ed inside the effect, only when the tier is ≥ 1 and the
  page is not the robot form — tier 0 and crawlers never download it.
- Built through `keepSceneAlive` + `watchContext` + `releaseContext`
  ([[webgl-scenes]]); the box is the hero itself (`min-h-lvh`, never `dvh`).
- Runs only while the hero is on screen and the tab is visible. Time in
  seconds from one `createFrameClock()`; easing by `perFrame(k, dt)`; the draw
  is gated at ~60 fps on fine pointers only (never phones).
- Resizes only on a real change of CSS size or pixel ratio, then draws at once.
- Colours come from the page's tokens (`--background`, `--foreground`,
  `--accent`) and follow the theme toggle.
- The still (`SceneStill`, an inline SVG of the same field) is what the robot
  form, reduced motion and tier 0 show, and what is on screen until the scene
  is up.

Not measured yet: no Lighthouse, scroll test or phone probe has been run on
this page (`yarn qa:setup` first). See [[testing-pipeline]].

## Related

[[adaptive-performance]] · [[i18n-theme]] · [[animation-system]] · [[webgl-scenes]] · [[robot-form]]
