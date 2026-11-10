"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { Inview } from "@/components/common/robot-inview";
import { RobotText as TextEngine } from "@/components/common/robot-text";
import type { PortfolioContent } from "@/data/portfolio";

export interface AboutProps {
  copy: PortfolioContent["about"];
}

/**
 * A short introduction, set large and revealed word by word as it is read —
 * and the education, when there is some to list.
 */
export const About = ({ copy }: AboutProps) => (
  <section
    id="about"
    aria-labelledby="about-title"
    className="grid w-full gap-8 px-4 py-24 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-40"
  >
    <h2 id="about-title" className="type-label text-muted lg:col-span-3">
      {copy.title}
    </h2>
    <div className="flex flex-col gap-12 lg:col-span-9">
      <TextEngine
        tag="p"
        lazy
        mode="once"
        wordIn={{ opacity: 1, y: 0 }}
        wordOut={{ opacity: 0.12, y: 12 }}
        wordStagger={35}
        wordConfig={{ tension: 190, friction: 26 }}
        className="type-display text-title leading-display"
      >
        {copy.statement}
      </TextEngine>
      {copy.education.length > 0 && (
        <Inview
          tag="div"
          mode="once"
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          config={{ tension: 170, friction: 26 }}
          className="flex flex-col gap-4"
        >
          <h3 className="type-label text-muted">{copy.educationTitle}</h3>
          <ul className="border-t border-foreground">
            {copy.education.map((entry) => (
              <li
                key={`${entry.title}-${entry.years}`}
                className="grid gap-1 border-b border-foreground py-4 lg:grid-cols-12"
              >
                <span className="type-label lg:col-span-3">{entry.years}</span>
                <span className="text-lead leading-display lg:col-span-5">{entry.title}</span>
                <span className="text-body text-muted lg:col-span-4">{entry.place}</span>
              </li>
            ))}
          </ul>
        </Inview>
      )}
    </div>
  </section>
);
