"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useHydrated } from "@/hooks/useHydrated";
import { useTheme } from "next-themes";

const IMG_LIGHT = "/images/logo/logo-vertical.webp";
const IMG_DARK = "/images/decorations/composicion-visual-alt.webp";

export function MissionVision({ locale }: { locale: string }) {
  const t = useTranslations("about");
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();
  const imgSrc = mounted && resolvedTheme === "dark" ? IMG_DARK : IMG_LIGHT;

  return (
    <section className="py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
          {/*Image left*/}
          <div className="relative aspect-square max-w-md lg:mx-0 overflow-hidden rounded-2xl">
            {mounted ? (
              <Image
                src={imgSrc}
                alt="ShineTechData"
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted animate-pulse rounded-2xl" />
            )}
          </div>

          <div className="grid gap-6">
            <div className="gradient-border-card glow-gradient p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">{t("mission.title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("mission.description")}
              </p>
            </div>

            <div className="gradient-border-card glow-gradient p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">{t("vision.title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("vision.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
