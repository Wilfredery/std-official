import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockOnCLS,
  mockOnLCP,
  mockOnFCP,
  mockOnINP,
  mockOnTTFB,
} = vi.hoisted(() => ({
  mockOnCLS: vi.fn(),
  mockOnLCP: vi.fn(),
  mockOnFCP: vi.fn(),
  mockOnINP: vi.fn(),
  mockOnTTFB: vi.fn(),
}));

vi.mock("web-vitals", () => ({
  onCLS: mockOnCLS,
  onLCP: mockOnLCP,
  onFCP: mockOnFCP,
  onINP: mockOnINP,
  onTTFB: mockOnTTFB,
}));

import { reportWebVitals } from "@/lib/web-vitals";

describe("reportWebVitals", () => {
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls all five web-vitals metric functions", () => {
    reportWebVitals();

    expect(mockOnCLS).toHaveBeenCalledOnce();
    expect(mockOnLCP).toHaveBeenCalledOnce();
    expect(mockOnFCP).toHaveBeenCalledOnce();
    expect(mockOnINP).toHaveBeenCalledOnce();
    expect(mockOnTTFB).toHaveBeenCalledOnce();
  });

  it("passes a callback function to each metric reporter", () => {
    reportWebVitals();

    for (const mock of [mockOnCLS, mockOnLCP, mockOnFCP, mockOnINP, mockOnTTFB]) {
      const arg = mock.mock.calls[0]?.[0];
      expect(typeof arg).toBe("function");
    }
  });

  it("does not throw when a metric reporter throws an error", () => {
    mockOnCLS.mockImplementation(() => {
      throw new Error("CLS not supported");
    });

    expect(() => reportWebVitals()).not.toThrow();
    // Other metrics should still be called
    expect(mockOnLCP).toHaveBeenCalledOnce();
    expect(mockOnFCP).toHaveBeenCalledOnce();
    expect(mockOnINP).toHaveBeenCalledOnce();
    expect(mockOnTTFB).toHaveBeenCalledOnce();
  });

  it("does not throw when multiple metric reporters throw", () => {
    mockOnLCP.mockImplementation(() => {
      throw new Error("LCP not supported");
    });
    mockOnTTFB.mockImplementation(() => {
      throw new Error("TTFB not supported");
    });

    expect(() => reportWebVitals()).not.toThrow();
    expect(mockOnCLS).toHaveBeenCalledOnce();
    expect(mockOnFCP).toHaveBeenCalledOnce();
    expect(mockOnINP).toHaveBeenCalledOnce();
  });
});
