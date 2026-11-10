import type { Locale } from "@/lib/i18n";

import { en } from "./en";
import { es } from "./es";
import type { PortfolioContent } from "./types";

export type * from "./types";

const CONTENT: Record<Locale, PortfolioContent> = { en, es };

/** The page's copy in one language — every string the view shows. */
export const getPortfolioContent = (locale: Locale): PortfolioContent => CONTENT[locale];
