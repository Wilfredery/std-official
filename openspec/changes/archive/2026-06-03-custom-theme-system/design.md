# Design: Replace next-themes with Custom Theme System

## Technical Approach

Build a lightweight, React-19-compatible theme system using a React Context provider, a synchronous anti-flash script outside the React tree, and a `useTheme` hook with an API shape identical to `next-themes`. The system replaces the `next-themes` dependency entirely while preserving behavior for 7 consumers and 7 test files.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| State container | React Context + `useState` | Zustand / Redux | No external dependency; theme state is local and small |
| Anti-flash mechanism | Inline `<script>` in `<head>` | `next-themes` script injection | React 19 rejects in-component `<script>` during hydration; `<head>` runs before paint |
| Theme class target | `document.documentElement` | `document.body` | Matches Tailwind v4 `dark` variant (`:is(.dark *)`) and existing CSS |
| localStorage key | `"theme"` | Custom key | Keeps compatibility if users already have a saved preference |
| SSR default | No `.dark` class | Pre-compute from header | Simpler; script corrects class before first paint |

## Data Flow

```
Server render ──→ <html> without .dark
                        │
Browser ─────────→ <head> script reads localStorage/matchMedia
                        │
                applies .dark to <html> before paint
                        │
Hydration ───────→ React mounts with suppressHydrationWarning
                        │
useEffect ───────→ ThemeProvider reads localStorage
                        │
                matchMedia listener registered (if system)
                        │
setTheme() ──────→ updates state → writes localStorage → toggles .dark
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `lib/theme/types.ts` | Create | `Theme`, `ResolvedTheme`, `ThemeContextValue` types |
| `lib/theme/ThemeContext.tsx` | Create | Provider, `useTheme` hook, localStorage + matchMedia logic |
| `components/providers/theme-provider.tsx` | Modify | Re-export custom `ThemeProvider`; remove `next-themes` wrapper |
| `app/[locale]/layout.tsx` | Modify | Add anti-flash inline script in `<head>`; keep `suppressHydrationWarning` |
| `components/layout/ThemeToggle.tsx` | Modify | Change import from `next-themes` to `@/lib/theme/ThemeContext` |
| `components/layout/Footer.tsx` | Modify | Change import from `next-themes` to `@/lib/theme/ThemeContext` |
| `components/layout/Navbar.tsx` | Modify | Change import from `next-themes` to `@/lib/theme/ThemeContext` |
| `components/about/missionVission/AboutMissionVision.tsx` | Modify | Change import from `next-themes` to `@/lib/theme/ThemeContext` |
| `hooks/useThemeShortcut.ts` | Modify | Change import from `next-themes` to `@/lib/theme/ThemeContext` |
| `components/layout/ThemeShortcut.tsx` | Modify | Change import from `next-themes` to `@/lib/theme/ThemeContext` |
| `__tests__/**` (7 files) | Modify | Update mocks from `next-themes` to `@/lib/theme/ThemeContext` |
| `package.json` | Modify | Remove `next-themes` dependency |
| `pnpm-lock.yaml` | Modify | Remove `next-themes` entries |

## Interfaces / Contracts

```ts
// lib/theme/types.ts
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  themes: Theme[];
}
```

```ts
// lib/theme/ThemeContext.tsx
export function ThemeProvider({ children }: { children: React.ReactNode });
export function useTheme(): ThemeContextValue;
```

## Anti-flash Script (inline in `<head>`)

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      try {
        const t = localStorage.getItem("theme");
        if (t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches)) {
          document.documentElement.classList.add("dark");
        }
      } catch (e) {}
    `,
  }}
/>
```

## Hydration Strategy

- `<html suppressHydrationWarning>` prevents React 19 mismatch warnings.
- SSR never emits `.dark` — the script corrects the DOM class before paint.
- `ThemeProvider` reads `localStorage` inside `useEffect` (client-only) so initial render matches SSR output.

## State Machine

```
light ──setTheme("dark”)──→ dark
light ──setTheme("system”)─→ system ──[matchMedia dark]──→ resolved: dark
                                      └─[matchMedia light]─→ resolved: light
dark ──setTheme("light”)──→ light
dark ──setTheme("system”)─→ system ──[matchMedia dark]──→ resolved: dark
                                      └─[matchMedia light]─→ resolved: light
system ──OS switches dark──→ resolved: dark
system ──OS switches light──→ resolved: light
```

- On `setTheme`, write to `localStorage`, update state, and toggle `.dark` class.
- When `theme === "system"`, attach `matchMedia` listener; clean up on unmount or theme change.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useTheme` hook states | `renderHook` + `act` for all 4 states (`light`, `dark`, `system→light`, `system→dark`) |
| Unit | `ThemeProvider` | Assert context values, localStorage read/write, matchMedia subscription/cleanup |
| Integration | Consumers (7 files) | Update `vi.mock` target; assert no regression in rendered output |
| E2E / Manual | FOUC + hydration | Hard-reload in dark mode; verify no flash; check console for hydration warnings |

## Migration / Rollout

1. Install new code and update imports.
2. Run full test suite (`pnpm test:run`).
3. Manual verification: toggle themes, reload, switch OS mode.
4. Remove `next-themes` from `package.json` and lockfile.
5. Commit. If issues arise, revert commit and restore `next-themes`.

## Open Questions

- None.
