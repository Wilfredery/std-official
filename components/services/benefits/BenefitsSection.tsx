import { getTranslations } from "next-intl/server";
import { TrendingDown, Zap, Lightbulb, Activity } from "lucide-react";

const icons = [TrendingDown, Zap, Lightbulb, Activity];

export async function BenefitsSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.benefits");

  return (
    <section className="py-16 sm:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-4 block">
            {t("eyebrow")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
            {t("title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[0, 1, 2, 3].map((i) => {
            const Icon = icons[i];

            return (
              <div
                key={i}
                className="gradient-border-card glow-gradient p-6 hover-glow transition-shadow"
              >
                <div
                  className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center
                mb-4"
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {t(`items.${i}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`items.${i}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
