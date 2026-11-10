"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { animated, useInView, useSpring } from "@react-spring/web";

import { useRobot } from "@/components/common/robot-view";

export interface UptimeStripProps {
  caption: string;
}

const CHECKS = 60;
/** The failures in SiteTimeline's own example strip (checks 18–20 and 42). */
const FAILED = new Set([17, 18, 19, 41]);
const BARS = Array.from({ length: CHECKS }, (_, index) => FAILED.has(index));

/**
 * SiteTimeline's example strip, as on its home page: 60 checks, tall bars are
 * failures. The bars rise in order the first time the strip is seen — one
 * spring drives all sixty.
 */
export const UptimeStrip = ({ caption }: UptimeStripProps) => {
  const robot = useRobot();
  const [ref, seen] = useInView({ once: true });

  const { rise } = useSpring({
    rise: seen || robot ? 1 : 0,
    config: { duration: 1100 },
  });

  return (
    <figure ref={ref} className="flex flex-col gap-2">
      <div aria-hidden="true" className="flex h-12 items-end gap-px lg:gap-0.5">
        {BARS.map((failed, index) => (
          <animated.span
            key={index}
            style={{
              scaleY: robot
                ? 1
                : rise.to((value) => Math.min(1, Math.max(0, value * CHECKS * 0.2 - index * 0.18))),
            }}
            className={`flex-1 origin-bottom transition-opacity duration-[var(--duration-fast)] ease-entrance hover:opacity-60 ${
              failed ? "h-full bg-accent" : "h-3/5 bg-foreground"
            }`}
          />
        ))}
      </div>
      <figcaption className="type-label text-muted">{caption}</figcaption>
    </figure>
  );
};
