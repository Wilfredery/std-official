import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { languageAlternates } from "@/lib/seo/alternates";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { ProblemSection } from "@/components/home/problem/ProblemSection";
import { SolutionSection } from "@/components/home/solution/SolutionSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProcessSection } from "@/components/home/process/ProcessSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { LatestPostsSection } from "@/components/home/blog/LatestPostsSection";
import { CtaSection } from "@/components/home/cta/CtaSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const canonical = `${SITE_URL}/${locale}`;
  const ogImage = { url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630 };

  return {
    title: t("home.title"),
    description: t("home.description"),
    alternates: {
      canonical,
      languages: languageAlternates("/"),
    },
    openGraph: {
      title: t("home.title"),
      description: t("home.description"),
      url: canonical,
      siteName: "ShineTechData",
      images: [ogImage],
      locale: locale === "es" ? "es_DO" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("home.title"),
      description: t("home.description"),
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Above the fold: no ScrollReveal, so the LCP paints without waiting for hydration. */}
      <HeroSection />

      <ScrollReveal direction="left">
        <ProblemSection />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <SolutionSection />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <ServicesSection />
      </ScrollReveal>

      <ScrollReveal direction="down">
        <ProcessSection />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <LatestPostsSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <CtaSection />
      </ScrollReveal>
    </>
  );
}
