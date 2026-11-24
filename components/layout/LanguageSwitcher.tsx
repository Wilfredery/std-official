"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { alternatePathFor } from "@/lib/data/landings";

const localeLabels: Record<string, string> = {
  es: "ES",
  en: "EN",
};

// Each language named in itself, so it reads correctly whatever the page locale.
// The accessible name starts with the visible code ("ES Español") so voice
// control users can say what they see (WCAG 2.5.3 Label in Name).
const localeNames: Record<string, string> = {
  es: "Español",
  en: "English",
};

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleSwitch(newLocale: string) {
    // Landings exist in one locale only: switching away from one lands on its
    // closest page in the other locale instead of a 404.
    const target = alternatePathFor(pathname, newLocale) ?? pathname;
    router.replace(target, { locale: newLocale });
  }

  return (
    <div
      role="group"
      className="flex items-center rounded-full border border-border p-0.5 text-[10px] font-mono"
      aria-label={t("language")}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-label={`${localeLabels[l]} ${localeNames[l]}`}
          onClick={() => handleSwitch(l)}
          className={cn(
            "px-3 py-1.5 rounded-full uppercase tracking-widest transition-colors",
            locale === l
              ? "bg-foreground text-background"
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
