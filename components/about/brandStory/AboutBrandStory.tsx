import { getTranslations } from "next-intl/server";

export async function BrandStory({ locale }: { locale: string }) {
  const t = await getTranslations("about.story");

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-12">
          {t("title")}
        </h2>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("origin")}
            </p>
          </div>
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("philosophy")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
