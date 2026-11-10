import type { Metadata } from "next";

import { getPortfolioContent } from "@/data/portfolio";
import { LOCALE_HOME, LOCALES, OG_LOCALE, type Locale } from "@/lib/i18n";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { routeLanguages } from "@/utils/seo/hreflang";

/**
 * The `<head>` of one language's home — and the defaults its root layout
 * hands to the pages under it. Each version is canonical to itself and lists
 * every version (hreflang) from the route registry.
 */
export const homeMetadata = (lang: Locale): Metadata => {
  const { person } = getPortfolioContent(lang);
  const path = LOCALE_HOME[lang];
  return generateMetadata({
    ...(lang === "en"
      ? {}
      : { title: `${person.name} — ${person.role}`, absoluteTitle: true, description: person.intro }),
    url: path,
    locale: OG_LOCALE[lang],
    alternateLocales: LOCALES.filter((other) => other !== lang).map((other) => OG_LOCALE[other]),
    languages: routeLanguages(path),
  });
};
