"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { SpringTrigger } from "@/components/animation/springs/spring-trigger";

export interface KineticBandProps {
  words: string[];
  /** The band slides the other way. */
  reverse?: boolean;
}

const REPEATS = 4;

/**
 * A band of type that slides sideways with the scroll — driven by the page's
 * own movement, so it is still when the page is. Decorative: the words are
 * already in the hero.
 */
export const KineticBand = ({ words, reverse = false }: KineticBandProps) => (
  <SpringTrigger
    tag="div"
    aria-hidden="true"
    from={{ x: reverse ? "-30%" : "0%" }}
    to={{ x: reverse ? "0%" : "-30%" }}
    className="w-full overflow-hidden border-y border-foreground bg-accent text-accent-contrast"
    innerClassName="type-display flex w-max items-center gap-8 whitespace-nowrap py-3 text-title leading-display"
  >
    {Array.from({ length: REPEATS }, (_, repeat) =>
      words.map((word) => (
        <span key={`${repeat}-${word}`} className="flex items-center gap-8">
          {word}
          <span className="inline-block size-4 bg-accent-contrast" />
        </span>
      )),
    )}
  </SpringTrigger>
);
