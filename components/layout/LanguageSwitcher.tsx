"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
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

  function handleSwitch(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div
      className="flex items-center rounded-full border border-border p-0.5 text-[10px] font-mono"
      aria-label={t("language")}
    >
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
