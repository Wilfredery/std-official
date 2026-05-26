import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero/HeroSection";

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
    </>
  );
}
