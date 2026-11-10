"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md → "The work gallery"

import {
  Children,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from "react";

import { SpringTrigger } from "@/components/animation/springs/spring-trigger";
import { useRobot } from "@/components/common/robot-view";
import { RobotText as TextEngine } from "@/components/common/robot-text";
import { useWindowWidth } from "@/hooks/use-window-size";

import { scrollToProject } from "./section-link";

export interface WorkGalleryProps {
  title: string;
  /** Names the jump buttons — "Jump to project". */
  jumpLabel: string;
  /** Each panel's anchor id and name, in order. */
  panels: { id: string; name: string }[];
  /** One child per panel. */
  children: ReactNode;
}

/** From this width the gallery is pinned and scrolls sideways. */
const PINNED_FROM = 1024;

/**
 * The projects. On a desktop the section is pinned for its height and the
 * panels travel sideways as the page scrolls — a horizontal gallery driven by
 * the ordinary scroll, so the wheel, the keyboard and the scrollbar all work.
 * On phones, and on the robot form, the same panels simply stack.
 *
 * The layout switch is CSS (`lg:`), so the served HTML is the same for both;
 * only the scrub is switched on in JS, once the width is known.
 */
export const WorkGallery = ({ title, jumpLabel, panels, children }: WorkGalleryProps) => {
  const robot = useRobot();
  const width = useWindowWidth();
  const sectionRef = useRef<HTMLElement>(null!);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pinned = !robot && width >= PINNED_FROM;
  const count = panels.length;
  // A link focused in a panel that is off to the side: bring that panel in by
  // scrolling the page, and undo the sideways scroll the browser just made.
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    if (!pinned) return;
    const panel = (event.target as HTMLElement).closest<HTMLElement>("[data-panel]");
    if (!panel) return;
    if (viewportRef.current) viewportRef.current.scrollLeft = 0;
    scrollToProject(Number(panel.dataset.panel));
  };

  // Literal class strings (Tailwind reads the source): the robot form never
  // pins, whatever the width.
  const pinClass = (classes: string) => (robot ? "" : classes);

  return (
    <section
      ref={sectionRef}
      id="work"
      data-pinned={pinned}
      aria-labelledby="work-title"
      style={{ "--gallery-height": `${count * 100}lvh` } as CSSProperties}
      className={`relative w-full ${pinClass("lg:h-[var(--gallery-height)]")}`}
    >
      <div
        ref={viewportRef}
        onFocus={onFocus}
        className={`flex flex-col ${pinClass("lg:sticky lg:top-0 lg:h-lvh lg:overflow-hidden")}`}
      >
        <header
          className="mt-bar flex items-end justify-between gap-6 border-b border-foreground px-4 pb-4 pt-8 lg:px-8 lg:pt-5"
        >
          <TextEngine
            tag="h2"
            id="work-title"
            lazy
            mode="once"
            overflow
            lineIn={{ y: "0%" }}
            lineOut={{ y: "100%" }}
            lineConfig={{ tension: 170, friction: 26 }}
            className="type-display text-title leading-display"
          >
            {title}
          </TextEngine>
          <ol aria-label={jumpLabel} className={`type-label hidden gap-2 ${pinClass("lg:flex")}`}>
            {panels.map((panel, index) => (
              <li key={panel.id}>
                <button
                  type="button"
                  onClick={() => scrollToProject(index)}
                  aria-label={`${jumpLabel}: ${panel.name}`}
                  className="flex size-10 items-center justify-center border border-foreground transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-accent hover:text-accent-contrast"
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              </li>
            ))}
          </ol>
        </header>

        <SpringTrigger
          tag="div"
          innerTag="ol"
          trigger={sectionRef}
          start="top top"
          end="bottom bottom"
          enabled={pinned}
          from={{ x: "0vw" }}
          to={{ x: `${-(count - 1) * 100}vw` }}
          className={`min-h-0 flex-1 ${pinClass("lg:overflow-hidden")}`}
          innerClassName={`flex flex-col ${pinClass("lg:h-full lg:w-max lg:flex-row")}`}
        >
          {Children.map(children, (child, index) => (
            <li
              id={`work-${panels[index]?.id}`}
              data-panel={index}
              className={`flex w-full items-center border-b border-line px-4 py-12 lg:px-8 ${pinClass("lg:h-full lg:w-screen lg:border-b-0 lg:py-6")}`}
            >
              {child}
            </li>
          ))}
        </SpringTrigger>

        <SpringTrigger
          tag="div"
          aria-hidden="true"
          trigger={sectionRef}
          start="top top"
          end="bottom bottom"
          enabled={pinned}
          from={{ scaleX: 0 }}
          to={{ scaleX: 1 }}
          className={`hidden h-1 w-full bg-line ${pinClass("lg:block")}`}
          innerClassName="h-full origin-left bg-accent"
        />
      </div>
    </section>
  );
};
