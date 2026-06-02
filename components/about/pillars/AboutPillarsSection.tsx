import { getTranslations } from "next-intl/server";
import {
  Database,
  LayoutDashboard,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Workflow,
} from "lucide-react";

const icons = [
  Database,
  LayoutDashboard,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Workflow,
];
const keys = [
  "data-analysis",
  "business-intelligence",
  "machine-learning",
  "data-auditing",
  "digital-transformation",
  "process-automation",
];

export async function PillarsSection({ locale }: { locale: string }) {
  const t = await getTranslations("about.pillars");

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span
            className="text-xs font-mono uppercase tracking-widest text-primary
                mb-4 block"
          >
            {t("eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-balance">
            {t("title")} <span>{t("titleAccent")}</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <div
                key={key}
                className="gradient-border-card p-6 rounded-2xl glow-gradient hover-glow
                    transition-all duration-300"
              >
                <div
                  className="size-10 rounded-lg bg-primary/10 text-primary grid 
                        place-items-center mb-4"
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="font-bold mb-2">{t(`titles.${key}`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`descriptions.${key}`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
