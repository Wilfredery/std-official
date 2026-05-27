import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { setRequestLocale } from "next-intl/server";
import { ContactHeader } from "@/components/contact/ContactHeader";
import { ContactChannels } from "@/components/contact/Channels/ContactChannels";

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
        <ContactHeader locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="scale">
        <ContactChannels />
      </ScrollReveal>
    </>
  );
}
