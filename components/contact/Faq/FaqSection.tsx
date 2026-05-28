import { getTranslations } from "next-intl/server";

export async function ContactFaq() {
  const t = await getTranslations("contact.faq");

  return (
    <section className="pt-16 sm:pt-20 border-t border-border bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-12">
          {t("title")}
        </h2>
        <div className="flex flex-col gap-6">
          {([0, 1, 2, 3] as const).map((i) => (
            <details
              key={i}
              className="group rounded-xl border border-border bg-card gradient-border-card hover-glow"
            >
              <summary
                className="px-8 py-6 font-bold cursor-pointer list-none flex justify-between
                items-center text-lg focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-ring rounded-lg"
              >
                {t(`items.${i}.q` as `items.${number}.q`)}
                <span
                  className="text-primary group-open:rotate-45 transition-transform text-xl leading-none"
                >
                  +
                </span>
              </summary>
              <p className="px-8 pb-6 text-base text-muted-foreground">
                {t(`items.${i}.a` as `items.${number}.a`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
