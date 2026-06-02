import { setRequestLocale } from "next-intl/server";
import { AboutHeader } from "@/components/about/hero/AboutHeader";
import { BrandStory } from "@/components/about/brandStory/AboutBrandStory";
import { MissionVision } from "@/components/about/missionVission/AboutMissionVision";
import { ValuesSection } from "@/components/about/values/AboutValuesSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillarsSection } from "@/components/about/pillars/AboutPillarsSection";
import { AboutCtaLinks } from "@/components/about/cta/AboutCtaLinks";
import { AboutTeam } from "@/components/about/team/AboutTeam";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollReveal direction="up">
        <AboutHeader locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <BrandStory locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <MissionVision locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <ValuesSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <PillarsSection locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <AboutTeam locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <AboutCtaLinks locale={locale} />
      </ScrollReveal>
    </>
  );
}
