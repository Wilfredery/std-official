"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

const localeLabels: Record<string, string> = {
  es: "ES",
  en: "EN",
};

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSwitch(newLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border p-0.5 text-[10px] font-mono relative",
        isPending && "opacity-70 pointer-events-none",
      )}
      aria-label={t("language")}
      aria-busy={isPending}
    >
      {isPending && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground flex items-center gap-0.5">
          <Loader2 className="size-2.5 animate-spin" />
          <span className="sr-only">{t("switching")}</span>
        </span>
      )}
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => handleSwitch(l)}
          className={cn(
            "px-3 py-1.5 rounded-full uppercase tracking-widest transition-colors",
            locale === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-current={locale === l ? "true" : undefined}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
