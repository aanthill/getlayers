import type { Metadata, Viewport } from "next";

import { SiteDocument } from "@/layouts/site-document";
import { NotFoundView } from "@/views/not-found";
import { generateMetadata, generateViewport } from "@/utils/seo/generate-page-metadata";

/**
 * 404 for a URL no route matches. The app has two root layouts (one per
 * language), so an unmatched URL has no layout to render inside and Next
 * serves this file whole (`globalNotFound` in `next.config.ts`).
 */
export const metadata: Metadata = generateMetadata({ title: "Page not found", noIndex: true });
export const viewport: Viewport = generateViewport();

export default function GlobalNotFound() {
  return (
    <SiteDocument lang="en">
      <NotFoundView />
    </SiteDocument>
  );
}
