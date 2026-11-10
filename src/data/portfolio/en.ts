import type { PortfolioContent } from "./types";

/**
 * English copy. To add a project: append an object to `projects` (use
 * `visual: "plate"` and, when you have it, `image`) — or, while it is still
 * coming, an entry in `upcoming.items`. Mirror the change in `es.ts`.
 */
export const en: PortfolioContent = {
  locale: "en",
  person: {
    name: "Amelia Nuñez",
    nameLines: ["Amelia", "Nuñez"],
    role: "Software Developer",
    focus: ["Full-Stack", "Mobile", "IoT"],
    intro:
      "I build software end to end — from the sensor on the board to the API, the database and the app in your hand.",
  },
  nav: {
    label: "Main",
    work: "Work",
    about: "About",
    contact: "Contact",
    skip: "Skip to projects",
    language: "Language",
    switchTo: "Ver en español",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
  },
  hero: {
    cta: "See the work",
    index: "Project index",
    scroll: "Scroll",
    sceneAlt: "",
  },
  work: {
    title: "Selected work",
    progress: "Project",
    jump: "Jump to project",
    technologies: "Technologies",
    imageSlot: "Project image goes here",
    howItWorks: "How it works",
    screens: "Screens",
    cursor: "Open",
  },
  projects: [
    {
      id: "iot-plant-monitoring",
      name: "IoT Plant Monitoring",
      summary:
        "A plant monitoring system: an ESP32 reads the sensors, sends the readings to a backend that stores them, and a mobile app shows them.",
      technologies: [
        "ESP32",
        "Arduino",
        "React Native",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
      ],
      links: [],
      visual: "iot",
      pipeline: [
        { name: "Sensors", role: "Read the plant" },
        { name: "ESP32", role: "Collects and transmits" },
        { name: "Node.js", role: "Processes the data" },
        { name: "PostgreSQL", role: "Stores the readings" },
        { name: "React Native", role: "Shows it on the phone" },
      ],
    },
    {
      id: "sitetimeline",
      name: "SiteTimeline",
      summary:
        "Monitor the uptime and latency of your websites and review every incident. It checks your pages every few minutes and records every outage with a start and end time.",
      technologies: ["Next.js", "Vercel"],
      links: [{ label: "Visit the site", href: "https://sitetimeline.vercel.app" }],
      visual: "sitetimeline",
      screenshots: [
        {
          src: "/assets/projects/sitetimeline-desktop.png",
          alt: "SiteTimeline home page: “Know when your site stopped responding, and for how long.”",
          width: 2880,
          height: 1800,
          frame: "browser",
        },
        {
          src: "/assets/projects/sitetimeline-mobile.png",
          alt: "SiteTimeline home page on a phone",
          width: 780,
          height: 1688,
          frame: "phone",
        },
        {
          src: "/assets/projects/sitetimeline-login.png",
          alt: "SiteTimeline sign-in screen",
          width: 2880,
          height: 1800,
          frame: "browser",
        },
      ],
      features: [
        {
          title: "Uptime by time",
          text: "Calculated from the real duration of incidents, not by counting individual checks.",
        },
        {
          title: "No false alarms",
          text: "A site is only marked down after several consecutive failures that you configure.",
        },
        {
          title: "Safe targets",
          text: "Internal and private addresses are never checked, not even after a redirect.",
        },
      ],
      stripCaption: "Example: 60 checks. Tall bars are failures.",
    },
  ],
  upcoming: {
    id: "upcoming",
    name: "Upcoming",
    summary: "Applications and projects on the way. This space fills up as they ship.",
    items: [],
    openSlot: "Open slot",
    openSlotNote: "Next project lands here",
  },
  about: {
    title: "About",
    statement:
      "I am Amelia Nuñez, a software developer working across full-stack web, mobile and IoT. I like projects where the hardware, the data and the interface all have to work together.",
    educationTitle: "Education",
    education: [],
  },
  contact: {
    title: "Let's talk",
    lead: "Have a project, a role or a question? Write to me.",
    email: "ameliant310@gmail.com",
    emailLabel: "Email",
    github: { label: "GitHub", href: "https://github.com/aanthill" },
  },
  footer: { privacy: "Privacy", rights: "All rights reserved", top: "Back to top" },
  marquee: ["Full-Stack", "Mobile", "IoT", "Hardware to interface"],
};
