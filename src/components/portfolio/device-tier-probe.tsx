"use client";

// 📖 Docs: obsidian/frontend/adaptive-performance.md

import { useEffect } from "react";

import { useDeviceTierStore } from "@/hooks/use-device-tier";
import { adjustForBattery, detectDeviceTier } from "@/lib/device-tier";

/** Measures the device once, after hydration. Renders nothing. */
export const DeviceTierProbe = (): null => {
  const setTier = useDeviceTierStore((state) => state.setTier);
  useEffect(() => {
    let alive = true;
    const tier = detectDeviceTier();
    setTier(tier);
    void adjustForBattery(tier).then((adjusted) => {
      if (alive && adjusted !== tier) setTier(adjusted);
    });
    return () => {
      alive = false;
    };
  }, [setTier]);
  return null;
};
