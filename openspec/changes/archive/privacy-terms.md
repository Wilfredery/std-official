# SDD Archive Report: privacy-terms

## Change Summary
Add fully localized Privacy Policy and Terms of Service pages with Footer navigation links.

## Status
**COMPLETED** — Merged to master via PR #14.

## Artifacts

| Phase | Engram Topic Key | Status |
|-------|-----------------|--------|
| Proposal | `sdd/privacy-terms/proposal` | Saved |
| Spec | `sdd/privacy-terms/spec` | Saved |
| Apply | `sdd/privacy-terms/apply-progress` | Saved |
| Verify | N/A (tests passed inline) | 345/345 passing |
| Archive | `sdd/privacy-terms/archive-report` | Saved |

## Commits

| SHA | Message | Files |
|-----|---------|-------|
| `a55fbe0` | feat(i18n): add legal content for privacy and terms pages | `messages/es.json`, `messages/en.json` |
| `8cf8821` | feat(legal): add reusable LegalPage component with TOC | `components/legal/LegalPage.tsx`, `components/legal/__tests__/LegalPage.test.tsx` |
| `57c6189` | feat(legal): add privacy/terms routes and fix footer links | `app/[locale]/privacy/page.tsx`, `app/[locale]/terms/page.tsx`, `components/layout/Footer.tsx` |

## Implementation Details

### Affected Files
- `messages/es.json` — Added `legal.privacy`, `legal.terms`, `seo.privacy`, `seo.terms`
- `messages/en.json` — English translations mirrored
- `components/legal/LegalPage.tsx` — New reusable client component with TOC, badge, section separators
- `components/legal/__tests__/LegalPage.test.tsx` — 10 unit tests
- `app/[locale]/privacy/page.tsx` — SSG page with `generateMetadata`
- `app/[locale]/terms/page.tsx` — SSG page with `generateMetadata`
- `components/layout/Footer.tsx` — Fixed broken `<a>` tags -> `<Link>`

### Design Decisions
- Content stored in JSON messages (consistent with project i18n pattern)
- Structured as bullets per section to reduce bundle size
- Component uses `"use client"` for `useTranslations` + `t.raw()`
- Routes: `/privacy` and `/terms` (locale-prefixed via next-intl)

### Test Results
- 10 new tests for `LegalPage` — all passing
- 345 total tests — all passing
- Build: `next build` passes with static export

## PR
- **URL:** https://github.com/Wilfredery/std-official/pull/14
- **Branch:** `feat/privacy-terms`
- **Merged:** `93c3c07cb2a52820a72c504b5eb6afc95bdb516a`

## Risks (Post-Implementation)
- Large JSON payload: mitigated by condensing legal text to bullets
- No runtime validation on `t.raw()` return: mitigated by same-repo review

## Next Steps
- Monitor for user feedback on legal content accuracy
- Consider adding `openGraph` metadata in future SEO pass
