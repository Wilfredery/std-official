# Proposal: Replace next-themes with Custom Theme System

## Intent

`next-themes` v0.4.6 injects a `<script>` tag inside React components to prevent FOUC. React 19 rejects this during hydration, causing console errors and potential rendering issues (issues #385, #387, no official fix). We need a lightweight custom theme system that avoids in-React script injection.

## Scope

### In Scope
- Custom `ThemeProvider` + `useTheme` hook (API-compatible with `next-themes`)
- Synchronous anti-flash script in `<head>` of `app/[locale]/layout.tsx` (outside React)
- Update 7 source consumers and 7 test mocks
- Remove `next-themes` from dependencies

### Out of Scope
- New theme designs or CSS variable architecture changes
- System-level color-scheme API extensions

## Capabilities

### New Capabilities
- `theme-management`: Custom Context-based theme provider, localStorage persistence, matchMedia system preference, and anti-flash injection.

### Modified Capabilities
- None

## Approach

1. Build `lib/theme/` module with provider and hook matching `next-themes` return shape.
2. Add inline `<script>` to `<head>` in `app/[locale]/layout.tsx` that reads `localStorage` / `matchMedia` before hydration.
3. Swap all `next-themes` imports to the custom module.
4. Update test mocks and run full test suite.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `lib/theme/provider.tsx` | New | Context provider with localStorage + matchMedia |
| `lib/theme/useTheme.ts` | New | Hook: `{ theme, setTheme, resolvedTheme, themes }` |
| `app/[locale]/layout.tsx` | Modified | Anti-flash script in `<head>`; swap provider import |
| `components/providers/theme-provider.tsx` | Modified | Re-export custom provider |
| `components/layout/ThemeToggle.tsx` | Modified | Swap import to custom hook |
| `components/layout/Footer.tsx` | Modified | Swap import to custom hook |
| `components/layout/Navbar.tsx` | Modified | Swap import to custom hook |
| `components/about/missionVission/AboutMissionVision.tsx` | Modified | Swap import to custom hook |
| `hooks/useThemeShortcut.ts` | Modified | Swap import to custom hook |
| `components/layout/ThemeShortcut.tsx` | Modified | Swap import to custom hook |
| `__tests__/**` (7 files) | Modified | Update mocks from `next-themes` to custom module |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Hydration mismatch between script and React state | Low | Script and provider use identical localStorage key and matchMedia logic |
| `resolvedTheme` regression | Low | Unit tests for `useTheme` hook covering all theme states |
| Build/runtime errors from removed dependency | Low | Type-check and run full test suite before commit |

## Rollback Plan

Revert the PR/branch. Restore `next-themes` in `package.json`, revert all import changes to `next-themes`, and remove `lib/theme/`.

## Dependencies

None.

## Success Criteria

- [ ] No React 19 hydration warnings related to `<script>` tags
- [ ] `useTheme` returns correct `resolvedTheme` on SSR and client
- [ ] Theme preference persists across reloads
- [ ] All tests pass with updated mocks
- [ ] `next-themes` removed from `package.json`
