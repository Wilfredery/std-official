import { setRequestLocale } from "next-intl/server";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

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
    </>
  );
}
