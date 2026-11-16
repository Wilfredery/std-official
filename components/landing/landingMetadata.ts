import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import type { Landing } from "@/lib/data/landings";
import { landingUrl } from "@/components/landing/LandingJsonLd";

/**
 * Metadata for a Spanish-only landing. hreflang lists only `es` (self): there
 * is no English equivalent, so no `en` and no `x-default` alternates.
 */
export function buildLandingMetadata(landing: Landing): Metadata {
  const canonical = landingUrl(landing);
  const title = landing.seoTitle;
  const description = landing.seoDescription;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { es: canonical },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ShineTechData",
      images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630 }],
      locale: "es_DO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}
