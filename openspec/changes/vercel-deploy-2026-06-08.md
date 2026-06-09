# SDD Session: Vercel Production Deploy

## Date: 2026-06-08
## Status: ✅ Deployed & Verified

## Goal
Deploy `std-official` Next.js project to Vercel production and verify via PageSpeed Insights.

## Fixes Applied

### 1. Redundant `generateStaticParams` causing build timeout
- **Problem**: `generateStaticParams` was exported in every page under `app/[locale]/`, in addition to the layout. Next.js was generating the same static routes multiple times, causing a 5+ minute hang in Vercel.
- **Fix**: Removed `generateStaticParams` from 6 pages:
  - `app/[locale]/about/page.tsx`
  - `app/[locale]/contact/page.tsx`
  - `app/[locale]/page.tsx`
  - `app/[locale]/privacy/page.tsx`
  - `app/[locale]/services/page.tsx`
  - `app/[locale]/terms/page.tsx`
- **Preserved**: `app/[locale]/layout.tsx` (has `generateStaticParams` for locales) and `app/[locale]/services/[slug]/page.tsx` (has `generateStaticParams` for locale + slug).

### 2. Windows case-sensitivity vs Linux (Vercel)
- **Problem**: Folder `components/home/Process` (capital P) was imported as `@/components/home/process` (lowercase p). Build passed locally on Windows but failed on Vercel with `Module not found`.
- **Fix**: Renamed folder to `components/home/process` (lowercase).

### 3. `output: "export"` incompatible with Vercel native deploy
- **Problem**: `next.config.ts` had `output: "export"`, which writes to `out/`. Vercel expects `.next/` by default. The Vercel dashboard was also manually configured with Output Directory `out`.
- **Fix**: Removed `output: "export"` and `images.unoptimized` from `next.config.ts`. Cleared the Output Directory setting in Vercel dashboard.

## Verification
- **Build time**: ~11 seconds (was 5+ minutes hang)
- **PageSpeed Insights**: 92/100 on mobile (excellent)

## Commits
- `ddc58b3`: fix: remove redundant generateStaticParams from locale pages
- `85efeef`: fix: normalize process folder casing for Linux/Vercel compat
- `186593f`: fix: remove output export for Vercel native SSR deploy

## Next Steps
- Monitor next deploy for any new case sensitivity issues
- Consider optimizing LCP or TBT if aiming for 95+ PageSpeed score
- Show client the production URL

## Notes
- Windows developers must be extra careful with file/folder casing when deploying to Linux environments
- `generateStaticParams` should only be used in the root dynamic layout and in child segments with ADDITIONAL dynamic params
- `output: "export"` is only for static hosting (GitHub Pages, S3), not for Vercel
