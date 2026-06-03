import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL, locales } from "@/lib/site";
import { AboutHeader } from "@/components/about/hero/AboutHeader";
import { BrandStory } from "@/components/about/brandStory/AboutBrandStory";
import { MissionVision } from "@/components/about/missionVission/AboutMissionVision";
import { ValuesSection } from "@/components/about/values/AboutValuesSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillarsSection } from "@/components/about/pillars/AboutPillarsSection";
import { AboutCtaLinks } from "@/components/about/cta/AboutCtaLinks";
import { AboutTeam } from "@/components/about/team/AboutTeam";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  const title = t("about.title");
  const description = t("about.description");

  const canonical = `${SITE_URL}/${locale}/about/`;
  const ogImage = {
    url: `${SITE_URL}/opengraph-image.png`,
    width: 1200,
    height: 630,
  };

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/about/`])
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ShineTechData",
      images: [ogImage],
      locale: locale === "es" ? "es_DO" : "en_US",
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollReveal direction="up">
        <AboutHeader locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <BrandStory locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <MissionVision locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <ValuesSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <PillarsSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <AboutTeam locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <AboutCtaLinks locale={locale} />
      </ScrollReveal>
    </>
  );
}
