import { HomeView } from "@/views/home";

/**
 * The home page as robots get it — reached only through the proxy's rewrite of
 * `/` (`src/proxy.ts`). Inherits the layout's metadata, so its canonical is
 * `/`. Never `noindex` it.
 */
export default function RobotHome() {
  return <HomeView lang="en" robot />;
}
