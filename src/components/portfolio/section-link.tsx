"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import type { AnchorHTMLAttributes, MouseEvent } from "react";

import { useScroll } from "@/hooks/smooth-scroll/use-scroll";

const WORK_ID = "work";

const scrollToY = (top: number) => {
  const { lenis } = useScroll.getState();
  if (lenis) lenis.scrollTo(top);
  else window.scrollTo({ top, behavior: "smooth" });
};

/** Scroll a section's top under the fixed bar. */
export const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  const bar = document.querySelector<HTMLElement>("[data-site-bar]")?.offsetHeight ?? 0;
  // The pinned gallery and the hero start at the very top of the viewport.
  const offset = id === WORK_ID || id === "top" ? 0 : bar;
  scrollToY(element.getBoundingClientRect().top + window.scrollY - offset);
};

/**
 * Bring project `index` on screen. On desktop the gallery is pinned and moves
 * sideways with the scroll, so a project is a scroll *position* inside the
 * section; stacked (phones, the robot form) it is simply its panel.
 */
export const scrollToProject = (index: number) => {
  const section = document.getElementById(WORK_ID);
  if (!section) return;
  const panels = section.querySelectorAll<HTMLElement>("[data-panel]");
  const panel = panels[index];
  if (!panel) return;
  const top = section.getBoundingClientRect().top + window.scrollY;
  if (section.dataset.pinned !== "true") {
    const bar = document.querySelector<HTMLElement>("[data-site-bar]")?.offsetHeight ?? 0;
    return scrollToY(panel.getBoundingClientRect().top + window.scrollY - bar);
  }
  const span = section.offsetHeight - window.innerHeight;
  scrollToY(top + (span * index) / Math.max(1, panels.length - 1));
};

export interface SectionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The section's id. */
  target: string;
  /** A project's position in the gallery — scrolls to that project. */
  project?: number;
}

/** An in-page link: a real `#anchor` that scrolls smoothly when JS is there. */
export const SectionLink = ({ target, project, onClick, children, ...rest }: SectionLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (project === undefined) scrollToSection(target);
    else scrollToProject(project);
    window.history.replaceState(null, "", `#${target}`);
  };
  return (
    <a href={`#${target}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
