import { getTranslations } from "next-intl/server";
import { services } from "@/lib/data/services";
import { ServicesSlider } from "./ServicesSlider";

export async function ServicesSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.services");
  const tDetail = await getTranslations("serviceDetail");
  const tCommon = await getTranslations("common");

  const titles: Record<string, string> = {};
  const shortDescriptions: Record<string, string> = {};

  for (const service of services) {
    titles[service.slug] = tDetail(`services.${service.slug}.title`);
    shortDescriptions[service.slug] = tDetail(
      `services.${service.slug}.shortDescription`,
    );
  }
  return (
    <section className="py-14 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className="text-xs font-mono uppercase tracking-widest text-primary
                    mb-4 block"
          >
            {t("eyebrow")}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance
                    mb-4"
          >
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <ServicesSlider
        titles={titles}
        shortDescriptions={shortDescriptions}
        learnMoreLabel={tCommon("learnMore")}
      />
    </section>
  );
}
