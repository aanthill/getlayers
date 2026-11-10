// 📖 Docs: obsidian/frontend/adaptive-performance.md

/**
 * How much the device can carry. The design is the same at every tier — only
 * the cost of drawing it changes.
 *
 * 0 — a still instead of the live scene (reduced motion, data saver, a very
 *     weak device, a low battery, or a scene that proved too slow)
 * 1 — a light scene: phones, tablets, low-end laptops
 * 2 — a moderate scene: a standard laptop
 * 3 — the full scene, particles included: a high-end desktop
 */
export type DeviceTier = 0 | 1 | 2 | 3;

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

interface BatteryLike {
  charging: boolean;
  level: number;
}

type CapableNavigator = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
  getBattery?: () => Promise<BatteryLike>;
};

const SLOW_NETWORKS = new Set(["slow-2g", "2g"]);
/** Below this charge, unplugged, the device is treated as saving power. */
const LOW_BATTERY = 0.2;

/** The tier from what the browser reports — synchronous, cheap, client only. */
export const detectDeviceTier = (): DeviceTier => {
  if (typeof window === "undefined") return 0;
  const nav = navigator as CapableNavigator;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  if (nav.connection?.saveData) return 0;
  if (nav.connection?.effectiveType && SLOW_NETWORKS.has(nav.connection.effectiveType)) return 0;

  // Both are absent in Safari and Firefox: assume a middling machine.
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores <= 2 || memory <= 1) return 0;

  const touch = window.matchMedia("(pointer: coarse)").matches;
  if (touch || window.innerWidth < 1024) return 1;
  if (cores <= 4 || memory <= 4) return 1;
  if (cores >= 8 && memory >= 8) return 3;
  return 2;
};

/**
 * One step down while the battery is low and unplugged (Chromium only — the
 * one place a power-saving state is detectable). Resolves the tier unchanged
 * everywhere else.
 */
export const adjustForBattery = async (tier: DeviceTier): Promise<DeviceTier> => {
  const nav = navigator as CapableNavigator;
  if (tier === 0 || !nav.getBattery) return tier;
  try {
    const battery = await nav.getBattery();
    if (!battery.charging && battery.level <= LOW_BATTERY) return (tier - 1) as DeviceTier;
  } catch {
    // No battery information: keep the tier.
  }
  return tier;
};
