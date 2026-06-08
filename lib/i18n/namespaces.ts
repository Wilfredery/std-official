// ---------------------------------------------------------------------------
// Shared namespaces loaded by the root layout for ALL pages.
// These cover Navbar, MobileMenu, Footer, and the always-included `common`.
// ---------------------------------------------------------------------------
export const SHARED_NAMESPACES = [
  "nav",
  "common",
  "footer",
  "serviceDetail",
  "about",
  "legal",
  "notFound",
] as const;

export type SharedNamespace = (typeof SHARED_NAMESPACES)[number];

// ---------------------------------------------------------------------------
// Per-page namespace mapping (client-side provider only).
// Server components use `getTranslations` and are resolved at build time,
// so they do NOT need to be in the client provider payload.
// ---------------------------------------------------------------------------
export const PAGE_NAMESPACES: Record<string, string[]> = {
  "/": [],
  "/about": ["about"],
  "/services": [],
  "/services/*": [], // service detail slug pages
  "/contact": [],
  "/privacy": ["legal"],
  "/terms": ["legal"],
  "/404": ["notFound"],
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
