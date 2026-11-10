"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { animated, useSpring } from "@react-spring/web";
import Image from "next/image";
import { useState, type PointerEvent } from "react";

import type { Screenshot } from "@/data/portfolio";
import { useDeviceTier } from "@/hooks/use-device-tier";

export interface ScreenFramesProps {
  /** Names the gallery for assistive tech — "Screens". */
  label: string;
  screenshots: Screenshot[];
  /** The live site — the frames link to it. */
  href?: string;
  /** The custom cursor's label over the frames. */
  cursor: string;
}

/** Degrees the frames lean toward the pointer. */
const TILT = 7;

/**
 * Real screens of the product in a sideways-scrolling strip (swipe on a phone,
 * wheel or drag the scrollbar on a desktop). On capable devices the strip leans
 * toward the pointer in 3D.
 */
export const ScreenFrames = ({ label, screenshots, href, cursor }: ScreenFramesProps) => {
  const tier = useDeviceTier();
  const [lean, setLean] = useState({ rotateX: 0, rotateY: 0 });
  const tilt = useSpring({ ...lean, config: { tension: 180, friction: 24 } });
  const canTilt = tier !== null && tier >= 2;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canTilt || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setLean({ rotateX: -y * TILT, rotateY: x * TILT });
  };

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={() => setLean({ rotateX: 0, rotateY: 0 })}
      className="[perspective:80rem]"
    >
      <animated.ul
        aria-label={label}
        style={tilt}
        className="flex snap-x snap-mandatory items-end gap-4 overflow-x-auto overscroll-x-contain pb-3 lg:gap-6"
      >
        {screenshots.map((shot, index) => {
          const phone = shot.frame === "phone";
          const frame = (
            <span
              className={`block overflow-hidden border border-foreground bg-surface ${phone ? "w-36 lg:w-48" : "w-[78vw] lg:w-frame"}`}
            >
              {!phone && (
                <span aria-hidden="true" className="flex h-6 items-center gap-1.5 border-b border-foreground px-2">
                  <span className="size-2 bg-foreground" />
                  <span className="size-2 border border-foreground" />
                  <span className="size-2 border border-foreground" />
                </span>
              )}
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes={phone ? "(min-width: 1024px) 12rem, 9rem" : "(min-width: 1024px) 34rem, 78vw"}
                loading="lazy"
                className="block h-auto w-full"
              />
            </span>
          );
          return (
            <li key={shot.src} className="shrink-0 snap-start">
              {href && index === 0 ? (
                <a href={href} target="_blank" rel="noreferrer" data-cursor={cursor} className="block">
                  {frame}
                </a>
              ) : (
                frame
              )}
            </li>
          );
        })}
      </animated.ul>
    </div>
  );
};
