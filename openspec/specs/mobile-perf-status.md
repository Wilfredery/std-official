# Mobile Performance Optimization — Project Status

> Saved: 2026-06-08
> Branch: perf/mobile-lighthouse (merged to master)

## Final Lighthouse Scores

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Desktop | ~93 | **~99** | +6 |
| Mobile | ~50 | **~60** | +10 |

## Commits Applied (9 total)

### Performance v1 (6 commits)
1. `0c71a8f` — Disable Link prefetch (RSC 404 fix)
2. `fd148be` — Singleton IntersectionObserver for ScrollReveal
3. `fcc0444` — i18n namespace splitting (-5.5 KB/page)
4. `e694a8c` — ThemeContext simplification + WebVitals defer
5. `827f411` — Font display swap + weight subset
6. `5e84726` — Image LCP priority

### Performance v2 safe (2 commits)
7. `eb4346b` — ServiceCard server component
8. `a487119` — Dead code removal (MergingIntlProvider)

### Reverted commits
- LanguageSwitcher lazy-load (regressed mobile ~60→54)
- CSS critical inline (broke all styles and animations)

### Client request (1 commit)
9. `83260e7` — Sitemap removal (no sitemap.xml generated)

## Build Status
- Pages: 30 static pages (was 31 before sitemap removal)
- Tests: 555/555 passing
- Errors: 0

## What's Safe to Do Next
- Nothing — project is at practical limit for this stack

## What's Needed for Further Mobile Improvement
1. **Migrate to Pages Router** (2-3 days, +10-15 pts)
2. **Replace @base-ui ThemeToggle** with native details/summary (1-2 days, +5-10 pts)

## What's Off Limits (Breaks Styles/Animations)
- CSS extraction or critical CSS inline
- Removing shadcn/tailwind.css import
- Any changes to animation timing or keyframes

## Vercel Deploy
- Connected to GitHub: Wilfredery/std-official
- Auto-deploy on master push
- NEXT_PUBLIC_SITE_URL must be configured for correct metadata
