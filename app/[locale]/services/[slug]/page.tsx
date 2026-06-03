import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, locales } from "@/lib/site";
import { getServiceBySlug, serviceSlugs } from "@/lib/data/services";
import { ServiceDetailSection } from "@/components/services/detail/ServiceDetailSection";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import type { Service } from "@/lib/seo/types";

// 1. Esto le dice a Next.js qué páginas existen
//    En modo desarrollo (next dev), Next puede crearlas on-demand
//    En build estático, ESTO ES OBLIGATORIO
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of ["en", "es"]) {
    for (const slug of serviceSlugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

// 2. Metadata dinámica (SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({
    locale,
    namespace: "serviceDetail.services",
  });
  const serviceData = t.raw(slug) as { title: string; summary: string };

  const title = `${serviceData.title} | ShineTechData`;
  const description = serviceData.summary;
  const canonical = `${SITE_URL}/${locale}/services/${slug}/`;
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
        locales.map((l) => [l, `${SITE_URL}/${l}/services/${slug}/`])
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

// 3. La página
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Validar que el slug existe en nuestros datos
  const service = getServiceBySlug(slug);
  if (!service) {
    notFound(); // Muestra tu 404 personalizado
  }

  // Fetch translations for JSON-LD structured data
  const t = await getTranslations({
    locale,
    namespace: "serviceDetail.services",
  });
  const serviceData = t.raw(slug) as { title: string; summary: string };

  // Build breadcrumb items with locale-aware labels and URLs
  const homeLabel = locale === "es" ? "Inicio" : "Home";
  const servicesLabel = locale === "es" ? "Servicios" : "Services";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: homeLabel, url: `${SITE_URL}/${locale}/` },
          { name: servicesLabel, url: `${SITE_URL}/${locale}/services/` },
          {
            name: serviceData.title,
            url: `${SITE_URL}/${locale}/services/${slug}/`,
          },
        ]}
      />
      <JsonLd<Service>
        data={{
          "@type": "Service",
          name: serviceData.title,
          description: serviceData.summary,
          provider: {
            "@type": "Organization",
            name: "ShineTechData",
            url: SITE_URL,
          },
        }}
      />
      <ServiceDetailSection locale={locale} slug={slug} service={service} />
    </>
  );
}
