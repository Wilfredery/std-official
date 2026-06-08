export type Theme = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

export const THEMES = ["light", "dark", "system"] as const;

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  themes: readonly Theme[];
}
