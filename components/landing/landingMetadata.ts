import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { landingLocaleTags, type Landing } from "@/lib/data/landings";
import { landingUrl } from "@/components/landing/LandingJsonLd";

/**
 * Metadata for a single-locale landing. hreflang lists only its own locale
 * (self): there is no translation, so no other locale and no `x-default`.
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
      languages: { [landing.locale]: canonical },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ShineTechData",
      images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630 }],
      locale: landingLocaleTags[landing.locale].og,
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
