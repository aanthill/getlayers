import type { Metadata, Viewport } from "next";

import { SiteDocument } from "@/layouts/site-document";
import { homeMetadata } from "@/views/home-metadata";
import { generateViewport } from "@/utils/seo/generate-page-metadata";

export const metadata: Metadata = homeMetadata("es");
export const viewport: Viewport = generateViewport();

/** The Spanish root layout — `<html lang="es">`. Static, like the English one. */
export default function SpanishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteDocument lang="es">{children}</SiteDocument>;
}
