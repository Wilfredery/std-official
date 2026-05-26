import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { ProblemSection } from "@/components/home/problem/ProblemSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection locale={locale} />
      <ProblemSection locale={locale} />
    </>
  );
}
