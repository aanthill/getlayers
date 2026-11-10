import Link from "next/link";

/** The 404 — served with a 404 status, so crawlers see a real not-found. */
export const NotFoundView = () => (
  <main className="flex min-h-lvh w-full flex-col items-start justify-end gap-6 p-4 lg:p-8">
    <h1 className="type-display text-mega leading-mega tracking-mega">404</h1>
    <p className="text-lead text-muted">This page could not be found.</p>
    <Link
      href="/"
      className="type-label border-b border-foreground pb-1 transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-emphasis"
    >
      Back to home
    </Link>
  </main>
);
