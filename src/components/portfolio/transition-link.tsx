"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { usePageTransition } from "./page-curtain";

export type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** A `next/link` whose route change plays the page curtain. */
export const TransitionLink = ({ href, onClick, children, ...rest }: TransitionLinkProps) => {
  const navigate = usePageTransition();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    // New tab / window, or already handled: leave it to the browser.
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href);
  };
  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};
