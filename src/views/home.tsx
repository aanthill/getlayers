import { JsonLd } from "@/components/common/json-ld";
import { RobotProvider, RobotView } from "@/components/common/robot-view";
import { About } from "@/components/portfolio/about";
import { Contact } from "@/components/portfolio/contact";
import { Hero } from "@/components/portfolio/hero";
import { KineticBand } from "@/components/portfolio/kinetic-band";
import { ProjectPanel } from "@/components/portfolio/project-panel";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { UpcomingPanel } from "@/components/portfolio/upcoming-panel";
import { WorkGallery } from "@/components/portfolio/work-gallery";
import { getPortfolioContent } from "@/data/portfolio";
import type { Locale } from "@/lib/i18n";
import { getPersonStructuredData } from "@/utils/seo/person-structured-data";

/** The year the copy was last touched — not the build time (static page). */
const COPYRIGHT_YEAR = 2026;

const number = (index: number) => String(index + 1).padStart(2, "0");

/**
 * The portfolio — a Server Component. Every string comes from the language's
 * content file (`src/data/portfolio/<lang>.ts`); the sections are client
 * leaves in `src/components/portfolio/`.
 *
 * `robot` is the robot form (obsidian/frontend/robot-form.md): the same
 * content at rest — a still for the 3D scene, the gallery stacked, no cursor.
 * Never read `headers()` here: the route must stay static.
 */
export const HomeView = ({ lang, robot = false }: { lang: Locale; robot?: boolean }) => {
  const content = getPortfolioContent(lang);
  const panels = [
    ...content.projects.map(({ id, name }) => ({ id, name })),
    { id: content.upcoming.id, name: content.upcoming.name },
  ];
  return (
    <RobotProvider robot={robot}>
      {robot && <RobotView />}
      <JsonLd data={getPersonStructuredData(content)} />
      <SiteHeader content={content} />
      <main className="w-full overflow-x-clip">
        <Hero person={content.person} copy={content.hero} index={panels} />
        <KineticBand words={content.marquee} />
        <WorkGallery title={content.work.title} jumpLabel={content.work.jump} panels={panels}>
          {content.projects.map((project, index) => (
            <ProjectPanel
              key={project.id}
              project={project}
              number={number(index)}
              copy={content.work}
            />
          ))}
          <UpcomingPanel upcoming={content.upcoming} number={number(content.projects.length)} />
        </WorkGallery>
        <KineticBand words={content.marquee} reverse />
        <About copy={content.about} />
        <Contact copy={content.contact} />
      </main>
      <SiteFooter content={content} year={COPYRIGHT_YEAR} />
    </RobotProvider>
  );
};
