import { getTranslations } from "next-intl/server";
import { Crosshair, Lightbulb, ShieldCheck, Zap } from "lucide-react";

const valueIcons = [
  Crosshair, // Strategic Precision
  Lightbulb, // Adaptive Innovation
  ShieldCheck, // Integrity & Compliance
  Zap, // Sustainable Efficiency
];

export async function ValuesSection({ locale }: { locale: string }) {
  const t = await getTranslations("about.values");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-4 block">
            {t("eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, index) => {
            const Icon = valueIcons[index];
            return (
              <div
                key={item.title}
                className="gradient-border-card p-6 rounded-2xl glow-gradient transition-all duration-300 text-center"
              >
                <div className="mx-auto size-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
