import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@/lib/__tests__/test-utils";
import { SubtitleTyping } from "@/components/home/hero/SubtitleTyping";

vi.mock("@/hooks/useHydrated", () => ({
  useHydrated: () => true,
}));

describe("SubtitleTyping", () => {
  const staticText = "We build";
  const dynamicText = "modern web apps";

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders staticText immediately", () => {
    render(
      <SubtitleTyping staticText={staticText} dynamicText={dynamicText} />,
    );
    expect(screen.getByText(staticText, { exact: false })).toBeInTheDocument();
  });

  it("renders cursor with animate-pulse class initially", () => {
    render(
      <SubtitleTyping staticText={staticText} dynamicText={dynamicText} />,
    );
    const cursor = screen.getByText("|");
    expect(cursor).toHaveClass("animate-pulse");
    expect(cursor).toHaveAttribute("aria-hidden", "true");
  });

  it("types dynamicText character by character", () => {
    const { container } = render(
      <SubtitleTyping staticText={staticText} dynamicText={dynamicText} />,
    );

    // Advance one interval (30ms) — first character
    act(() => {
      vi.advanceTimersByTime(30);
    });
    const visibleSpan = container.querySelector(".font-bold.text-primary")!;
    expect(visibleSpan.textContent).toMatch(/^m\|?/);

    // Advance enough intervals to get the first word (6 chars: "modern")
    act(() => {
      vi.advanceTimersByTime(150); // 5 more intervals of 30ms
    });
    expect(visibleSpan.textContent).toMatch(/^modern\|?/);
  });

  it("shows full dynamicText and hides cursor when typing is complete", () => {
    const { container } = render(
      <SubtitleTyping staticText={staticText} dynamicText={dynamicText} />,
    );

    // Run all pending timers until setInterval is cleared
    act(() => {
      vi.runAllTimers();
    });

    // Full text should be rendered in the visible span
    const visibleSpan = container.querySelector(".font-bold.text-primary")!;
    expect(visibleSpan.textContent).toContain(dynamicText);

    // Cursor should have opacity-0 (hidden) instead of animate-pulse
    const cursor = container.querySelector('[aria-hidden="true"]')!;
    expect(cursor).toHaveClass("opacity-0");
    expect(cursor).not.toHaveClass("animate-pulse");
  });

  it("has sr-only span with full dynamicText for accessibility", () => {
    const { container } = render(
      <SubtitleTyping staticText={staticText} dynamicText={dynamicText} />,
    );
    const srSpan = container.querySelector(".sr-only");
    expect(srSpan).toHaveTextContent(dynamicText);
  });
});
