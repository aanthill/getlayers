"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { Inview } from "@/components/common/robot-inview";
import { RobotText as TextEngine } from "@/components/common/robot-text";
import type { PortfolioContent } from "@/data/portfolio";

export interface ContactProps {
  copy: PortfolioContent["contact"];
}

const ROW =
  "group flex items-baseline justify-between gap-4 border-b border-foreground py-5 transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-accent hover:text-accent-contrast lg:py-7";

/** How to reach her: email first, then the profiles there are. */
export const Contact = ({ copy }: ContactProps) => {
  const profiles = [copy.github, copy.linkedin].filter(
    (profile): profile is { label: string; href: string } => Boolean(profile),
  );
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="flex w-full flex-col gap-10 border-t border-foreground px-4 py-24 lg:px-8 lg:py-32"
    >
      <TextEngine
        tag="h2"
        id="contact-title"
        lazy
        mode="once"
        overflow
        lineIn={{ y: "0%" }}
        lineOut={{ y: "100%" }}
        lineConfig={{ tension: 170, friction: 26 }}
        className="type-display text-mega leading-display tracking-mega"
      >
        {copy.title}
      </TextEngine>
      <p className="max-w-xl text-lead leading-copy">{copy.lead}</p>
      <Inview
        tag="ul"
        mode="once"
        from={{ opacity: 0, y: 24 }}
        to={{ opacity: 1, y: 0 }}
        config={{ tension: 170, friction: 26 }}
        className="border-t border-foreground"
      >
        <li>
          <a href={`mailto:${copy.email}`} className={ROW}>
            <span className="type-label w-24 pl-2">{copy.emailLabel}</span>
            <span className="type-display flex-1 break-all text-lead leading-display lg:text-title">
              {copy.email}
            </span>
            <span
              aria-hidden="true"
              className="type-label pr-2 transition-transform duration-[var(--duration-fast)] ease-entrance group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </li>
        {profiles.map((profile) => (
          <li key={profile.href}>
            <a href={profile.href} target="_blank" rel="noreferrer me" className={ROW}>
              <span className="type-label w-24 pl-2">{profile.label}</span>
              <span className="type-display flex-1 break-all text-lead leading-display lg:text-title">
                {profile.href.replace("https://", "")}
              </span>
              <span
                aria-hidden="true"
                className="type-label pr-2 transition-transform duration-[var(--duration-fast)] ease-entrance group-hover:translate-x-1"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </Inview>
    </section>
  );
};
