import { getTranslations } from "next-intl/server";

export async function SolutionSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.solution");

  return (
    <section className="py-14 border-b border-border">
      <div className="max-w-7xl max-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-1xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-widset text-primary mb-4 block">
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
