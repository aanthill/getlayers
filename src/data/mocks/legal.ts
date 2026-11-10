/**
 * Copy for the privacy policy (`/privacy-policy`, linked from the footer).
 *
 * It says what this site really does: no forms, no accounts, no analytics, no
 * cookies — only the visitor's theme and language, kept in their own browser.
 * Plain wording, not legal advice: have it reviewed before relying on it, and
 * rewrite it (and `LEGAL_UPDATED`) the day the site starts collecting anything.
 */
import type { LegalSection } from "@/views/legal/legal-document";

export const LEGAL_UPDATED = "Last updated 10 November 2026";

export const privacyPolicy: {
  title: string;
  intro: string;
  sections: readonly LegalSection[];
} = {
  title: "Privacy Policy",
  intro:
    "This policy explains what this website collects when you use it, why, and the choices you have.",
  sections: [
    {
      heading: "What is collected",
      body: [
        "This site has no forms, no accounts and no analytics. If you write to me by email, I receive what you choose to send.",
        "Like most websites, the hosting provider records standard technical information with each request — IP address, browser and device type, and the pages requested. This is used to keep the site running and secure.",
      ],
    },
    {
      heading: "Cookies and storage",
      body: [
        "The site sets no cookies. Your browser keeps two preferences on your own device — the theme and the language you chose — so your next visit opens the same way. They are never sent anywhere, and you can clear them in your browser's settings.",
      ],
    },
    {
      heading: "How it is used",
      body: [
        "I use what you send me to answer you. I do not sell your information, and I do not use it for unrelated marketing.",
      ],
    },
    {
      heading: "How long it is kept",
      body: [
        "I keep what you send me for as long as I need it to answer you, then delete it.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can ask for a copy of what I hold about you, ask me to correct it, or ask me to delete it. Use the contact details on this site and I will respond.",
      ],
    },
  ],
};
