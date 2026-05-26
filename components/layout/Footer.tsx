"use client";

import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { Phone, Mail } from "lucide-react";
import { services } from "@/lib/data/services";
import Image from "next/image";
import { useHydrated } from "@/hooks/useHydrated";
import { useTheme } from "next-themes";

const footerLinks = [
  { href: "/", labelKey: "home" as const },
  { href: "/services", labelKey: "services" as const },
  { href: "/contact", labelKey: "contact" as const },
];

export function Footer() {
  const t = useTranslations("footer");
  const navT = useTranslations("nav");
  const detailT = useTranslations("serviceDetail");
  const year = new Date().getFullYear();
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();

  const footerLogoSrc =
    mounted && resolvedTheme === "dark"
      ? "/images/logo/logo-horizontal-dark.webp"
      : "/images/logo/logo-horizontal-light.webp";

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {mounted ? (
                <Image
                  src={footerLogoSrc}
                  alt="ShineTechData logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              ) : (
                <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">
                    STD
                  </span>
                </div>
              )}
              <span className="font-bold text-lg tracking-tight">
                <span className="text-primary">Shine</span>
                TechData
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t("tagline")}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <a
                href="tel:+18295849184"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary
                transition-colors min-h-11"
                aria-label="Llamar al 829-584-9184"
              >
                <Phone className="size-4" /> 829-584-9184
              </a>

              <a
                href="mailto:contact@shinetechdata.com"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary
                transition-colors min-h-11"
                aria-label="Enviar correo a contact@shinetechdata.com"
              >
                <Mail className="size-4" />
                contact@shinetechdata.com
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("services")}</h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors
                        min-h-11 flex items-center"
                  >
                    {detailT(`services.${s.slug}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("company")}</h3>
            <ul className="space-y-2">
              {footerLinks.map(({ href, labelKey }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors
                        min-h-11 flex items-center"
                  >
                    {navT(labelKey)}
                  </Link>
                </li>
              ))}

              <li>
                <a
                  className="text-sm text-muted-foreground hover:text-primary transition-colors
                    min-h-11 flex items-center"
                >
                  {t("links.privacy")}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors 
                    min-h-11 flex items-center"
                >
                  {t("links.terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center
        justify-between gap-3"
        >
          <p className="text-xs text-muted-foreground">
            © {year} ShineTechData. {t("rights")}
          </p>

          <p className="text-xs text-muted-foreground">
            Dev: Wilfredery Ant. Dilone Cordero
          </p>
        </div>
      </div>
    </footer>
  );
}
