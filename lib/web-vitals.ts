import { onCLS, onLCP, onFCP, onINP, onTTFB } from "web-vitals";

const METRIC_HANDLERS = [
  { name: "CLS", fn: onCLS },
  { name: "LCP", fn: onLCP },
  { name: "FCP", fn: onFCP },
  { name: "INP", fn: onINP },
  { name: "TTFB", fn: onTTFB },
] as const;

/**
 * Reports Core Web Vitals metrics using the web-vitals library.
 * Each metric is wrapped in try/catch for graceful degradation
 * in unsupported browsers.
 */
export function reportWebVitals(): void {
  for (const { name, fn } of METRIC_HANDLERS) {
    try {
      fn(console.log);
    } catch {
      // Silently ignore unsupported metrics — the browser
      // may not implement all Web Vitals APIs.
      console.log(`[web-vitals] ${name} metric not supported in this browser`);
    }
  }
}
