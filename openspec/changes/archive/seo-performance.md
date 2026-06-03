# Archive: SEO and Performance Improvements

## Status
**COMPLETED** — merged via PR #15

## Timeline
- **Proposed**: 2026-06-03
- **Implemented**: 2026-06-03
- **Verified**: 2026-06-03
- **Merged**: 2026-06-03

## Commits

| Commit | Message |
|--------|---------|
| cec0897 | chore(seo): add seo types, site config, and og image |
| 88a0064 | test: update ServiceDetailSection tests after delay removal |
| 1c4bc23 | refactor(layout): move html and body to locale layout for lang attribute |
| fbafedf | feat(seo): add locale-aware metadata to all pages |
| 5c72ff8 | fix(seo): add metadataBase to root layout |
| c8a0062 | feat(seo): add robots.txt and sitemap.xml generation |
| 34edc0b | feat(seo): add JSON-LD structured data schemas |
| 0b10915 | feat(i18n): add seo.about translations and wire into about page |
| daa631b | feat(ui): add loading state, fix 404 heading, optimize image sizes |

## What Changed

### SEO Infrastructure
- `lib/seo/types.ts` — TypeScript interfaces for JSON-LD schemas
- `lib/site.ts` — SITE_URL and locales helpers
- `app/opengraph-image.png` — Default OG image (1200×630)

### Layout & Accessibility
- Moved `<html>`/`<body>`/ThemeProvider to `app/[locale]/layout.tsx`
- Added `<html lang={locale}>` for i18n SEO
- Added `metadataBase` to root layout for absolute OG URLs
- Created `app/[locale]/loading.tsx`

### Per-Page Metadata
- Added `generateMetadata` to all 7 pages using `getTranslations`
- Open Graph, Twitter Cards, canonical URLs on every page
- `hreflang` alternates on service detail pages

### Crawling
- `app/robots.ts` — allows all crawlers
- `app/sitemap.ts` — 24 URLs with alternates, lastmod, priority

### Structured Data
- Organization + WebSite schemas on all pages
- BreadcrumbList + Service schemas on detail pages

### Translations
- Added `seo.about` to messages/en.json and messages/es.json
- Wired About page metadata to translations

### Fixes
- Updated tests after ScrollReveal delay removal
- Fixed 404 heading (`<p>` → `<h1>`)
- Added responsive `sizes` to AboutMissionVision image

## Verification

- **Tests**: 448/448 passing (70 files)
- **Build**: 31 static pages exported, 0 TypeScript errors
- **Build outputs verified**:
  - `out/robots.txt` ✅
  - `out/sitemap.xml` (24 URLs) ✅
  - HTML `lang` attribute ✅
  - JSON-LD scripts in output ✅

## Metrics

- **Files touched**: ~20
- **Lines changed**: ~380
- **Tests added**: 67
- **Schema types added**: 7

## Artifacts

| Type | Location |
|------|----------|
| Engram explore | `sdd/seo-performance/explore` |
| Engram proposal | `sdd/seo-performance/proposal` |
| Engram spec | `sdd/seo-performance/spec` |
| Engram design | `sdd/seo-performance/design` |
| Engram tasks | `sdd/seo-performance/tasks` |
| Engram apply-progress | `sdd/seo-performance/apply-progress` |
| Engram verify-report | `sdd/seo-performance/verify-report` |

## Key Decisions

1. **No de-clienting**: User explicitly requested keeping 4 client components untouched to preserve hover animations and visual quality.
2. **metadataBase in root layout**: Next.js requires `metadataBase` in root layout for OG URL resolution; placing it in locale layout would not work.
3. **Static sitemap**: Enumerated routes manually rather than dynamic introspection, because `output: 'export'` with `next-intl` limits build-time filesystem traversal.

## Risks Mitigated

- `sitemap.ts` / `robots.ts` in static export: Next.js v14+ supports these natively in static export
- De-clienting scope removed: User decision preserved visual quality
- OG images: Absolute URLs via `metadataBase` + `NEXT_PUBLIC_SITE_URL`

## Rollback

Revert PR #15 or `git revert daa631b..cec0897`.

## Next Steps

- [ ] Improve `opengraph-image.png` with actual branding/logo
- [ ] Add automated build output tests (robots.txt, sitemap.xml)
- [ ] Refactor CSS assertions in tests to semantic assertions
- [ ] Run Lighthouse audit on deployed site for SEO score baseline
- [ ] Submit sitemap to Google Search Console
- [ ] Validate JSON-LD with Google's Rich Results Test

## PR

- **#15**: feat: comprehensive SEO and performance improvements
- **Branch**: `feat/seo-performance` → `master`
- **Merged**: Yes
