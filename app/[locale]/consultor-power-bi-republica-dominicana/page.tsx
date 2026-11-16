import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLandingBySlug } from "@/lib/data/landings";
import { LandingPage } from "@/components/landing/LandingPage";
import { buildLandingMetadata } from "@/components/landing/landingMetadata";

const landing = getLandingBySlug("consultor-power-bi-republica-dominicana")!;

// Spanish-only page: /en/consultor-power-bi-republica-dominicana/ is not generated and, with
// dynamicParams = false, 404s through the localized not-found.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "es") return {};
  return buildLandingMetadata(landing);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Defensive: never render the Spanish-only copy under another locale.
  if (locale !== "es") notFound();
  setRequestLocale(locale);

  return <LandingPage landing={landing} />;
}
