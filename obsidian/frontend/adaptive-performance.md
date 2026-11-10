---
tags: [frontend, performance, stable]
updated: 2026-11-10
---

# Adaptive performance — device tiers

The design is the same on every device; what changes is how much it costs to
draw. `src/lib/device-tier.ts` reads what the browser reports and picks a tier
once, after hydration (`<DeviceTierProbe>` → `useDeviceTier()`,
`src/hooks/use-device-tier.ts`). ADR-0031.

| Tier | Who | Hero scene | Cursor, 3D tilt |
|------|-----|-----------|-----------------|
| 0 | reduced motion · data saver · 2G · ≤ 2 cores or ≤ 1 GB · a scene that measured too slow | the still (no three.js download) | off |
| 1 | phones, tablets, anything under 1024 px, laptops with ≤ 4 cores or ≤ 4 GB | 16 × 16 bars, DPR ≤ 1.5 | off |
| 2 | a standard laptop | 30 × 30 bars, DPR ≤ 1.5 | on |
| 3 | ≥ 8 cores and ≥ 8 GB, fine pointer | 44 × 44 bars, DPR ≤ 2, 480 particles | on |

## The signals

- `prefers-reduced-motion` → tier 0 (and react-spring's `skipAnimation`, via
  `<ReducedMotion>`).
- `navigator.connection.saveData` / `effectiveType` (`slow-2g`, `2g`) → tier 0:
  the scene's code is not worth the download.
- `navigator.hardwareConcurrency`, `navigator.deviceMemory` — absent in Safari
  and Firefox, where 4 / 4 is assumed (tier 1 on a laptop, never 0).
- `(pointer: coarse)` and the viewport width → at most tier 1.
- `navigator.getBattery()` (Chromium only — the one place a power-saving state
  is detectable): unplugged at ≤ 20 % → one tier down.
- **Measured frame rate.** The scene counts its own ticks; under 40 fps for two
  2-second windows in a row it lowers its cost — pixel ratio first, then bars
  (the field is built centre-out, so `instanceCount` shrinks its edge) — and at
  the floor it calls `onSlow`, which sets tier 0 for the visit.

`tier` is `null` on the server and on the first client render: nothing may
decide **markup** on it before the probe has run (hydration mismatch). Effects
and handlers read it freely.

## Rules this follows

No fixed frame cap on phones, per-frame steps scaled by `dt`, the draw gate on
desktop only, context-loss recovery — [[webgl-scenes]], `.claude/rules/scenes.md`.
Heavy media is lazy: screenshots are `next/image` with `loading="lazy"` and
real `sizes`; text engines below the fold mount near the viewport (`lazy`).

## Related

[[components/portfolio]] · [[webgl-scenes]] · [[optimize-3d-scene]] · [[testing-pipeline]]
