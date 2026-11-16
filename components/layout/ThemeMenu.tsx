"use client";

import { useEffect, useRef, type ReactElement } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/lib/theme/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Loaded on first interaction with ThemeToggle: the menu primitive and its
// positioning engine are ~170 KB of JS that most visitors never need.
export function ThemeMenu({ trigger }: { trigger: ReactElement }) {
  const t = useTranslations("nav");
  const { theme, setTheme } = useTheme();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Replay the click that loaded this chunk on the real trigger. A genuine
  // trigger press (unlike `defaultOpen`) moves focus into the menu, so arrow
  // keys and Escape work and focus returns to the button on close.
  // Deferred a task: Base UI wires the trigger to the menu store after the
  // first commit, and a click before that is ignored.
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerRef.current?.focus();
      triggerRef.current?.click();
    }, 0);
    // Cancelling keeps StrictMode's double effect run in dev to one click.
    return () => clearTimeout(timer);
  }, []);

  const options = [
    { value: "light", label: t("themeLight"), Icon: Sun },
    { value: "dark", label: t("themeDark"), Icon: Moon },
    { value: "system", label: t("themeSystem"), Icon: Monitor },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger ref={triggerRef} render={trigger} />

      <DropdownMenuContent align="end" sideOffset={4}>
        {options.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            className={theme === value ? "bg-accent" : ""}
            onClick={() => setTheme(value)}
          >
            <Icon className="size-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
