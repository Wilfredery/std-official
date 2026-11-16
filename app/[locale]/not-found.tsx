import type { Metadata } from "next";
import { NotFoundPage } from "@/components/404/NotFoundSection";

export const metadata: Metadata = {
  title: "404 | ShineTechData",
  robots: { index: false },
};

// Rendered inside the locale layout (navbar + footer) for notFound() calls
// and unknown paths caught by [...rest].
export default function LocaleNotFound() {
  return <NotFoundPage />;
}
