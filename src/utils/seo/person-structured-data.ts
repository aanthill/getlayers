// 📖 Docs: obsidian/frontend/seo-metadata.md

import type { PortfolioContent } from "@/data/portfolio";
import { LOCALE_HOME } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

import { jsonLdGraph, type JsonLdNode } from "./structured-data";

/**
 * The person the portfolio is about, as a `ProfilePage` — in the page's own
 * language. Only facts the page itself states.
 */
export const getPersonStructuredData = (content: PortfolioContent): JsonLdNode => {
  const path = LOCALE_HOME[content.locale];
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  const profiles = [content.contact.github.href, content.contact.linkedin?.href].filter(
    (href): href is string => Boolean(href),
  );
  return jsonLdGraph({
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    inLanguage: content.locale,
    mainEntity: {
      "@type": "Person",
      "@id": `${siteConfig.url}#person`,
      name: content.person.name,
      jobTitle: content.person.role,
      description: content.person.intro,
      email: content.contact.email,
      knowsAbout: content.person.focus,
      sameAs: profiles,
    },
  });
};
