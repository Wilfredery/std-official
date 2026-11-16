import { notFound } from "next/navigation";

// Unknown paths under a valid locale (/es/foo/) would otherwise fall through
// to the root not-found, outside the locale layout. Catch them here so the
// localized 404 renders with navbar and footer.
export default function CatchAllNotFound() {
  notFound();
}
