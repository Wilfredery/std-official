import posthog from "posthog-js";

// Runs in the browser before the app hydrates (Next.js client instrumentation).
// No key (local dev, previews without the integration) → PostHog stays off.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    // Same-origin reverse proxy (see next.config.ts rewrites) so ad blockers
    // don't drop events.
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    // Pinned defaults snapshot: SPA pageviews on history change, pageleave,
    // autocapture (WhatsApp/email link clicks), session replay with inputs masked.
    defaults: "2026-08-29",
  });
}
