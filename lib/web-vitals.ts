/**
 * Returns an inline module script that defers loading the web-vitals library
 * until the first user interaction OR a 5-second idle timeout — whichever
 * comes first. This keeps web-vitals out of the critical path.
 *
 * Once triggered, the script dynamically imports the library and reports
 * CLS, LCP, FCP, INP, and TTFB via console.log.
 */
export function createWebVitalsScript(): string {
  return `
(function() {
  var _triggered = false;
  var _timer = null;

  function report() {
    if (_triggered) return;
    _triggered = true;
    if (_timer) { clearTimeout(_timer); _timer = null; }

    import("web-vitals").then(function(m) {
      var metrics = [
        { name: "CLS",  fn: m.onCLS  },
        { name: "LCP",  fn: m.onLCP  },
        { name: "FCP",  fn: m.onFCP  },
        { name: "INP",  fn: m.onINP  },
        { name: "TTFB", fn: m.onTTFB },
      ];
      for (var i = 0; i < metrics.length; i++) {
        try { metrics[i].fn(console.log); }
        catch (_) { /* unsupported in this browser */ }
      }
    }).catch(function(err) {
      console.log("[web-vitals] Failed to load library:", err.message);
    });
  }

  // Trigger on first user interaction
  var events = ["click", "keydown", "scroll", "touchstart"];
  for (var i = 0; i < events.length; i++) {
    window.addEventListener(events[i], report, { once: true, passive: true });
  }

  // 5-second fallback
  _timer = setTimeout(report, 5000);
})();
`.trim();
}

/**
 * Eager reporter — kept for backward compatibility with tests that
 * verify the reporting format. In production, use createWebVitalsScript()
 * to defer loading.
 */
export async function reportWebVitals(): Promise<void> {
  const { onCLS, onLCP, onFCP, onINP, onTTFB } = await import("web-vitals");

  const handlers = [
    { name: "CLS", fn: onCLS },
    { name: "LCP", fn: onLCP },
    { name: "FCP", fn: onFCP },
    { name: "INP", fn: onINP },
    { name: "TTFB", fn: onTTFB },
  ];

  for (const { name, fn } of handlers) {
    try {
      fn(console.log);
    } catch {
      console.log(`[web-vitals] ${name} metric not supported in this browser`);
    }
  }
}
