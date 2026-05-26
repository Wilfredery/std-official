import { getTranslations } from "next-intl/server";

export async function SolutionSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.solution");

  return (
    <section className="py-16 sm:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-4 block">
            {t("eyebrow")}
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
