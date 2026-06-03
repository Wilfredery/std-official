"use client";

import { useTranslations } from "next-intl";

interface LegalPageProps {
  namespace: "privacy" | "terms";
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalPage({ namespace }: LegalPageProps) {
  const t = useTranslations(`legal.${namespace}`);
  const sections = t.raw("sections") as Array<{
    heading: string;
    items: string[];
  }>;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-12">
      <header className="space-y-4 mb-12">
        <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {t("lastUpdated")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("pageTitle")}
        </h1>
      </header>

      {/* Table of Contents */}
      <nav
        aria-label="Índice de secciones"
        className="mb-12 p-4 sm:p-6 rounded-lg border border-border bg-card"
      >
        <p className="text-sm font-semibold mb-3 text-foreground">
          {t("tocTitle")}
        </p>
        <ul className="space-y-2">
          {sections.map((section) => {
            const id = slugify(section.heading);
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div>
        {sections.map((section) => {
          const id = slugify(section.heading);
          return (
            <section
              key={id}
              id={id}
              className="pt-8 first:pt-0 border-t border-border first:border-t-0"
            >
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                {section.heading}
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                {section.items.map((item, i) => (
                  <li key={`${id}-item-${i}`}>{item}</li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
