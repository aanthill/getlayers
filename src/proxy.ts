// 📖 Docs: obsidian/frontend/robot-form.md

import { NextResponse, type NextRequest } from "next/server";

import { isBotUserAgent } from "@/utils/bot-ua";

/**
 * Robots get the home page at rest.
 *
 * A crawler, an AI crawler or a lab tool (Lighthouse, PageSpeed) asking for `/`
 * is rewritten to `/robot-view`: the same view, content, metadata and
 * canonical — without the intro and the motion a robot never watches, and
 * with every line of copy in the served HTML. Both routes stay static: the UA
 * is read here, not with `headers()` in the page, so the human `/` stays
 * prerendered and CDN-cached. A person who types `/robot-view` is sent to `/`.
 *
 * Each language has its own home and robot form (`/es` → `/robot-view/es`).
 * Add other animated routes the same way (`/about` → `/robot-view/about`) if
 * the project grows them.
 */
/** Each language's home and the robot form it is rewritten to. */
const ROBOT_FORMS: Record<string, string> = {
  "/": "/robot-view",
  "/es": "/robot-view/es",
};

export function proxy(request: NextRequest) {
  const bot = isBotUserAgent(request.headers.get("user-agent"));
  const { pathname } = request.nextUrl;
  const robotForm = ROBOT_FORMS[pathname];
  // A robot on a language's home → that language's robot form. Never a
  // language redirect: every version must answer 200 to a crawler as linked.
  if (robotForm && bot) {
    return NextResponse.rewrite(new URL(robotForm, request.url));
  }
  const home = Object.keys(ROBOT_FORMS).find((key) => ROBOT_FORMS[key] === pathname);
  if (home && !bot) {
    return NextResponse.redirect(new URL(home, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/robot-view", "/es", "/robot-view/es"],
};
