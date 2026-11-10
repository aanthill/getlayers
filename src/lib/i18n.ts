// 📖 Docs: obsidian/frontend/i18n-theme.md

/**
 * The site's languages. Plain data — client-safe.
 *
 * English is the default and lives unprefixed (`/`); Spanish lives under
 * `/es`. Each language has its own root layout (`app/(en)`, `app/(es)`) so
 * `<html lang>` is right in the served HTML without reading the request.
 */
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** The home path of each language. */
export const LOCALE_HOME: Record<Locale, `/${string}`> = { en: "/", es: "/es" };

/** `og:locale` per language. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_ES" };

/** `localStorage` keys for the visitor's saved choices. */
export const LANG_STORAGE_KEY = "lang";
export const THEME_STORAGE_KEY = "theme";

export type Theme = "dark" | "light";
export const DEFAULT_THEME: Theme = "dark";

/**
 * Runs before the first paint, in `<body>`: applies the saved theme, and sends
 * a returning visitor who chose Spanish from the bare `/` to `/es`. Only a
 * saved choice redirects — never the browser's language, and never a robot
 * (it has no storage), so every version stays reachable as linked.
 */
export const PREFERENCES_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")d.dataset.theme=t;if(localStorage.getItem("${LANG_STORAGE_KEY}")==="es"&&location.pathname==="/")location.replace("/es"+location.hash)}catch(e){}})()`;
