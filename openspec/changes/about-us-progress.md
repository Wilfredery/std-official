# SDD Apply Progress: About Us Page

## Status: In Progress — Components 1/2 Complete

## Completed
- [x] Nav links updated (Navbar.tsx, MobileMenu.tsx)
- [x] i18n keys added (en.json, es.json) — nav.about + full about namespace
- [x] Placeholder deleted (AboutUsSection.tsx)
- [x] AboutHeader.tsx — hero with eyebrow, title/accent, SubtitleTyping
- [x] BrandStory.tsx — 2-column origin + philosophy
- [x] MissionVision.tsx — 2-column grid with gradient-border-card
- [x] ValuesSection.tsx — 4-card grid with icons (Crosshair, Lightbulb, ShieldCheck, Zap)

## Pending
- [ ] ServicesPillars.tsx — 6-card grid reusing services.ts icons
- [ ] TeamSection.tsx — 4-card grid (UserCog, Code2, BrainCircuit, ShieldCheck)
- [ ] AboutCta.tsx — CTA section
- [ ] app/[locale]/about/page.tsx — page composition
- [ ] Tests (7 files)
- [ ] pnpm test + commit + push

## Decisions
- All Server Components (zero "use client")
- Static card grid for pillars (not tabs per user choice)
- Bottom CTA included
- 1 PR for entire feature

## Notes
- AboutHeader had typos (sbsolute, missing braces) — fixed during review
- BrandStory, MissionVision, ValuesSection reviewed OK
