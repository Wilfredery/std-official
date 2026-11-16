// ---------------------------------------------------------------------------
// Namespaces the root layout sends to the browser on ALL pages: only what
// Client Components read (Navbar, MobileMenu, ThemeToggle, LanguageSwitcher,
// 404). Server Components (Footer, about, legal, service pages) resolve their
// text at build time, so it never reaches the client payload.
// ---------------------------------------------------------------------------
export const SHARED_NAMESPACES = ["nav", "common", "notFound"] as const;

export type SharedNamespace = (typeof SHARED_NAMESPACES)[number];

// ---------------------------------------------------------------------------
// Per-page namespace mapping (client-side provider only).
// Server components use `getTranslations` and are resolved at build time,
// so they do NOT need to be in the client provider payload.
// ---------------------------------------------------------------------------
export const PAGE_NAMESPACES: Record<string, string[]> = {
  "/": [],
  "/about": [], // about sections are Server Components
  "/services": [],
  "/services/*": [], // service detail slug pages
  "/blog": [],
  "/blog/*": [], // blog post slug pages
  "/contact": [],
  "/privacy": [], // LegalPage is a Server Component
  "/terms": [],
  "/404": [], // notFound is shared (also used by the root 404)
};

// ---------------------------------------------------------------------------
// All valid namespaces present in messages/{locale}.json
// Used by the guard test to validate no undeclared namespaces are used.
// ---------------------------------------------------------------------------
export const ALL_NAMESPACES = [
  "nav",
  "common",
  "home",
  "services",
  "serviceDetail",
  "contact",
  "footer",
  "seo",
  "notFound",
  "about",
  "legal",
] as const;

export type Namespace = (typeof ALL_NAMESPACES)[number];

// ---------------------------------------------------------------------------
// Filter a flat messages object to only include the given namespaces.
// ---------------------------------------------------------------------------
export function filterMessages(
  messages: Record<string, unknown>,
  namespaces: readonly string[],
): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  for (const ns of namespaces) {
    if (ns in messages) {
      filtered[ns] = messages[ns];
    }
  }
  return filtered;
}

// ---------------------------------------------------------------------------
// Resolve page path to required client-side namespaces (shared + page).
// ---------------------------------------------------------------------------
export function getRequiredNamespaces(pagePath: string): string[] {
  const shared = [...SHARED_NAMESPACES];
  const extra = PAGE_NAMESPACES[pagePath] ?? [];
  return [...shared, ...extra];
}

// ---------------------------------------------------------------------------
// Load and filter page-specific messages for the MergingIntlProvider.
// Uses the `fullMessages` object from the caller (e.g. returned by getMessages
// in the layout/page) to avoid additional bundle imports.
// Returns an empty object if the page has no extra namespaces.
// ---------------------------------------------------------------------------
export function getPageMessages(
  fullMessages: Record<string, unknown>,
  pagePath: string,
): Record<string, unknown> {
  const namespaces = PAGE_NAMESPACES[pagePath];
  if (!namespaces || namespaces.length === 0) return {};
  return filterMessages(fullMessages, namespaces);
}
