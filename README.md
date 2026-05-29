# ShineTechData Official Website

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Tests](https://img.shields.io/badge/tests-297%20passed-brightgreen)](https://github.com/WilfridoRT/std-official)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

The official website for [ShineTechData](https://shinetechdata.com) — a data consulting company. Built to showcase services, communicate value, and serve as the central brand presence online. Supports English and Spanish with full static generation for fast, host-anywhere deployment.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | App Router, static export |
| [React](https://react.dev) | 19.2 | UI framework |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [Base UI](https://base-ui.com) | 1.5 | Unstyled accessible primitives (shadcn/ui) |
| [next-intl](https://next-intl.dev) | 4.12 | Internationalization |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 | Light/dark/system theme |
| [Lucide React](https://lucide.dev) | 1.16 | Icon library |
| [Vitest](https://vitest.dev) | 4.1 | Test runner |
| [React Testing Library](https://testing-library.com/react) | 16.3 | Component tests |
| [pnpm](https://pnpm.io) | — | Package manager |

**Fonts**: [Libre Franklin](https://fonts.google.com/specimen/Libre+Franklin) (Google Fonts)

## Features

- **Bilingual (EN/ES)** — locale-prefixed routing with automatic language detection
- **Static export** — output as plain HTML/CSS/JS, deployable anywhere
- **Dark/light theme** — system-aware with manual toggle and shortcut (Cmd/Ctrl + J)
- **Animated hero** — typing-effect headline with smooth transitions
- **Scroll animations** — content reveals on scroll via IntersectionObserver
- **Service detail pages** — 6 services × 2 locales, statically generated at build time
- **Contact page** — inquiry section with FAQ accordion
- **Custom 404** — locale-aware not-found page
- **Fully responsive** — mobile-first design across all breakpoints
- **Accessible** — semantic HTML, `focus-visible` indicators, screen-reader-only text

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, problem statement, services overview, process, CTA |
| `/services` | Service listing with card grid and slider |
| `/services/[slug]` | Individual service detail page |
| `/contact` | Contact form and FAQ |
| `/not-found` | Custom 404 with locale detection |

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** (package manager — other managers are not supported)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/WilfridoRT/std-official.git
cd std-official

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The dev server supports hot reload across both locales.

## Development Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production (static export to `/out`) |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run all tests once (CI-friendly) |
| `pnpm lint` | Lint with ESLint |

## Project Structure

```
std-official/
├── app/                  # Next.js App Router pages
│   ├── [locale]/         # Locale-scoped routes
│   │   ├── contact/      # Contact page
│   │   └── services/     # Listing + [slug] detail pages
│   ├── layout.tsx        # Root layout (HTML, fonts, metadata)
│   └── not-found.tsx     # Locale-aware 404
├── components/           # Reusable UI components
│   ├── home/             # Home page sections (hero, problem, process, CTA)
│   ├── services/         # Service cards, detail, slider
│   ├── contact/          # Contact form, FAQ
│   ├── layout/           # Header, footer, nav
│   ├── providers/        # ThemeProvider, IntlProvider
│   └── ui/               # Primitives (buttons, accordion, tooltip, etc.)
├── hooks/                # Custom React hooks (useHydrated, useThemeShortcut)
├── lib/                  # Business logic and utilities
│   ├── data/             # Service definitions, static data
│   └── i18n/             # next-intl config, routing, request handler
├── messages/             # Translation files (en.json, es.json)
└── public/               # Static assets (images, favicon)
```

## Internationalization

Translations live in `messages/` as JSON files (`en.json`, `es.json`) organized by page section. Each locale gets a dedicated namespace to keep files manageable.

```
messages/
├── en.json    # English translations
└── es.json    # Spanish translations
```

**Adding a new string**:

1. Add the key to both `en.json` and `es.json`
2. Use `getTranslations("namespace")` in Server Components
3. Use `useTranslations("namespace")` in Client Components

The locale is detected from the URL prefix (`/en`, `/es`). The middleware redirects root requests (`/`) to the preferred locale.

## Testing

**297 tests across 44 test files — all passing.**

- **Framework**: Vitest with `jsdom` environment
- **Library**: React Testing Library + jest-dom matchers
- **Coverage**: 100% of components tested

```bash
# Watch mode (re-runs on file changes)
pnpm test

# Single run (for CI)
pnpm test:run
```

Tests are colocated with their source files inside `__tests__/` directories. Each component has corresponding tests covering rendering, interactions, accessibility, and both locales where applicable.

## Deployment

The project is configured for **static export** (`output: "export"`). After building, the entire site lives in the `out/` directory as static files — no Node.js server required.

```bash
# Build to /out
pnpm build

# Serve locally to verify
pnpm exec serve out
```

Deploy `out/` to any static host:

- **Vercel / Netlify** — point to the repository, set build command to `pnpm build`, publish directory to `out`
- **GitHub Pages** — configure the workflow to push `out/` to `gh-pages`
- **S3 / CloudFront** — sync `out/` to the bucket
- **Any CDN** — upload and serve

Trailing slashes are enforced (`trailingSlash: true`) for consistent static hosting behavior.

## Contributing

Contributions are welcome. Before opening a PR:

1. Run `pnpm test:run` — all 297 tests must pass
2. If your change affects UI, add or update tests
3. If your change adds user-facing text, update both `en.json` and `es.json`
4. Follow the existing project structure and TypeScript conventions
5. Keep commits small and focused

## License

MIT © ShineTechData
