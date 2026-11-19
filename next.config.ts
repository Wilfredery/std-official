import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

// Enforced CSP. Ran as Report-Only in production with no violations; Next.js
// inline bootstrap scripts still need 'unsafe-inline' (nonces would force
// dynamic rendering of every page). PostHog is same-origin via /ingest.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com",
  // PostHog session replay compresses in a blob: worker.
  "worker-src 'self' blob:",
  "frame-src https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

// /public files are served with `max-age=0` because their names carry no
// content hash. Files imported from code (logos, About images) get hashed,
// immutable URLs instead; these are the ones that can't be imported (Markdown
// blog images, icons, the OG fallback). One week fresh, then up to 30 days
// served instantly while revalidating. Rename a file to force an update.
const publicAssetCache = [
  { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    // Default is 4h; these images change rarely, so re-optimize monthly.
    // There is no purge: change the file name when an image changes.
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: publicAssetCache },
      {
        source: "/:file(icon.png|apple-icon.png|favicon.ico|opengraph-image.png)",
        headers: publicAssetCache,
      },
    ];
  },
  // PostHog reverse proxy. Static/array rules must precede the catch-all.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/array/:path*", destination: "https://us-assets.i.posthog.com/array/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
};

export default withNextIntl(nextConfig);
