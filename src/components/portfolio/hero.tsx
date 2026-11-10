"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { useRef } from "react";

import { SpringTrigger } from "@/components/animation/springs/spring-trigger";
import { Hover } from "@/components/common/robot-hover";
import { Inview } from "@/components/common/robot-inview";
import type { PortfolioContent } from "@/data/portfolio";

import { HeroScene } from "./hero-scene";
import { SectionLink } from "./section-link";

export interface HeroProps {
  person: PortfolioContent["person"];
  copy: PortfolioContent["hero"];
  /** The gallery's entries, in order — the index links straight to each. */
  index: { id: string; name: string }[];
}

const REVEAL = { tension: 170, friction: 26 };

/**
 * First screen: the name at full size (in the served HTML at rest — it is the
 * LCP), the role, one sentence, and the project index, so every project is one
 * click from the first paint. The name's two lines pull apart as the hero
 * scrolls away.
 */
export const Hero = ({ person, copy, index }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null!);
  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-lvh w-full flex-col overflow-hidden px-4 pb-24 pt-bar lg:px-8 lg:pb-10"
    >
      <HeroScene className="absolute inset-0" />

      <div className="relative z-10 mt-auto flex flex-col gap-6 pt-6">
        <p className="type-label flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="bg-accent px-2 py-1 text-accent-contrast">
            {person.role}
          </span>
          {person.focus.map((item) => (
            <span key={item} className="border border-foreground px-2 py-1">
              {item}
            </span>
          ))}
        </p>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1
            aria-label={person.name}
            className="type-display text-mega leading-mega tracking-mega lg:col-span-8"
          >
            {person.nameLines.map((line, lineIndex) => (
              <SpringTrigger
                key={line}
                tag="span"
                innerTag="span"
                aria-hidden="true"
                trigger={sectionRef}
                start="top top"
                end="bottom top"
                from={{ x: "0vw" }}
                to={{ x: lineIndex % 2 === 0 ? "-16vw" : "16vw" }}
                className="block"
                innerClassName="block whitespace-nowrap"
              >
                {Array.from(line).map((letter, letterIndex) => (
                  <Hover
                    key={`${letter}-${letterIndex}`}
                    tag="span"
                    from={{ y: "0em" }}
                    to={{ y: "-0.06em" }}
                    config={{ tension: 420, friction: 14 }}
                    className="inline-block transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-emphasis"
                  >
                    {letter}
                  </Hover>
                ))}{" "}
              </SpringTrigger>
            ))}
          </h1>
          <Inview
            tag="nav"
            aria-label={copy.index}
            mode="once"
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
            config={REVEAL}
            delayIn={150}
            className="w-full lg:col-span-4 lg:pb-3"
          >
            <p className="type-label mb-3 text-muted">{copy.index}</p>
            <ol className="border-t border-foreground">
              {index.map((project, position) => (
                <li key={project.id} className="border-b border-foreground">
                  <SectionLink
                    target={`work-${project.id}`}
                    project={position}
                    className="group flex items-baseline gap-4 bg-background py-3 transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-accent hover:text-accent-contrast lg:py-3"
                  >
                    <span className="type-label w-8 pl-2">
                      {String(position + 1).padStart(2, "0")}
                    </span>
                    <span className="type-display flex-1 text-lead leading-display">
                      {project.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="type-label pr-2 transition-transform duration-[var(--duration-fast)] ease-entrance group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </SectionLink>
                </li>
              ))}
            </ol>
          </Inview>
        </div>

        <Inview
          tag="div"
          mode="once"
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          config={REVEAL}
          delayIn={250}
          className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-xl bg-background text-lead leading-copy">
            {person.intro}
          </p>
          <SectionLink
            target="work"
            className="type-label group flex items-center gap-3 border border-foreground bg-foreground px-5 py-4 text-background transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-accent hover:text-accent-contrast"
          >
            {copy.cta}
            <span
              aria-hidden="true"
              className="transition-transform duration-[var(--duration-fast)] ease-entrance group-hover:translate-y-1"
            >
              ↓
            </span>
          </SectionLink>
        </Inview>
      </div>
    </section>
  );
};
