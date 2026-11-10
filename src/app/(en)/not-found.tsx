import { NotFoundView } from "@/views/not-found";

/** `notFound()` inside the site. Unmatched URLs use `app/global-not-found.tsx`. */
export default function NotFound() {
  return <NotFoundView />;
}
