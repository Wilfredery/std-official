import { getTranslations } from "next-intl/server";
import { CtaButton } from "@/components/home/cta/CtaButton";

export async function AboutCtaLinks({ locale }: { locale: string }) {
  const t = await getTranslations("about.cta");

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl overflow-hidden gradient-border-card p-8 sm:p-12
        lg:p-16 text-center"
        >
          <div className="absolute inset-0 hero-glow -z-[1] opacity-50" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            {t("subtitle")}
          </p>
          <CtaButton label={t("button")} />
        </div>
      </div>
    </section>
  );
}
