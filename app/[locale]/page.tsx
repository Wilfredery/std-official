import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { ProblemSection } from "@/components/home/problem/ProblemSection";
import { SolutionSection } from "@/components/home/solution/SolutionSection";
import { ServicesSection } from "@/components/home/services/ServicesSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BenefitsSection } from "@/components/home/benefits/BenefitsSection";

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
        <ServicesSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="scale">
        <BenefitsSection locale={locale} />
      </ScrollReveal>
    </>
  );
}
