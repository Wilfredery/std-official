"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", labelKey: "home" as const },
  { href: "/about", labelKey: "about" as const },
  { href: "/services", labelKey: "services" as const },
  { href: "/contact", labelKey: "contact" as const },
];

export function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="text-left">ShineTechData</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-2">
          {navLinks.map(({ href, labelKey }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                prefetch={false}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-medium transition-colors",
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
        </nav>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border px-2 ">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="mt-4 px-2">
          <Link
            href="/contact"
            prefetch={false}
            onClick={() => onOpenChange(false)}
            className="block text-center text-sm font-semibold bg-primary text-primary-foreground px-4
            py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            {t("cta")}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
