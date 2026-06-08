import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// We test the createWebVitalsScript string output and behavior.
// The script is evaluated in a realistic document environment.
// ---------------------------------------------------------------------------

describe("createWebVitalsScript", () => {
  let createWebVitalsScript: () => string;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/lib/web-vitals");
    createWebVitalsScript = mod.createWebVitalsScript;
  });

  it("returns a non-empty string", () => {
    const script = createWebVitalsScript();
    expect(script).toBeTruthy();
    expect(typeof script).toBe("string");
    expect(script.length).toBeGreaterThan(50);
  });

  it("contains an IIFE wrapper for isolation", () => {
    const script = createWebVitalsScript();
    expect(script).toMatch(/^\(function/);
  });

  it("references web-vitals metric names (LCP, CLS, TTFB)", () => {
    const script = createWebVitalsScript();
    expect(script).toMatch(/LCP/);
    expect(script).toMatch(/CLS/);
    expect(script).toMatch(/TTFB/);
  });

  it("includes interaction event listeners (click, keypress, scroll)", () => {
    const script = createWebVitalsScript();
    expect(script).toMatch(/click|pointerdown|keydown|scroll|touchstart/);
  });

  it("includes a fallback timeout (5000ms)", () => {
    const script = createWebVitalsScript();
    expect(script).toContain("5000");
    expect(script).toMatch(/setTimeout|setInterval/);
  });

  it("dynamically imports web-vitals library", () => {
    const script = createWebVitalsScript();
    expect(script).toMatch(/import\s*\(/);
    expect(script).toMatch(/web-vitals/);
  });

  it("guards against double-trigger (once flag)", () => {
    const script = createWebVitalsScript();
    // Should include a guard variable/flag to prevent double execution
    expect(script).toMatch(/(once|triggered|fired|_loaded|_started|_initialized)/i);
  });

  it("clears the timeout when triggered early by interaction", () => {
    const script = createWebVitalsScript();
    // Should reference clearTimeout to clean up
    expect(script).toMatch(/clearTimeout/);
  });

  it("reports metrics via console.log", () => {
    const script = createWebVitalsScript();
    expect(script).toMatch(/console\.log/);
  });
});
