// 📖 Docs: obsidian/frontend/components/portfolio.md

import type { PortfolioContent, Project } from "@/data/portfolio";

import { ImagePlate } from "./image-plate";
import { ScreenFrames } from "./screen-frames";
import { SignalPipeline } from "./signal-pipeline";
import { UptimeStrip } from "./uptime-strip";

export interface ProjectPanelProps {
  project: Project;
  number: string;
  copy: PortfolioContent["work"];
}

const ProjectVisual = ({ project, number, copy }: ProjectPanelProps) => {
  if (project.visual === "sitetimeline" && project.screenshots) {
    return (
      <div className="flex min-w-0 flex-col gap-6">
        <ScreenFrames
          label={copy.screens}
          screenshots={project.screenshots}
          href={project.links[0]?.href}
          cursor={copy.cursor}
        />
        {project.stripCaption && <UptimeStrip caption={project.stripCaption} />}
      </div>
    );
  }
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <ImagePlate
        image={project.image}
        label={copy.imageSlot}
        number={number}
        className="aspect-video w-full lg:aspect-auto lg:h-[44lvh]"
      />
      {project.pipeline && <SignalPipeline title={copy.howItWorks} steps={project.pipeline} />}
    </div>
  );
};

/**
 * One project: number, name, a short description, the technologies, links —
 * and the work itself, shown rather than described.
 */
export const ProjectPanel = ({ project, number, copy }: ProjectPanelProps) => (
  <article
    aria-labelledby={`work-${project.id}-title`}
    className="grid w-full gap-8 lg:grid-cols-12 lg:items-center lg:gap-10"
  >
    <div className="flex flex-col gap-5 lg:col-span-5">
      <p aria-hidden="true" className="type-display text-display leading-display text-emphasis">
        {number}
      </p>
      <h3
        id={`work-${project.id}-title`}
        className="type-display text-title leading-display"
      >
        {project.name}
      </h3>
      <p className="max-w-xl text-body leading-copy">{project.summary}</p>
      <ul aria-label={copy.technologies} className="type-label flex flex-wrap gap-2">
        {project.technologies.map((technology) => (
          <li key={technology} className="border border-foreground px-2 py-1">
            {technology}
          </li>
        ))}
      </ul>
      {project.features && (
        <dl className="grid gap-3 border-t border-line pt-4 lg:grid-cols-3">
          {project.features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-1">
              <dt className="type-label">{feature.title}</dt>
              <dd className="text-label leading-copy text-muted">{feature.text}</dd>
            </div>
          ))}
        </dl>
      )}
      {project.links.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {project.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="type-label group inline-flex items-center gap-3 border border-foreground bg-foreground px-4 py-3 text-background transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-accent hover:text-accent-contrast"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-[var(--duration-fast)] ease-entrance group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="min-w-0 lg:col-span-7">
      <ProjectVisual project={project} number={number} copy={copy} />
    </div>
  </article>
);
