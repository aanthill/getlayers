import { HomeView } from "@/views/home";

/** The Spanish home as robots get it — the proxy's rewrite of `/es`. */
export default function RobotHomeEs() {
  return <HomeView lang="es" robot />;
}
