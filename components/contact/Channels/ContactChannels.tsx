"use client";

import { useTranslations } from "next-intl";
import { MessageCircle, Mail, Clock } from "lucide-react";
import Image from "next/image";
import { useHydrated } from "@/hooks/useHydrated";
import { useTheme } from "next-themes";

const IMG_LIGHT = "/images/logo/logo-vertical.webp";
const IMG_DARK = "/images/decorations/composicion-visual-alt.webp";

export function ContactChannels() {
  const t = useTranslations("contact.channels");
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();

  const imgSrc = mounted && resolvedTheme === "dark" ? IMG_DARK : IMG_LIGHT;
  {
    /*WhatsApp*/
  }
  const wa = `https://wa.me/${t("number")}?text=${encodeURIComponent(t("message"))}`;
  {
    /*Email*/
  }
  const email = t("email");
  const subject = encodeURIComponent(t("subject"));
  const body = encodeURIComponent(t("body"));
  const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center
                mb-8"
        >
          {t("title")} <span className="gradient-text">{t("titleAccent")}</span>
        </h2>
        <div className="flex flex-col gap-12">
          {/*Image left*/}
          {/* <div className="relative aspect-square max-w-2xl mx-auto w-full overflow-hidden rounded-2xl">
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
          </div> */}
          {/*Card right*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/*WS card*/}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("whatsappAria")}
              className="gradient-border-card p-6 text-center hover-glow transition-all ..."
            >
              <MessageCircle className="size-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-bold text-lg mb-1">{t("whatsapp")}</h3>
              <p className="text-sm text-muted-foreground">{t("phoneValue")}</p>
            </a>

            {/*Email card*/}
            <a
              href={mailto}
              className="gradient-border-card p-6 text-center hover-glow transition-all ..."
            >
              <Mail className="size-8 mx-auto mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-1">{t("email")}</h3>
              <p className="text-sm text-muted-foreground">{t("emailValue")}</p>
            </a>

            {/* Instagram card */}
            <a
              href="https://www.instagram.com/shinetechdata/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("instagramAria")}
              className="gradient-border-card p-6 text-center hover-glow transition-all duration-300"
            >
              <svg
                className="size-8 mx-auto mb-3 text-pink-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <h3 className="font-bold text-lg mb-1">{t("instagram")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("instagramValue")}
              </p>
            </a>

            {/*Hours + Remote card*/}
            <div className="gradient-border-card p-6 text-center">
              <Clock className="size-8 mx-auto mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-1">{t("hours")}</h3>
              <p className="text-sm text-muted-foreground">{t("hoursValue")}</p>
              <p className="text-sm font-medium text-primary mt-2">
                {t("meeting")} - {t("meetingValue")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
