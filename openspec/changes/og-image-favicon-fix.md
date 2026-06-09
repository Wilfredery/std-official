# OG Image & Favicon Fix — Session 2026-06-09

## Problem
- Open Graph image not rendering in social media previews (Facebook, Telegram, Twitter)
- Browser tab icon (favicon) missing
- Footer developer credit text too small and close to edge

## Root Causes
1. `app/opengraph-image.tsx` used `next/og` dynamic generation which crashed on Vercel with `TypeError: u2 is not iterable` (Satori doesn't support WebP input).
2. Tried `app/opengraph-image.png` special file, but Next.js only resolves special files for their own route segment. With `app/[locale]/` i18n, `/es/` and `/en/` routes couldn't find the OG image.
3. `lib/site.ts` default was `shinetechdata.com` but client's actual domain is `www.shinetechdata.com`.

## Solution

### Files Changed
- **Deleted**: `app/opengraph-image.tsx` (unreliable dynamic generation)
- **Deleted**: `app/favicon.ico` (empty/corrupt)
- **Created**: `public/opengraph-image.png` — static 1200×630 PNG, accessible at `/opengraph-image.png` for all locales
- **Created**: `app/icon.png` — favicon for browser tabs (Next.js auto-detects)
- **Updated**: `lib/site.ts` — changed default `SITE_URL` to `https://www.shinetechdata.com`
- **Updated**: `components/layout/Footer.tsx` — `text-xs` → `text-sm`, added `sm:ml-4`

### Key Decision
For Next.js App Router with `[locale]` i18n, static OG images must live in `public/` and be referenced via absolute URL in page metadata. Special files in `app/` are segment-scoped and don't propagate to child locale routes.

## Testing
- Image accessible directly: `https://www.shinetechdata.com/opengraph-image.png`
- Favicon works in production
- Metadata URLs now match client's actual domain

## Commit
`c4d1a2a` — fix: update SITE_URL default to www.shinetechdata.com
