"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useHydrated } from "@/hooks/useHydrated";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useHydrated();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </Button>
        }
      />

      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuItem
          className={theme === "light" ? "bg-accent" : ""}
          onClick={() => setTheme("light")}
        >
          <Sun className="size-4 mr-2" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          className={theme === "dark" ? "bg-accent" : ""}
          onClick={() => setTheme("dark")}
        >
          <Moon className="size-4 mr-2" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          className={theme === "system" ? "bg-accent" : ""}
          onClick={() => setTheme("system")}
        >
          <Monitor className="size-4 mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
