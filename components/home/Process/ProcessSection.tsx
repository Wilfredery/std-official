import { getTranslations } from "next-intl/server";
import { Search, PenTool, Rocket } from "lucide-react";

const icons = [Search, PenTool, Rocket];

export async function ProcessSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.process");

  return (
    <section className="py-16 sm:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span
            className="text-xs font-mono uppercase tracking-widest text-primary
                    mb-4 block"
          >
            {t("eyebrow")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
            {t("title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
          {/*connecting Line (desktop only) */}
          <div
            className="hidden sm:block absolute top-10 left-[16.67%] right-[16.67%]
                    h-px bg-border"
          />
          {[0, 1, 2].map((i) => {
            const Icon = icons[i];

            return (
              <div
                key={i}
                className="flex flex-col items-center text-center relative"
              >
                <div
                  className="size-20 rounded-full bg-primary/10 grid
                                    place-items-center mb-4 relative z-10 border-4 border-background"
                >
                  <Icon className="size-8 text-primary" />
                </div>

                <span className="text-xs font-mono text-muted-foreground mb-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-lg mb-2">
                  {t(`steps.${i}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {t(`steps.${i}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
