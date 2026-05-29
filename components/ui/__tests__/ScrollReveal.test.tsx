import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@/lib/__tests__/test-utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// ---------------------------------------------------------------------------
// IntersectionObserver mock
// ---------------------------------------------------------------------------

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

// Capture the IntersectionObserver callback so we can fire it in tests
let intersectionCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null = null;

class MockIntersectionObserver {
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = mockUnobserve;
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }
}

// Needed because ScrollReveal checks for IntersectionObserver on `window`
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  mockUnobserve.mockClear();
  intersectionCallback = null;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fireIntersection(isIntersecting: boolean) {
  if (!intersectionCallback) {
    throw new Error("IntersectionObserver callback not captured yet");
  }
  act(() => {
    intersectionCallback!([
      { isIntersecting } as IntersectionObserverEntry,
    ]);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ScrollReveal", () => {
  it("renders children", () => {
    render(
      <ScrollReveal>
        <p data-testid="child">Hello world</p>
      </ScrollReveal>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("creates an IntersectionObserver", () => {
    render(<ScrollReveal>content</ScrollReveal>);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it("starts invisible (not visible) with initial direction class 'up' by default", () => {
    const { container } = render(
      <ScrollReveal>content</ScrollReveal>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    // The default direction is "up", so initial class should include translate-y-8 and opacity-0
    expect(wrapper.className).toContain("opacity-0");
    expect(wrapper.className).toContain("translate-y-8");
    // Should NOT have the "visible" classes yet
    expect(wrapper.className).not.toContain("opacity-100");
  });

  it("becomes visible when intersection fires with isIntersecting=true", () => {
    const { container } = render(
      <ScrollReveal>content</ScrollReveal>,
    );

    fireIntersection(true);

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("opacity-100");
    expect(wrapper.className).toContain("translate-y-0");
  });

  it("stops observing after first intersection (unobserve is called)", () => {
    render(<ScrollReveal>content</ScrollReveal>);

    fireIntersection(true);

    expect(mockUnobserve).toHaveBeenCalledTimes(1);
  });

  describe("direction classes", () => {
    it("applies 'up' direction class (translate-y-8)", () => {
      const { container } = render(
        <ScrollReveal direction="up">content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain("translate-y-8");
    });

    it("applies 'down' direction class (-translate-y-8)", () => {
      const { container } = render(
        <ScrollReveal direction="down">content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain("-translate-y-8");
    });

    it("applies 'left' direction class (-translate-x-8)", () => {
      const { container } = render(
        <ScrollReveal direction="left">content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain("-translate-x-8");
    });

    it("applies 'right' direction class (-translate-x-8)", () => {
      const { container } = render(
        <ScrollReveal direction="right">content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain("-translate-x-8");
    });

    it("applies 'scale' direction class (scale-95)", () => {
      const { container } = render(
        <ScrollReveal direction="scale">content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain("scale-95");
    });
  });

  describe("visible state classes", () => {
    it("resets all transforms to neutral when visible", () => {
      const { container } = render(
        <ScrollReveal direction="up">content</ScrollReveal>,
      );

      fireIntersection(true);

      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain("translate-y-0");
      expect(wrapper.className).toContain("translate-x-0");
      expect(wrapper.className).toContain("scale-100");
      expect(wrapper.className).toContain("opacity-100");
    });
  });

  describe("delay prop", () => {
    it("applies transition delay style", () => {
      const { container } = render(
        <ScrollReveal delay={300}>content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.style.transitionDelay).toBe("300ms");
    });

    it("defaults to 0ms when delay is not set", () => {
      const { container } = render(
        <ScrollReveal>content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.style.transitionDelay).toBe("0ms");
    });
  });

  describe("className prop", () => {
    it("appends custom className to wrapper", () => {
      const { container } = render(
        <ScrollReveal className="my-custom-class">content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain("my-custom-class");
    });
  });

  describe("cleanup", () => {
    it("disconnects observer on unmount", () => {
      const { unmount } = render(<ScrollReveal>content</ScrollReveal>);
      unmount();
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});
