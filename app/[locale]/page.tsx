import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL, locales } from "@/lib/site";
import { routing } from "@/lib/i18n/routing";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { ProblemSection } from "@/components/home/problem/ProblemSection";
import { SolutionSection } from "@/components/home/solution/SolutionSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProcessSection } from "@/components/home/process/ProcessSection";
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
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`])),
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
      <ScrollReveal direction="up">
        <HeroSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <ProblemSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <SolutionSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="down">
        <ProcessSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <CtaSection locale={locale} />
      </ScrollReveal>
    </>
  );
}
