import { getTranslations } from "next-intl/server";
import { CtaButton } from "./CtaButton";

export async function CtaSection({ locale }: { locale: string }) {
  const t = await getTranslations("services.cta");

  return (
    <section className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl overflow-hidden gradient-border-card p-8
                sm:p-12 lg:p-16 text-center"
        >
          <div className="absolute inset-0 hero-glow -z-[1] opacity-50" />
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 block">
            {t("title")}
          </span>
          <p
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 
                        leading-relaxed"
          >
            {t("subtitle")}
          </p>
          <CtaButton label={t("button")} />
        </div>
      </div>
    </section>
  );
}
