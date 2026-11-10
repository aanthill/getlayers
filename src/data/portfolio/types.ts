import type { Locale } from "@/lib/i18n";

/** How a project's panel shows the work. */
export type ProjectVisual = "iot" | "sitetimeline" | "plate";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface PipelineStep {
  /** Short node name — "ESP32". */
  name: string;
  /** What that stage does, a few words. */
  role: string;
}

export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** The frame it sits in. */
  frame: "browser" | "phone";
}

export interface Project {
  /** Stable id — the anchor (`#work-<id>`). */
  id: string;
  name: string;
  /** One or two short sentences. */
  summary: string;
  technologies: string[];
  links: ProjectLink[];
  visual: ProjectVisual;
  /**
   * The project's own picture (path under `public/`). Omitted → the animated
   * colour plate stands in until the real image is added.
   */
  image?: { src: string; alt: string; width: number; height: number };
  /** `iot`: the stages the data travels through. */
  pipeline?: PipelineStep[];
  /** `sitetimeline`: real screens of the product. */
  screenshots?: Screenshot[];
  /** `sitetimeline`: what the product states about itself. */
  features?: { title: string; text: string }[];
  /** Caption under the uptime strip. */
  stripCaption?: string;
}

export interface UpcomingItem {
  name: string;
  note: string;
}

export interface Education {
  title: string;
  place: string;
  years: string;
}

export interface PortfolioContent {
  locale: Locale;
  person: {
    name: string;
    /** The name as the hero sets it, one entry per line. */
    nameLines: string[];
    role: string;
    focus: string[];
    intro: string;
  };
  nav: {
    label: string;
    work: string;
    about: string;
    contact: string;
    skip: string;
    language: string;
    switchTo: string;
    themeToDark: string;
    themeToLight: string;
  };
  hero: { cta: string; index: string; scroll: string; sceneAlt: string };
  work: {
    title: string;
    progress: string;
    jump: string;
    technologies: string;
    imageSlot: string;
    howItWorks: string;
    screens: string;
    cursor: string;
  };
  projects: Project[];
  upcoming: {
    id: string;
    name: string;
    summary: string;
    /** Add an entry here and it takes the next open slot. */
    items: UpcomingItem[];
    openSlot: string;
    openSlotNote: string;
  };
  about: {
    title: string;
    statement: string;
    educationTitle: string;
    /** Empty → the block is not rendered. */
    education: Education[];
  };
  contact: {
    title: string;
    lead: string;
    email: string;
    github: { label: string; href: string };
    /** Omitted until there is a profile to link. */
    linkedin?: { label: string; href: string };
    emailLabel: string;
  };
  footer: { privacy: string; rights: string; top: string };
  marquee: string[];
}
