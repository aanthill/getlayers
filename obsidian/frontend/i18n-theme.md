---
tags: [frontend, i18n, theme, stable]
updated: 2026-11-10
---

# Languages and theme

## Languages — English (default) and Spanish

| | English | Spanish |
|---|---|---|
| URL | `/` | `/es` |
| Root layout | `src/app/(en)/layout.tsx` | `src/app/(es)/layout.tsx` |
| Robot form | `/robot-view` | `/robot-view/es` |
| Copy | `src/data/portfolio/en.ts` | `src/data/portfolio/es.ts` |

- **Two root layouts** (route groups), both rendering `SiteDocument`
  (`src/layouts/site-document.tsx`) with their `lang` — so `<html lang>` is in
  the served HTML and nothing reads the request (hard rule #15). ADR-0033.
  An unmatched URL belongs to neither layout: `src/app/global-not-found.tsx`
  serves the 404 (`experimental.globalNotFound` in `next.config.ts`).
- `src/lib/i18n.ts` — `LOCALES`, `LOCALE_HOME`, `OG_LOCALE`, the storage keys
  and `PREFERENCES_SCRIPT`. Plain data, client-safe.
- **Every string** the page shows comes from the language's content file
  (`getPortfolioContent(lang)`); both files have the same shape
  (`PortfolioContent`). A change to one is a change to both.
- hreflang and the sitemap's alternates come from `ROUTES[].alternates`
  (`src/lib/routes.ts`); `homeMetadata(lang)` (`src/views/home-metadata.ts`)
  builds each version's `<head>` — canonical to itself, `og:locale`, the
  Spanish title and description.
- The proxy rewrites a robot on `/` or `/es` to that language's robot form and
  **never redirects by language**.
- **Remembering the choice.** `<LanguageSwitch>` writes `localStorage.lang`;
  `PREFERENCES_SCRIPT` (inline, before paint) sends a visitor who saved `es`
  from the bare `/` to `/es`. Only a saved choice redirects — never the
  browser's language — and a robot has no storage, so every version answers
  200 as linked. A link straight to `/es` is never overridden.
- The privacy policy exists in English only (`/privacy-policy`).

## Theme — dark by default

- `:root` holds the **dark** values of the Tier 2 tokens; `[data-theme="light"]`
  overrides them ([[design-system]]). There is no `prefers-color-scheme` block:
  the site opens dark unless the visitor chose otherwise.
- The server always renders `<html data-theme="dark">`; `PREFERENCES_SCRIPT`
  applies a saved `localStorage.theme` before the first paint (no flash).
- `<ThemeToggle>` reads the attribute with `useSyncExternalStore` (the
  attribute is the state), writes it and saves it.
- The hero scene re-reads the tokens when the attribute changes.

## Related

[[routing]] · [[robot-form]] · [[seo-metadata]] · [[components/portfolio]] · skill `i18n-seo`
