// 📖 Docs: obsidian/frontend/components/portfolio.md

import type { PortfolioContent } from "@/data/portfolio";

export interface UpcomingPanelProps {
  upcoming: PortfolioContent["upcoming"];
  number: string;
}

/** Slots shown at least — filled from `upcoming.items`, the rest stay open. */
const SLOTS = 3;

/**
 * What is coming. The slots are data: add an entry to `upcoming.items` in
 * `src/data/portfolio/<lang>.ts` and it takes the next open one.
 */
export const UpcomingPanel = ({ upcoming, number }: UpcomingPanelProps) => {
  const count = Math.max(SLOTS, upcoming.items.length);
  return (
    <article
      aria-labelledby={`work-${upcoming.id}-title`}
      className="grid w-full gap-8 lg:grid-cols-12 lg:items-center lg:gap-10"
    >
      <div className="flex flex-col gap-5 lg:col-span-5">
        <p aria-hidden="true" className="type-display text-display leading-display text-emphasis">
          {number}
        </p>
        <h3 id={`work-${upcoming.id}-title`} className="type-display text-title leading-display">
          {upcoming.name}
        </h3>
        <p className="max-w-xl text-body leading-copy">{upcoming.summary}</p>
      </div>
      <ol className="grid gap-3 lg:col-span-7 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => {
          const item = upcoming.items[index];
          return (
            <li
              key={item?.name ?? index}
              className={`flex aspect-[4/3] flex-col justify-between border p-4 lg:aspect-[3/4] ${
                item ? "border-foreground bg-surface" : "border-dashed border-line text-muted"
              }`}
            >
              <span className="type-label">{String(index + 1).padStart(2, "0")}</span>
              <span className="flex flex-col gap-1">
                <span className="type-display text-lead leading-display">
                  {item?.name ?? upcoming.openSlot}
                </span>
                <span className="text-label leading-copy">{item?.note ?? upcoming.openSlotNote}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </article>
  );
};
