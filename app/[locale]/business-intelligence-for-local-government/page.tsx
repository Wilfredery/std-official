import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLandingBySlug } from "@/lib/data/landings";
import { LandingPage } from "@/components/landing/LandingPage";
import { buildLandingMetadata } from "@/components/landing/landingMetadata";

const landing = getLandingBySlug("business-intelligence-for-local-government")!;

// English-only page: /es/business-intelligence-for-local-government/ is not generated and, with
// dynamicParams = false, 404s through the localized not-found.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};
  return buildLandingMetadata(landing);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Defensive: never render the English-only copy under another locale.
  if (locale !== "en") notFound();
  setRequestLocale(locale);

  return <LandingPage landing={landing} />;
}
