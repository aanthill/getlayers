"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md → "The hero scene"

import { useEffect, useRef, useState } from "react";

import { useRobot } from "@/components/common/robot-view";
import { useDeviceTier, useDeviceTierStore } from "@/hooks/use-device-tier";
import type { DeviceTier } from "@/lib/device-tier";
import type { SceneColors, SceneQuality } from "@/lib/scene/signal-field";
import { keepSceneAlive, releaseContext, watchContext } from "@/lib/scene/webgl-context";

/** The same field at each tier — fewer bars and pixels, never a different design. */
const QUALITY: Record<Exclude<DeviceTier, 0>, Omit<SceneQuality, "gateDraw" | "pointer">> = {
  1: { grid: 16, maxDpr: 1.5, particles: 0 },
  2: { grid: 30, maxDpr: 1.5, particles: 0 },
  3: { grid: 44, maxDpr: 2, particles: 480 },
};

const readColors = (): SceneColors => {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => style.getPropertyValue(name).trim();
  return { ground: read("--background"), ink: read("--foreground"), accent: read("--accent") };
};

// The still: the same field, drawn once — what the robot form, reduced motion
// and the weakest devices get, and what shows until the live scene is up.
const COLUMNS = 26;
const ROWS = 12;
const STILL_BARS = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
  const column = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  const wave =
    Math.sin(column * 0.55) * 0.5 + Math.sin(row * 0.8) * 0.5 + Math.sin((column + row) * 0.35);
  const near = Math.max(0, 1 - Math.hypot(column - 17, (row - 6) * 1.6) / 6);
  const height = Math.round(18 + (wave * 0.25 + 0.5) * 70 + near * 150);
  return {
    x: 40 + column * 42 + row * 7,
    y: 300 + row * 32 - height,
    height,
    accent: near > 0.45,
    depth: row / (ROWS - 1),
  };
});

const SceneStill = ({ hidden }: { hidden: boolean }) => (
  <svg
    viewBox="0 0 1240 700"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden="true"
    className={`absolute inset-0 size-full ${hidden ? "invisible" : ""}`}
  >
    {STILL_BARS.map((bar, index) => (
      <rect
        key={index}
        x={bar.x}
        y={bar.y}
        width={24}
        height={bar.height}
        className={bar.accent ? "fill-accent" : "fill-surface stroke-line"}
        opacity={bar.accent ? 1 : 0.35 + bar.depth * 0.65}
      />
    ))}
  </svg>
);

export interface HeroSceneProps {
  className?: string;
}

/**
 * The hero's 3D field. three.js is imported only when the device's tier asks
 * for the live scene, so the robot form and tier-0 devices never download it.
 */
export const HeroScene = ({ className }: HeroSceneProps) => {
  const robot = useRobot();
  const tier = useDeviceTier();
  const demote = useDeviceTierStore((state) => state.demote);
  const boxRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const container = boxRef.current;
    if (robot || !tier || !container) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const quality: SceneQuality = { ...QUALITY[tier], gateDraw: fine, pointer: fine };
    let setColors: ((colors: SceneColors) => void) | null = null;

    const stopScene = keepSceneAlive({
      container,
      build: async ({ onContextChange }) => {
        const { createSignalField } = await import("@/lib/scene/signal-field");
        const scene = createSignalField(container, {
          quality,
          colors: readColors(),
          onSlow: demote,
        });
        const unwatch = watchContext(scene.canvas, onContextChange);
        setColors = scene.setColors;
        setLive(true);
        return {
          isBroken: () => scene.gl.isContextLost(),
          frames: scene.frameCount,
          dispose: () => {
            unwatch();
            setColors = null;
            scene.dispose();
            releaseContext(scene.gl);
            scene.canvas.remove();
          },
        };
      },
      onFail: () => setLive(false),
    });

    // The scene draws in the page's colours: follow the theme toggle.
    const themeObserver = new MutationObserver(() => setColors?.(readColors()));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      themeObserver.disconnect();
      stopScene();
      setLive(false);
    };
  }, [demote, robot, tier]);

  return (
    <div ref={boxRef} aria-hidden="true" className={`overflow-hidden ${className ?? ""}`}>
      <SceneStill hidden={live} />
    </div>
  );
};
