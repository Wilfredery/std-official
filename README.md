# ShineTechData Official Website

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/tests-555%20passed-brightgreen)](https://github.com/Wilfredery/std-official)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> **Live Site**: [shinetechdata.com](https://www.shinetechdata.com/en/) (Vercel)

The official website for **ShineTechData** — a data consulting company specializing in business intelligence, data analysis, and machine learning solutions. Built with modern web technologies, optimized for performance, and accessible to all users.

**Bilingual**: English & Spanish with automatic locale detection.

**Performance**: 92/100 on Google PageSpeed Insights (Mobile).
<img width="760" height="552" alt="mobile-performance" src="https://github.com/user-attachments/assets/7651f5f1-c1c1-4984-91dd-157b0f48d4ed" />
<img width="883" height="528" alt="Desktop-perf" src="https://github.com/user-attachments/assets/f7ac4a63-6e8a-43ec-8d87-6f57abf1b808" />


---

## Tech Stack

| Technology                                                 | Version | Purpose                         |
| ---------------------------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org)                              | 16.2    | App Router, SSR, SSG, Turbopack |
| [React](https://react.dev)                                 | 19.2    | UI framework                    |
| [TypeScript](https://www.typescriptlang.org)               | 5       | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com)                    | 4       | Utility-first styling           |
| [Base UI](https://base-ui.com)                             | 1.5     | Accessible primitives           |
| [next-intl](https://next-intl.dev)                         | 4.12    | Internationalization            |
| [Vitest](https://vitest.dev)                               | 4.1     | Test runner                     |
| [React Testing Library](https://testing-library.com/react) | 16.3    | Component testing               |
| [Lucide React](https://lucide.dev)                         | 1.16    | Icon library                    |
| [web-vitals](https://github.com/GoogleChrome/web-vitals)   | 5.3     | Core Web Vitals monitoring      |

**Package Manager**: [pnpm](https://pnpm.io)

**Fonts**: [Libre Franklin](https://fonts.google.com/specimen/Libre+Franklin) (Google Fonts)

---

## Features

### Core

- **Bilingual (EN/ES)** — Locale-prefixed routing with automatic language detection
- **Dark/Light Theme** — System-aware with manual toggle and keyboard shortcut ("D")
- **Fully Responsive** — Mobile-first design across all breakpoints
- **Accessible** — Semantic HTML, `focus-visible`, screen-reader support, WCAG-compliant

### Content

- **Animated Hero** — Typing-effect headline with smooth transitions
- **Scroll Animations** — Content reveals on scroll via IntersectionObserver
- **Service Detail Pages** — 6 services × 2 locales, statically generated at build time
- **About Page** — Company story, mission, vision, and values
- **Contact Page** — Inquiry section with FAQ accordion
- **Legal Pages** — Terms of Service and Privacy Policy
- **Custom 404** — Locale-aware not-found page

### Performance & SEO

- **Server Components** — Reduced client-side JavaScript with React Server Components
- **Lazy Loading** — Interactive components loaded on-demand with `next/dynamic`
- **Font Preloading** — Google Fonts preloaded via `next/font`
- **Core Web Vitals Monitoring** — Real-user metrics via `web-vitals` library
- **Structured Data** — JSON-LD for Organization, WebSite, Services, Breadcrumbs
- **SEO Optimized** — Dynamic metadata, Open Graph, Twitter Cards, canonical URLs

---

## Pages

| Route              | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `/`                | Home — hero, problem statement, services overview, process, CTA |
| `/services`        | Service listing with card grid and slider                       |
| `/services/[slug]` | Individual service detail page (6 services)                     |
| `/about`           | Company story, mission, vision, and values                      |
| `/contact`         | Contact form and FAQ                                            |
| `/terms`           | Terms of Service                                                |
| `/privacy`         | Privacy Policy                                                  |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** (recommended package manager)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/Wilfredery/std-official.git
cd std-official

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Commands

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `pnpm dev`      | Start development server with Turbopack |
| `pnpm build`    | Build for production                    |
| `pnpm test`     | Run tests in watch mode                 |
| `pnpm test:run` | Run all tests once (CI-friendly)        |
| `pnpm lint`     | Lint with ESLint                        |

---

## Project Structure

```
std-official/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Locale-scoped routes (en, es)
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── services/       # Services listing + [slug] detail
│   │   ├── terms/          # Terms of Service
│   │   └── privacy/        # Privacy Policy
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   └── globals.css         # Global styles & Tailwind config
├── components/             # Reusable UI components
│   ├── home/               # Home page sections
│   ├── services/           # Service components
│   ├── contact/            # Contact form & FAQ
│   ├── layout/             # Header, footer, nav
│   ├── seo/                # SEO & JSON-LD components
│   └── ui/                 # UI primitives (shadcn/ui)
├── lib/                    # Business logic & utilities
│   ├── data/               # Static data & service definitions
│   └── i18n/               # next-intl configuration
├── messages/               # Translation files
│   ├── en.json             # English
│   └── es.json             # Spanish
├── public/                 # Static assets
└── __tests__/              # Colocated tests
```

---

## Internationalization

Translations live in `messages/` as JSON files organized by page section.

**Adding a new string**:

1. Add the key to both `en.json` and `es.json`
2. Use `getTranslations("namespace")` in Server Components
3. Use `useTranslations("namespace")` in Client Components

The locale is detected from the URL prefix (`/en`, `/es`). The root path (`/`) redirects to the preferred locale.

---

## Testing

**555 tests across 76 test files — all passing.**

- **Framework**: Vitest with `jsdom` environment
- **Library**: React Testing Library + jest-dom matchers
- **Coverage**: 100% of components tested, plus metadata and SEO tests

Tests are colocated with source files inside `__tests__/` directories. Each component has tests covering rendering, interactions, accessibility, and both locales.

---

## Performance

- **PageSpeed Insights**: 92/100 (Mobile)
- **Architecture**: Server Components + lazy-loaded interactive islands
- **Font Optimization**: Preloaded via `next/font`
- **Asset Optimization**: Static assets with optimal cache headers
- **Core Web Vitals**: Monitored in production via `web-vitals`

---

## Deployment

Deployed on **Vercel** with Next.js native SSR support.

### Environment

- **Platform**: Vercel (Serverless)
- **Build Command**: `next build`
- **Output Directory**: `.next` (default)

### Deploying

```bash
# Build locally to verify
pnpm build

# Start production server locally
pnpm start
```

**Vercel Dashboard**:

1. Import repository from GitHub
2. Framework preset: Next.js
3. Build command: `next build`
4. Output directory: leave empty (default `.next`)

Each push to `master` triggers automatic deployment.

---

## Contributing

1. Run `pnpm test:run` — all 555 tests must pass
2. If your change affects UI, add or update tests
3. If your change adds user-facing text, update both `en.json` and `es.json`
4. Follow existing project structure and TypeScript conventions
5. Keep commits small and focused

---

## License

MIT © ShineTechData
