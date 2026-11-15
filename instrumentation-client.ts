// Runs in the browser before the app hydrates (Next.js client instrumentation).
// No key (local dev, previews without the integration) → PostHog stays off.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// posthog-js is ~190 KB gzipped. Importing it here statically put it on the
// critical path of every page (parsed before hydration), which hurt mobile
// LCP/TBT. Load it in its own chunk once the page has loaded and the main
// thread is idle; the initial pageview is still captured on init.
function loadPostHog(apiKey: string) {
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(apiKey, {
      // Same-origin reverse proxy (see next.config.ts rewrites) so ad blockers
      // don't drop events.
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      // Pinned defaults snapshot: SPA pageviews on history change, pageleave,
      // autocapture (WhatsApp/email link clicks), session replay with inputs masked.
      defaults: "2026-08-29",
    });
  });
}

if (key) {
  const schedule = () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => loadPostHog(key), { timeout: 4000 });
    } else {
      setTimeout(() => loadPostHog(key), 1500);
    }
  };

  if (document.readyState === "complete") {
    schedule();
  } else {
    window.addEventListener("load", schedule, { once: true });
  }
}
