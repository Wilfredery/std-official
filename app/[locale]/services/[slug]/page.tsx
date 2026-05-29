import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getServiceBySlug, serviceSlugs } from "@/lib/data/services";
import { ServiceDetailSection } from "@/components/services/detail/ServiceDetailSection";

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
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({
    locale,
    namespace: "serviceDetail.services",
  });
  const serviceData = t.raw(slug) as { title: string; summary: string };

  return {
    title: `${serviceData.title} | ShineTechData`,
    description: serviceData.summary,
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

  return (
    <ServiceDetailSection locale={locale} slug={slug} service={service} />
  );
}
