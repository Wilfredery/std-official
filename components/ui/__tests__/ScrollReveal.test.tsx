import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@/lib/__tests__/test-utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { __resetObserverForTest } from "@/lib/observer";

// ---------------------------------------------------------------------------
// IntersectionObserver mock
// ---------------------------------------------------------------------------

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

// Track how many IntersectionObserver instances are created
let observerInstantiationCount = 0;
// Capture the IntersectionObserver callback so we can fire it in tests
let intersectionCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null = null;
// Track observed elements so we can map targets in fireIntersection
const observedElements = new Set<Element>();

class MockIntersectionObserver {
  observe = vi.fn((el: Element) => {
    mockObserve(el);
    observedElements.add(el);
  });
  unobserve = vi.fn((el: Element) => {
    mockUnobserve(el);
    observedElements.delete(el);
  });
  disconnect = vi.fn(() => {
    mockDisconnect();
    observedElements.clear();
  });
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
    observerInstantiationCount++;
  }
}

// Needed because ScrollReveal checks for IntersectionObserver on `window`
beforeEach(() => {
  __resetObserverForTest();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  mockUnobserve.mockClear();
  intersectionCallback = null;
  observerInstantiationCount = 0;
  observedElements.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fire the IntersectionObserver callback for a specific target element.
 * When target is omitted, fires for the first observed element (backwards compat).
 */
function fireIntersection(isIntersecting: boolean, target?: Element) {
  if (!intersectionCallback) {
    throw new Error("IntersectionObserver callback not captured yet");
  }
  const t = target ?? (observedElements.size > 0 ? [...observedElements][0] : undefined);
  act(() => {
    intersectionCallback!([
      { isIntersecting, target: t } as IntersectionObserverEntry,
    ]);
  });
}

/**
 * Return the latest wrapper element from a render container.
 */
function getWrapper(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement;
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
    it("unobserves element on unmount (singleton observer stays alive)", () => {
      const { unmount } = render(<ScrollReveal>content</ScrollReveal>);
      unmount();
      // Each instance calls unobserve on its own element; disconnect is NOT called
      // because the observer is shared across instances.
      expect(mockUnobserve).toHaveBeenCalled();
    });
  });

  describe("shared IntersectionObserver", () => {
    it("creates exactly ONE IntersectionObserver regardless of instance count", () => {
      render(<ScrollReveal>Content 1</ScrollReveal>);
      render(<ScrollReveal>Content 2</ScrollReveal>);
      render(<ScrollReveal>Content 3</ScrollReveal>);
      render(<ScrollReveal>Content 4</ScrollReveal>);
      render(<ScrollReveal>Content 5</ScrollReveal>);

      // The singleton guarantees only one IntersectionObserver is ever created
      expect(observerInstantiationCount).toBe(1);
      // But observe is called once per instance
      expect(mockObserve).toHaveBeenCalledTimes(5);
    });

    it("each instance becomes visible independently via the shared observer", () => {
      const { container: c1 } = render(<ScrollReveal>One</ScrollReveal>);
      const { container: c2 } = render(<ScrollReveal>Two</ScrollReveal>);

      const w1 = getWrapper(c1);
      const w2 = getWrapper(c2);

      expect(w1).toHaveAttribute("data-visible", "false");
      expect(w2).toHaveAttribute("data-visible", "false");

      // Fire intersection only for element 1
      fireIntersection(true, w1);

      // Element 1 becomes visible, element 2 stays hidden
      expect(w1).toHaveAttribute("data-visible", "true");
      expect(w2).toHaveAttribute("data-visible", "false");

      // Now fire for element 2
      fireIntersection(true, w2);

      expect(w2).toHaveAttribute("data-visible", "true");
    });

    it("preserves existing behavior: unobserve called after first intersection", () => {
      render(<ScrollReveal>content</ScrollReveal>);

      fireIntersection(true);

      // Still stops observing after the element enters viewport
      expect(mockUnobserve).toHaveBeenCalledTimes(1);
    });
  });
});
