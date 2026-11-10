// 📖 Docs: obsidian/frontend/i18n-theme.md

import { Archivo, JetBrains_Mono } from "next/font/google";

import { getSiteStructuredData } from "@/utils/seo/structured-data";

import { AdaptiveGrid } from "@/components/common/grid";
import { JsonLd } from "@/components/common/json-ld";
import { originSyncScript } from "@/components/common/origin-sync";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { DeviceTierProbe } from "@/components/portfolio/device-tier-probe";
import { PageCurtain } from "@/components/portfolio/page-curtain";
import { PointerCursor } from "@/components/portfolio/pointer-cursor";
import { ScrollLayout } from "@/layouts/scroll-layout";
import { DEFAULT_THEME, PREFERENCES_SCRIPT, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

import "@/app/globals.css";

// The width axis is what the display type is built on (condensed, black).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

/**
 * The site's document — `<html>`, `<body>` and the chrome every page stands in.
 *
 * It lives here because three files render it: the two root layouts (one per
 * language, so `<html lang>` is right in the served HTML with nothing reading
 * the request) and `app/global-not-found.tsx`.
 *
 * No consent banner: the site sets no cookies and loads no third-party
 * script — only the visitor's own theme and language are kept, in
 * `localStorage` (ADR-0032). Mount `<LazyCookie />` again the day analytics or
 * an embed is added.
 *
 * Keep it static (hard rule #15). The theme and the saved language are applied
 * by an inline script before the first paint; the server always renders the
 * default theme.
 */
export const SiteDocument = ({
  lang,
  children,
}: Readonly<{ lang: Locale; children: React.ReactNode }>) => (
  // `data-theme` is set on <html> before hydration by PREFERENCES_SCRIPT.
  <html lang={lang} data-theme={DEFAULT_THEME} suppressHydrationWarning>
    <body
      className={`${archivo.variable} ${jetbrainsMono.variable} font-sans text-body leading-copy antialiased`}
    >
      <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
      {/* Canonical + share URLs follow the origin serving the page. */}
      <script dangerouslySetInnerHTML={{ __html: originSyncScript(siteConfig.url) }} />
      <JsonLd data={getSiteStructuredData()} />
      <ScrollLayout>
        <AdaptiveGrid />
        <ReducedMotion />
        <DeviceTierProbe />
        <PageCurtain>{children}</PageCurtain>
        <PointerCursor />
      </ScrollLayout>
    </body>
  </html>
);
