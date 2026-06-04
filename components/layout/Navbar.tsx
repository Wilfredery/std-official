"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { useHydrated } from "@/hooks/useHydrated";
import { useTheme } from "@/lib/theme/ThemeContext";

const navLinks = [
  { href: "/", labelKey: "home" as const },
  { href: "/about", labelKey: "about" as const },
  { href: "/services", labelKey: "services" as const },
  { href: "/contact", labelKey: "contact" as const },
];

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/images/navbarFooter/logo-dark.webp"
      : "/images/navbarFooter/logo-light.webp";

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }
  return (
    <>
      <header
        data-testid={scrolled ? "navbar-scrolled" : "navbar"}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent",
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {mounted ? (
              <Image
                src={logoSrc}
                alt="ShineTechData isotipo"
                width={36}
                height={36}
                className="size-9 transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="size-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  ST
                </span>
              </div>
            )}
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">Shine</span>TechData
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, labelKey }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {t(labelKey)}
                </Link>
              );
            })}
          </div>

          {/*Desktop Actions*/}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />

            <Link
              href="/contact"
              className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-full 
            hover:bg-primary hover:text-primary-foreground transition-all focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {t("cta")}
            </Link>
          </div>

          {/*Mobile toggle*/}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t("menuOpen")}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </>
  );
}
