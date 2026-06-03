# theme-management Specification

## Purpose

Define behavior for a lightweight, React 19-compatible custom theme system that replaces `next-themes`. It provides Context-based state, localStorage persistence, system preference resolution, and a synchronous anti-flash script — without injecting `<script>` tags inside React components.

## Requirements

### Requirement: THEME-1: ThemeProvider with Context

The system MUST provide a `ThemeProvider` React component using Context that exposes `theme`, `setTheme`, and `resolvedTheme`. The API shape MUST be compatible with `next-themes` (`{ theme, setTheme, resolvedTheme, themes }`).

#### Scenario: ThemeProvider exposes context values

- GIVEN the application is wrapped with `ThemeProvider`
- WHEN a child client component calls `useTheme()`
- THEN it receives `theme`, `setTheme`, `resolvedTheme`, and `themes`
- AND the values are reactive across renders

### Requirement: THEME-2: localStorage persistence

The system MUST persist the user's theme preference in `localStorage` under the key `"theme"`.

#### Scenario: Theme selection survives reload

- GIVEN the user has selected `"dark"`
- WHEN the page is reloaded
- THEN the persisted value `"dark"` is read from `localStorage`
- AND the dark theme is applied on the client

### Requirement: THEME-3: Theme modes

The system MUST support theme modes: `light`, `dark`, and `system`.

#### Scenario: All modes are selectable

- GIVEN the theme toggle is rendered
- WHEN the user cycles through options
- THEN `"light"`, `"dark"`, and `"system"` are all valid selections accepted by `setTheme`

### Requirement: THEME-4: System preference resolution

The system MUST resolve `system` to `light` or `dark` using `matchMedia("(prefers-color-scheme: dark)")`. The resolved value MUST be exposed as `resolvedTheme`.

#### Scenario: System mode resolves to OS preference

- GIVEN the user selected `"system"`
- WHEN the OS color scheme is set to dark mode
- THEN `resolvedTheme` equals `"dark"`
- AND when the OS is set to light mode, `resolvedTheme` equals `"light"`

### Requirement: THEME-5: CSS class toggle

The system MUST apply the `.dark` class to `document.documentElement` when the resolved theme is `"dark"`, and MUST remove it when the resolved theme is `"light"`.

#### Scenario: Dark mode applies class

- GIVEN the resolved theme changes to `"dark"`
- THEN `document.documentElement` has the class `.dark`

#### Scenario: Light mode removes class

- GIVEN the resolved theme changes to `"light"`
- THEN `document.documentElement` does not have the class `.dark`

### Requirement: THEME-6: Anti-flash script execution order

The system MUST include a synchronous anti-flash script in `<head>` that executes BEFORE the first paint, applying the correct theme class to `document.documentElement`.

#### Scenario: No flash of unstyled content on reload

- GIVEN the user has a saved theme preference of `"dark"`
- WHEN the page loads
- THEN the anti-flash script runs synchronously in `<head>`
- AND the `.dark` class is applied before any content is painted

### Requirement: THEME-7: Anti-flash script safety

The anti-flash script MUST read `localStorage` and `matchMedia` inside a `try/catch` block to handle restricted environments (e.g., blocked localStorage, incognito, or security policies).

#### Scenario: Restricted environment does not crash

- GIVEN `localStorage` access throws (e.g., blocked by security policy)
- WHEN the anti-flash script executes
- THEN the error is caught
- AND the script falls back to `"system"` behavior without throwing

### Requirement: THEME-8: No inline script injection in React

The system MUST NOT inject `<script>` tags inside React components. The anti-flash script MUST live entirely outside the React tree (e.g., inline in `app/[locale]/layout.tsx` `<head>`).

#### Scenario: Hydration is clean

- GIVEN the application hydrates on the client
- THEN no `<script>` elements are rendered by React components
- AND React 19 does not produce hydration warnings related to script injection

### Requirement: THEME-9: useTheme hook accessibility

The `useTheme` hook MUST be importable from the theme module and usable inside any client component rendered within `ThemeProvider`.

#### Scenario: Consumer uses hook

- GIVEN a client component imports `useTheme` from the custom theme module
- WHEN it is rendered inside `ThemeProvider`
- THEN it receives valid theme state and updater function

### Requirement: THEME-10: System preference subscription

When `theme === "system"`, the system MUST subscribe to `matchMedia("(prefers-color-scheme: dark)")` changes and update `resolvedTheme` accordingly. The subscription MUST be cleaned up when the component unmounts.

#### Scenario: OS theme change updates UI

- GIVEN the user has selected `"system"`
- WHEN the OS switches to dark mode while the page is open
- THEN `resolvedTheme` updates to `"dark"`
- AND the UI re-renders with dark mode styles

## Scenarios

### Scenario: Escenario 1 — Saved dark theme survives reload without FOUC

- GIVEN the user has previously selected `"dark"` and it is stored in `localStorage`
- WHEN the page is reloaded
- THEN the anti-flash script in `<head>` reads `"dark"` from `localStorage`
- AND applies `.dark` to `document.documentElement` before first paint
- AND `ThemeProvider` initializes `theme` to `"dark"` and `resolvedTheme` to `"dark"`

### Scenario: Escenario 2 — System theme with OS in dark mode

- GIVEN the user has selected `"system"`
- AND the OS is in dark mode
- WHEN the page loads
- THEN the anti-flash script detects dark via `matchMedia`
- AND applies `.dark` before first paint
- AND `resolvedTheme` equals `"dark"`

### Scenario: Escenario 3 — OS switches while theme is system

- GIVEN the user has selected `"system"` and the page is open
- WHEN the OS switches to dark mode
- THEN the `matchMedia` listener triggers
- AND `resolvedTheme` updates to `"dark"`
- AND the `.dark` class is added to `document.documentElement`

### Scenario: Escenario 4 — User selects light via toggle

- GIVEN the theme toggle is visible
- WHEN the user selects `"light"`
- THEN `setTheme("light")` is called
- AND `"light"` is written to `localStorage`
- AND `.dark` is removed from `document.documentElement`
- AND `resolvedTheme` equals `"light"`

### Scenario: Escenario 5 — SSR renders without .dark, client hydrates cleanly

- GIVEN the server renders the page without `.dark` on `<html>`
- WHEN the client hydrates
- THEN `suppressHydrationWarning` prevents warnings on `<html>`
- AND the anti-flash script (already executed in `<head>`) has set the correct class before hydration
- AND React state matches the DOM class

### Scenario: Escenario 6 — localStorage blocked falls back to system

- GIVEN `localStorage` is blocked or inaccessible
- WHEN the anti-flash script executes
- THEN the caught error leads to fallback behavior
- AND the script uses `matchMedia` to determine the theme
- AND `ThemeProvider` initializes `theme` to `"system"`

### Scenario: Escenario 7 — useTheme covers all states

- GIVEN `ThemeProvider` is rendered in a test harness
- WHEN `useTheme` is called under each condition:
  - `theme="light"` → `resolvedTheme="light"`
  - `theme="dark"` → `resolvedTheme="dark"`
  - `theme="system"` with OS light → `resolvedTheme="light"`
  - `theme="system"` with OS dark → `resolvedTheme="dark"`
- THEN all four states return the expected values
- AND transitions between states update `resolvedTheme` correctly

## i18n Messages

No changes required. Theme toggle labels and accessibility text already exist in `messages/`.

## Testing Requirements

### Unit Tests

- `useTheme` hook: validate all states (`light`, `dark`, `system`→`light`, `system`→`dark`) and transitions between them
- `ThemeProvider`: validate that it provides context correctly, reads `localStorage` on mount, and writes on `setTheme`
- Updated consumer tests: 7 test files that mock the custom theme module instead of `next-themes`

### Integration / E2E Checks

- No hydration warnings appear in the browser console related to `<script>` injection
- Theme preference persists across full page reload
- Changing OS color scheme while in `"system"` mode updates the UI live
