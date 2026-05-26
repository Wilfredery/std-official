import { getTranslations } from "next-intl/server";
export async function ProblemSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.problem");
  return (
    <section className="py-12 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-4 block">
            {t("eyebrow")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t("title")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="gradient-border-card glow-gradient animate-[fadeInUp_0.6s_ease-out_forwards] p-6"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="size-8 rounded-lg bg-destructive/10 text-destructive grid place-items-center mb-3">
                <span className="text-sm font-bold">{i + 1}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`items.${i}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
