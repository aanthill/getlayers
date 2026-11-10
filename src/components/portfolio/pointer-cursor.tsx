"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState, useSyncExternalStore } from "react";

import { isRobotView } from "@/components/common/robot-view";
import { useDeviceTier } from "@/hooks/use-device-tier";

/** Elements that carry `data-cursor="<label>"` grow the cursor and name it. */
const TARGET = "[data-cursor]";
const INTERACTIVE = "a, button, [role='button']";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

const readFinePointer = (): boolean =>
  !isRobotView() && window.matchMedia(FINE_POINTER).matches;

const subscribeFinePointer = (onChange: () => void) => {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * The custom cursor: a square that follows the pointer, widens over links and
 * shows a label over project previews. Fine pointers only, tier 2 and up, never
 * on the robot form. The native cursor stays — this is an addition, so nothing
 * is lost if it never mounts.
 */
export const PointerCursor = () => {
  const tier = useDeviceTier();
  const capable = useSyncExternalStore(subscribeFinePointer, readFinePointer, () => false);
  const enabled = capable && tier !== null && tier >= 2;
  const [label, setLabel] = useState("");
  const [state, setState] = useState<"idle" | "link" | "target">("idle");
  const [visible, setVisible] = useState(false);

  const [point, setPoint] = useState({ x: 0, y: 0 });
  // Declarative: this project's react-spring build moves on a value change.
  const position = useSpring({ ...point, config: { tension: 520, friction: 38 } });
  const shape = useSpring({
    scale: state === "target" ? 5 : state === "link" ? 2 : 1,
    opacity: visible ? 1 : 0,
    config: { tension: 380, friction: 28 },
  });

  useEffect(() => {
    if (!enabled) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setVisible(true);
      setPoint({ x: event.clientX, y: event.clientY });
      const element = event.target instanceof Element ? event.target : null;
      const target = element?.closest<HTMLElement>(TARGET);
      if (target) {
        setLabel(target.dataset.cursor ?? "");
        setState("target");
      } else {
        setLabel("");
        setState(element?.closest(INTERACTIVE) ? "link" : "idle");
      }
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <animated.div
      aria-hidden="true"
      style={position}
      className="pointer-events-none fixed left-0 top-0 z-50"
    >
      <animated.div
        style={shape}
        className="-ml-2 -mt-2 flex size-4 items-center justify-center bg-accent text-accent-contrast mix-blend-difference"
      />
      {label && (
        <span className="type-label absolute left-4 top-4 whitespace-nowrap bg-accent px-2 py-1 text-accent-contrast">
          {label}
        </span>
      )}
    </animated.div>
  );
};
