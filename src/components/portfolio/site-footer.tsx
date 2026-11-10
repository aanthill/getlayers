// 📖 Docs: obsidian/frontend/components/portfolio.md

import type { PortfolioContent } from "@/data/portfolio";

import { SectionLink } from "./section-link";
import { TransitionLink } from "./transition-link";

export interface SiteFooterProps {
  content: PortfolioContent;
  year: number;
}

const LINK =
  "transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-emphasis";

export const SiteFooter = ({ content, year }: SiteFooterProps) => (
  <footer className="type-label flex w-full flex-wrap items-center justify-between gap-4 border-t border-line px-4 pb-24 pt-6 text-muted lg:px-8 lg:pb-6">
    <p>
      © {year} {content.person.name} · {content.footer.rights}
    </p>
    <ul className="flex gap-6">
      <li>
        <TransitionLink href="/privacy-policy" className={LINK}>
          {content.footer.privacy}
        </TransitionLink>
      </li>
      <li>
        <SectionLink target="top" className={LINK}>
          {content.footer.top} ↑
        </SectionLink>
      </li>
    </ul>
  </footer>
);
