import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <section className="flex items-center justify-center min-h-[60vh] py-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-8xl font-extrabold gradient-text sm:text-9xl">
          404
        </h1>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          {t("description")}
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary/80"
          >
            <ArrowLeft className="size-4" />
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}