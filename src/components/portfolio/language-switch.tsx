"use client";

// 📖 Docs: obsidian/frontend/i18n-theme.md

import { LANG_STORAGE_KEY, LOCALE_HOME, LOCALES, type Locale } from "@/lib/i18n";

import { TransitionLink } from "./transition-link";

export interface LanguageSwitchProps {
  current: Locale;
  /** Names the group — "Language". */
  label: string;
  /** Names the link to the other language, in that language. */
  switchTo: string;
}

/** EN / ES. The choice is remembered, so the next visit opens in it. */
export const LanguageSwitch = ({ current, label, switchTo }: LanguageSwitchProps) => {
  const remember = (locale: Locale) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, locale);
    } catch {
      // Storage is blocked: the link still works.
    }
  };
  return (
    <div role="group" aria-label={label} className="type-label flex items-center border border-line">
      {LOCALES.map((locale) =>
        locale === current ? (
          <span
            key={locale}
            aria-current="true"
            className="flex h-10 items-center bg-foreground px-3 text-background"
          >
            {locale}
          </span>
        ) : (
          <TransitionLink
            key={locale}
            href={LOCALE_HOME[locale]}
            hrefLang={locale}
            lang={locale}
            aria-label={switchTo}
            onClick={() => remember(locale)}
            className="flex h-10 items-center px-3 text-muted transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-foreground"
          >
            {locale}
          </TransitionLink>
        ),
      )}
    </div>
  );
};
