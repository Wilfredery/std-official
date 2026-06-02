import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import type { ServiceBase } from "@/lib/data/services";

// ---------------------------------------------------------------------------
// Hoist mock references so the vi.mock factory can use them
// ---------------------------------------------------------------------------

const { mockGetTranslations } = vi.hoisted(() => ({
  mockGetTranslations: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: mockGetTranslations,
}));

// ---------------------------------------------------------------------------
// Mock child components to isolate the orchestrator
// ---------------------------------------------------------------------------

vi.mock("../hero/ServiceHero", () => ({
  ServiceHero: (props: Record<string, unknown>) => (
    <div data-testid="hero" data-props={JSON.stringify(props)}>
      {(props as { title?: string }).title}
    </div>
  ),
}));

vi.mock("@/components/ui/ScrollReveal", () => ({
  ScrollReveal: ({
    children,
    direction,
    delay,
  }: {
    children: React.ReactNode;
    direction?: string;
    delay?: number;
  }) => (
    <div data-testid="scroll-reveal" data-direction={direction} data-delay={delay}>
      {children}
    </div>
  ),
}));

vi.mock("../breadcrumb/ServiceBreadcrumb", () => ({
  ServiceBreadcrumb: (props: Record<string, unknown>) => (
    <div data-testid="breadcrumb" data-props={JSON.stringify(props)}>
      Breadcrumb
    </div>
  ),
}));

vi.mock("../overview/ServiceOverview", () => ({
  ServiceOverview: (props: Record<string, unknown>) => (
    <div data-testid="overview" data-props={JSON.stringify(props)}>
      Overview
    </div>
  ),
}));

vi.mock("../audience/ServiceAudience", () => ({
  ServiceAudience: (props: Record<string, unknown>) => (
    <div data-testid="audience" data-props={JSON.stringify(props)}>
      Audience
    </div>
  ),
}));

vi.mock("../deliverables/ServiceDeliverables", () => ({
  ServiceDeliverables: (props: Record<string, unknown>) => (
    <div data-testid="deliverables" data-props={JSON.stringify(props)}>
      Deliverables
    </div>
  ),
}));

vi.mock("../timeline/ServiceTimeline", () => ({
  ServiceTimeline: (props: Record<string, unknown>) => (
    <div data-testid="timeline" data-props={JSON.stringify(props)}>
      Timeline
    </div>
  ),
}));

vi.mock("../faq/ServiceFaq", () => ({
  ServiceFaq: (props: Record<string, unknown>) => (
    <div data-testid="faq" data-props={JSON.stringify(props)}>
      FAQ
    </div>
  ),
}));

vi.mock("../ctaLink/CtaLink", () => ({
  CtaLink: (props: Record<string, unknown>) => (
    <div data-testid="cta-link" data-props={JSON.stringify(props)}>
      CTA
    </div>
  ),
}));

// ---------------------------------------------------------------------------
// Component under test
// ---------------------------------------------------------------------------

import { ServiceDetailSection } from "../ServiceDetailSection";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockT(prefix: string) {
  const t = vi.fn((key: string) => `${prefix}.${key}`) as ReturnType<typeof vi.fn> & {
    raw: ReturnType<typeof vi.fn>;
  };
  t.raw = vi.fn((key: string) => `${prefix}.raw.${key}`);
  return t;
}

function parseProps(testId: string) {
  const el = screen.getByTestId(testId);
  const raw = el.getAttribute("data-props");
  return raw ? JSON.parse(raw) : {};
}

const mockService: ServiceBase = {
  slug: "data-analysis",
  icon: (() => null) as unknown as ServiceBase["icon"],
  accent: "primary",
  href: "/services/data-analysis",
};

const defaultLocale = "en";
const defaultSlug = "data-analysis";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ServiceDetailSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Return distinct t functions based on the namespace
    mockGetTranslations.mockImplementation(
      async ({ namespace }: { locale: string; namespace: string }) => {
        if (namespace === "serviceDetail") {
          return createMockT("labels");
        }
        return createMockT("service");
      },
    );
  });

  // ── Translation fetching ───────────────────────────────────────

  it("fetches translations from both namespaces on render", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    expect(mockGetTranslations).toHaveBeenCalledTimes(2);
    expect(mockGetTranslations).toHaveBeenCalledWith({
      locale: "en",
      namespace: "serviceDetail",
    });
    expect(mockGetTranslations).toHaveBeenCalledWith({
      locale: "en",
      namespace: "serviceDetail.services.data-analysis",
    });
  });

  it("passes locale through correctly", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: "es",
        slug: defaultSlug,
      }),
    );

    expect(mockGetTranslations).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "es" }),
    );
  });

  it("uses slug in the service namespace key", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: "machine-learning",
      }),
    );

    expect(mockGetTranslations).toHaveBeenCalledWith(
      expect.objectContaining({
        namespace: "serviceDetail.services.machine-learning",
      }),
    );
  });

  // ── Hero section ───────────────────────────────────────────────

  it("renders ServiceHero with translated title, subtitleStatic, subtitleDynamic", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const hero = screen.getByTestId("hero");
    expect(hero).toBeInTheDocument();
    expect(hero).toHaveTextContent("service.title");

    const props = parseProps("hero");
    expect(props.title).toBe("service.title");
    expect(props.subtitleStatic).toBe("service.subtitleStatic");
    expect(props.subtitleDynamic).toBe("service.subtitleDynamic");
  });

  it("wraps Hero in ScrollReveal with direction=up delay=0", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const hero = screen.getByTestId("hero");
    const heroWrapper = hero.closest('[data-testid="scroll-reveal"]');
    expect(heroWrapper).toHaveAttribute("data-direction", "up");
    expect(heroWrapper).toHaveAttribute("data-delay", "0");
  });

  // ── Breadcrumb ─────────────────────────────────────────────────

  it("renders ServiceBreadcrumb with translated label", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const props = parseProps("breadcrumb");
    expect(props.label).toBe("labels.breadcrumb");
  });

  // ── Overview ───────────────────────────────────────────────────

  it("renders ServiceOverview with translated label and overview data", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const props = parseProps("overview");
    expect(props.label).toBe("labels.summaryLabel");
    expect(props.overview).toBe("service.overview");
  });

  // ── Audience ───────────────────────────────────────────────────

  it("renders ServiceAudience with label + data (forWho, problem)", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const props = parseProps("audience");
    expect(props.forWhoLabel).toBe("labels.forWhoLabel");
    expect(props.forWho).toBe("service.forWho");
    expect(props.problemLabel).toBe("labels.problemLabel");
    expect(props.problem).toBe("service.problem");
  });

  // ── Deliverables ───────────────────────────────────────────────

  it("renders ServiceDeliverables with title and items (raw deliverables)", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const props = parseProps("deliverables");
    expect(props.title).toBe("labels.deliverables");
    expect(props.items).toBe("service.raw.deliverables");
  });

  // ── FAQ ────────────────────────────────────────────────────────

  it("renders ServiceFaq with title and items (raw faq)", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const props = parseProps("faq");
    expect(props.title).toBe("labels.faq");
    expect(props.items).toBe("service.raw.faq");
  });

  // ── CTA Link ───────────────────────────────────────────────────

  it("renders CtaLink with back label", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const props = parseProps("cta-link");
    expect(props.label).toBe("labels.back");
  });

  // ── Structure & ordering ───────────────────────────────────────

  it("renders all 7 child sections", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("overview")).toBeInTheDocument();
    expect(screen.getByTestId("audience")).toBeInTheDocument();
    expect(screen.getByTestId("deliverables")).toBeInTheDocument();
    expect(screen.getByTestId("faq")).toBeInTheDocument();
    expect(screen.getByTestId("cta-link")).toBeInTheDocument();
  });

  it("wraps each section in a ScrollReveal with distinct direction and delay", async () => {
    render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const wrappers = screen.getAllByTestId("scroll-reveal");
    // 7 sections = 7 ScrollReveal wrappers
    expect(wrappers).toHaveLength(7);

    const directions = wrappers.map((w) => w.getAttribute("data-direction"));
    const delays = wrappers.map((w) => Number(w.getAttribute("data-delay")));

    expect(directions).toEqual([
      "scale",
      "up",
      "left",
      "down",
      "right",
      "down",
      "scale",
    ]);
    expect(delays).toEqual([0, 0, 100, 200, 300, 500, 600]);
  });

  // ── Article element ────────────────────────────────────────────

  it("wraps body sections in an article with responsive classes", async () => {
    const { container } = render(
      await ServiceDetailSection({
        service: mockService,
        locale: defaultLocale,
        slug: defaultSlug,
      }),
    );

    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
    expect(article?.className).toContain("max-w-4xl");
    expect(article?.className).toContain("mx-auto");
    expect(article?.className).toContain("py-16");
    expect(article?.className).toContain("md:py-24");
  });

});
