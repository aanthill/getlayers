import type { Metadata, Viewport } from "next";

import { SiteDocument } from "@/layouts/site-document";
import { homeMetadata } from "@/views/home-metadata";
import { generateViewport } from "@/utils/seo/generate-page-metadata";

export const metadata: Metadata = homeMetadata("en");
export const viewport: Viewport = generateViewport();

/**
 * The English root layout — one of two (see `app/(es)`). Keep it static:
 * nothing here (or in any page) may read `headers()` / `cookies()`; robots are
 * told apart in `src/proxy.ts`. No `app/loading.tsx` without a real skeleton
 * (obsidian/frontend/robot-form.md).
 */
export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteDocument lang="en">{children}</SiteDocument>;
}
