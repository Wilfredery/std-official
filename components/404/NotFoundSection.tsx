"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="gradient-text text-8xl font-extrabold sm:text-9xl">
          404
        </h1>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-8">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <ArrowLeft className="size-4" />
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}
