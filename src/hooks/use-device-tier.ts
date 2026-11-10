// 📖 Docs: obsidian/frontend/adaptive-performance.md

import { create } from "zustand";

import type { DeviceTier } from "@/lib/device-tier";

interface DeviceTierState {
  /** `null` until the probe has run (the server and the first client render). */
  tier: DeviceTier | null;
  setTier: (tier: DeviceTier) => void;
  /** The scene measured itself too slow: fall back to the still for the visit. */
  demote: () => void;
}

export const useDeviceTierStore = create<DeviceTierState>((set) => ({
  tier: null,
  setTier: (tier) => set({ tier }),
  demote: () => set({ tier: 0 }),
}));

/** The device's tier, or `null` before it is known. */
export const useDeviceTier = (): DeviceTier | null => useDeviceTierStore((state) => state.tier);
