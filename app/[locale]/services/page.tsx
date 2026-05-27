import { setRequestLocale } from "next-intl/server";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServicesSection } from "@/components/services/ServicesSection";
import { BenefitsSection } from "@/components/services/benefits/BenefitsSection";

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
    </>
  );
}
