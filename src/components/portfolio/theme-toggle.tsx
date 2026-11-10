"use client";

// 📖 Docs: obsidian/frontend/i18n-theme.md

import { useSyncExternalStore } from "react";

import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/lib/i18n";

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

const subscribeTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};

export interface ThemeToggleProps {
  toDark: string;
  toLight: string;
}

/**
 * Light / dark. The choice is written on `<html data-theme>` and remembered;
 * `PREFERENCES_SCRIPT` re-applies it before the next visit's first paint.
 */
export const ThemeToggle = ({ toDark, toLight }: ThemeToggleProps) => {
  // `<html data-theme>` is the state: the inline script may have set it before
  // hydration, so it is read from the document rather than kept in React.
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => DEFAULT_THEME);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage is blocked: the theme still changes for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? toLight : toDark}
      className="group flex size-10 items-center justify-center border border-line transition-colors duration-[var(--duration-fast)] ease-entrance hover:border-foreground"
    >
      {/* Half ink, half ground: the mark of the theme you would switch to. */}
      <span aria-hidden="true" className="flex size-4 border border-foreground">
        <span className="h-full w-1/2 bg-foreground" />
      </span>
    </button>
  );
};
