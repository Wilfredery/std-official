import { getTranslations } from "next-intl/server";
import { SubtitleTyping } from "./SubtitleTyping";
import { CtaLinks } from "./CtaLinks";

export async function HeroSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative overflow-hidden py-10 lg:pt-19">
      <div className="absolute inset-0 hero-glow -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm 
                    font-medium text-primary"
          >
            {t("badge")}
          </span>
          <div className="flex justify-center mb-8 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-7xl lg:text-6xl">
              {t("title")}{" "}
              <span className="gradient-text">{t("titleAccent")}</span>
            </h1>
          </div>

          {/* <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t("subtitle")}
          </p> */}
          <SubtitleTyping
            key={t("subtitleDynamic")}
            staticText={t("subtitleStatic")}
            dynamicText={t("subtitleDynamic")}
          />

          <CtaLinks
            primaryLabel={t("cta_primary")}
            secondaryLabel={t("cta_secondary")}
          />
        </div>
      </div>
    </section>
  );
}
