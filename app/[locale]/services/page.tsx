import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL, locales } from "@/lib/site";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServicesSection } from "@/components/services/ServicesSection";
import { BenefitsSection } from "@/components/services/benefits/BenefitsSection";
import { CtaSection } from "@/components/services/cta/CtaSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const canonical = `${SITE_URL}/${locale}/services/`;
  const ogImage = {
    url: `${SITE_URL}/opengraph-image.png`,
    width: 1200,
    height: 630,
  };

  return {
    title: t("services.title"),
    description: t("services.description"),
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/services/`])
      ),
    },
    openGraph: {
      title: t("services.title"),
      description: t("services.description"),
      url: canonical,
      siteName: "ShineTechData",
      images: [ogImage],
      locale: locale === "es" ? "es_DO" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("services.title"),
      description: t("services.description"),
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ScrollReveal direction="up">
        <ServicesHeader locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="down">
        <ServicesSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="scale">
        <BenefitsSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="down">
        <CtaSection locale={locale} />
      </ScrollReveal>
    </>
  );
}
