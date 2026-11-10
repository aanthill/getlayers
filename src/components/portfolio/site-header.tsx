// 📖 Docs: obsidian/frontend/components/portfolio.md

import type { PortfolioContent } from "@/data/portfolio";

import { LanguageSwitch } from "./language-switch";
import { SectionLink } from "./section-link";
import { ThemeToggle } from "./theme-toggle";

export interface SiteHeaderProps {
  content: PortfolioContent;
}

const LINK =
  "type-label transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-emphasis";

/**
 * The fixed bar — name, section links, language and theme — and, on phones,
 * the same three links as a dock under the thumb. Every section is one tap
 * away from anywhere on the page.
 */
export const SiteHeader = ({ content }: SiteHeaderProps) => {
  const { nav, person, locale } = content;
  const links = [
    { target: "work", label: nav.work },
    { target: "about", label: nav.about },
    { target: "contact", label: nav.contact },
  ];
  return (
    <>
      <a
        href="#work"
        className="type-label fixed left-4 top-2 z-50 -translate-y-20 bg-accent px-3 py-2 text-accent-contrast focus-visible:translate-y-0"
      >
        {nav.skip}
      </a>
      <header
        data-site-bar
        className="fixed inset-x-0 top-0 z-40 flex h-bar items-center justify-between gap-4 border-b border-line bg-background px-4 lg:px-8"
      >
        <SectionLink target="top" className="type-display text-lead leading-display">
          {person.name}
        </SectionLink>
        <nav aria-label={nav.label} className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <SectionLink key={link.target} target={link.target} className={LINK}>
              {link.label}
            </SectionLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch current={locale} label={nav.language} switchTo={nav.switchTo} />
          <ThemeToggle toDark={nav.themeToDark} toLight={nav.themeToLight} />
        </div>
      </header>
      <nav
        aria-label={nav.label}
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {links.map((link) => (
          <SectionLink
            key={link.target}
            target={link.target}
            className={`${LINK} flex h-dock items-center justify-center border-l border-line first:border-l-0`}
          >
            {link.label}
          </SectionLink>
        ))}
      </nav>
    </>
  );
};
