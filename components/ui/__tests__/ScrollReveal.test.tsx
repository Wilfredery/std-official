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

  it("renders with data-testid scroll-reveal-wrapper", () => {
    const { container } = render(<ScrollReveal>content</ScrollReveal>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute("data-testid", "scroll-reveal-wrapper");
  });

  it("creates an IntersectionObserver", () => {
    render(<ScrollReveal>content</ScrollReveal>);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it("starts with data-visible=false initially", () => {
    const { container } = render(
      <ScrollReveal>content</ScrollReveal>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute("data-visible", "false");
  });

  it("transitions to data-visible=true on intersection", () => {
    const { container } = render(
      <ScrollReveal>content</ScrollReveal>,
    );

    fireIntersection(true);

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute("data-visible", "true");
  });

  it("stops observing after first intersection (unobserve is called)", () => {
    render(<ScrollReveal>content</ScrollReveal>);

    fireIntersection(true);

    expect(mockUnobserve).toHaveBeenCalledTimes(1);
  });

  describe("direction prop", () => {
    it("renders children with default direction", () => {
      const { container } = render(
        <ScrollReveal direction="up">content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveAttribute("data-testid", "scroll-reveal-wrapper");
      expect(wrapper).toHaveTextContent("content");
    });

    it("renders children with custom direction", () => {
      const { container } = render(
        <ScrollReveal direction="left">content</ScrollReveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveAttribute("data-testid", "scroll-reveal-wrapper");
      expect(wrapper).toHaveTextContent("content");
    });
  });

  describe("visible state transitions", () => {
    it("transitions data-visible to true on intersection", () => {
      const { container } = render(
        <ScrollReveal direction="up">content</ScrollReveal>,
      );

      expect((container.firstElementChild as HTMLElement)).toHaveAttribute("data-visible", "false");

      fireIntersection(true);

      expect((container.firstElementChild as HTMLElement)).toHaveAttribute("data-visible", "true");
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
