import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { languageAlternates } from "@/lib/seo/alternates";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ContactHeader } from "@/components/contact/ContactHeader";
import { ContactChannels } from "@/components/contact/Channels/ContactChannels";
import { ContactFaq } from "@/components/contact/Faq/FaqSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const canonical = `${SITE_URL}/${locale}/contact/`;
  const ogImage = {
    url: `${SITE_URL}/opengraph-image.png`,
    width: 1200,
    height: 630,
  };

  return {
    title: t("contact.title"),
    description: t("contact.description"),
    alternates: {
      canonical,
      languages: languageAlternates("/contact/"),
    },
    openGraph: {
      title: t("contact.title"),
      description: t("contact.description"),
      url: canonical,
      siteName: "ShineTechData",
      images: [ogImage],
      locale: locale === "es" ? "es_DO" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("contact.title"),
      description: t("contact.description"),
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations({ locale, namespace: "nav" });
  const breadcrumb = (
    <BreadcrumbJsonLd
      items={[
        { name: nav("home"), url: `${SITE_URL}/${locale}/` },
        { name: nav("contact"), url: `${SITE_URL}/${locale}/contact/` },
      ]}
    />
  );

  return (
    <>
      {breadcrumb}
      {/* Above the fold: no ScrollReveal, so the LCP paints without waiting for hydration. */}
      <ContactHeader />

      <ScrollReveal direction="scale">
        <ContactChannels />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <ContactFaq />
      </ScrollReveal>
    </>
  );
}
