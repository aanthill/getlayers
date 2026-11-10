"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { animated, useSpring } from "@react-spring/web";

import type { PipelineStep } from "@/data/portfolio";
import { useMotionOff } from "@/hooks/use-motion-off";

export interface SignalPipelineProps {
  title: string;
  steps: PipelineStep[];
}

/**
 * How the IoT system works, as the path one reading takes: a pulse travels
 * from the sensors to the phone, and each stage lights as it passes. With
 * motion off every stage simply shows.
 */
export const SignalPipeline = ({ title, steps }: SignalPipelineProps) => {
  const motionOff = useMotionOff();
  const { travel } = useSpring({
    from: { travel: 0 },
    to: { travel: 1 },
    loop: !motionOff,
    config: { duration: 4200 },
    pause: motionOff,
  });
  const last = Math.max(1, steps.length - 1);

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="type-label text-muted">{title}</figcaption>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-2 hidden h-rule bg-line lg:block" />
        {/* Always in the markup (the server cannot know about reduced motion);
            with motion off it rests on the first stage. */}
        <animated.div
          aria-hidden="true"
          style={{ left: travel.to((value) => `${((value * last) / steps.length) * 100}%`) }}
          className="absolute top-0 z-10 hidden size-4 bg-accent lg:block"
        />
        <ol
          className="relative flex flex-col gap-3 lg:grid lg:gap-2"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, index) => (
            <li key={step.name} className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1 pl-7 lg:flex-col lg:gap-2 lg:pl-0 lg:pt-6">
              <animated.span
                aria-hidden="true"
                style={{
                  opacity: travel.to((value) =>
                    motionOff || value * last >= index - 0.15 ? 1 : 0.35,
                  ),
                }}
                className="absolute left-0 top-0 size-4 border border-foreground bg-background"
              />
              <span className="type-label">{step.name}</span>
              <span className="text-label leading-copy text-muted">{step.role}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
};
