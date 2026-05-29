import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { ProblemSection } from "@/components/home/problem/ProblemSection";
import { SolutionSection } from "@/components/home/solution/SolutionSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProcessSection } from "@/components/home/process/ProcessSection";
import { CtaSection } from "@/components/home/cta/CtaSection";

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
