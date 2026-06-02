import { getTranslations } from "next-intl/server";
import { UserCog, Code2, BrainCircuit, ShieldCheck } from "lucide-react";
import { CtaButton } from "@/components/home/cta/CtaButton";

const icons = [UserCog, Code2, BrainCircuit, ShieldCheck];

export async function AboutTeam({ locale }: { locale: string }) {
  const t = await getTranslations("about.team");

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-balance">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[0, 1, 2, 3].map((i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                className="gradient-border-card p-6 rounded-2xl glow-gradient transition-all
                duration-300 text-center"
              >
                <div
                  className="mx-auto size-10 rounded-lg bg-primary/10 text-primary grid
                  place-items-center mb-4"
                >
                  <Icon className="size-6" />
                </div>
                <h3 className="font-bold mb-2">{t(`items.${i}.role`)}</h3>
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
