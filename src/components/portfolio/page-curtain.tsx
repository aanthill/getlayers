"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Spring } from "@/components/common/robot-spring";
import { useMotionOff } from "@/hooks/use-motion-off";

/** How long the curtain takes to cover the page before the route changes. */
const COVER_MS = 420;

type Navigate = (href: string) => void;

const CurtainContext = createContext<Navigate | null>(null);

/** Route changes go through the curtain: `const go = usePageTransition()`. */
export const usePageTransition = (): Navigate => {
  const router = useRouter();
  const navigate = useContext(CurtainContext);
  return navigate ?? router.push;
};

/**
 * The page transition: an accent panel rises over the page, the route changes
 * underneath, and the panel leaves once the new page is in. With motion off
 * the route simply changes.
 */
export const PageCurtain = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const motionOff = useMotionOff();
  // The path the curtain was raised on. Derived, not reset in an effect: once
  // the route changes it no longer matches and the curtain lifts by itself.
  const [coveredOn, setCoveredOn] = useState<string | null>(null);
  const covered = coveredOn === pathname;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const navigate = useCallback<Navigate>(
    (href) => {
      if (motionOff) return router.push(href);
      setCoveredOn(pathname);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => router.push(href), COVER_MS);
    },
    [motionOff, pathname, router],
  );

  const value = useMemo(() => navigate, [navigate]);

  return (
    <CurtainContext.Provider value={value}>
      {children}
      <Spring
        tag="div"
        aria-hidden="true"
        mode="always"
        enabled={covered}
        from={{ y: "101%" }}
        to={{ y: "0%" }}
        config={{ tension: 210, friction: 30 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-lvh bg-accent"
      />
    </CurtainContext.Provider>
  );
};
