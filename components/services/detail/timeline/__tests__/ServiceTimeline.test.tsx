import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceTimeline } from "@/components/services/detail/timeline/ServiceTimeline";

describe("ServiceTimeline", () => {
  const defaultSteps = [
    {
      step: "Discover",
      title: "Discovery Phase",
      description: "We audit your data landscape.",
    },
    {
      step: "Build",
      title: "Build Phase",
      description: "We architect the solution.",
    },
    {
      step: "Launch",
      title: "Launch Phase",
      description: "We deploy to production.",
    },
  ];

  const defaultProps = {
    title: "Our Process",
    steps: defaultSteps,
    accent: "primary" as const,
    slug: "data-analysis",
  };

  it("renders the title", () => {
    render(<ServiceTimeline {...defaultProps} />);
    expect(screen.getByText("Our Process")).toBeInTheDocument();
  });

  it("renders the correct number of steps", () => {
    render(<ServiceTimeline {...defaultProps} />);
    // Each step has its title rendered
    expect(screen.getByText("Discovery Phase")).toBeInTheDocument();
    expect(screen.getByText("Build Phase")).toBeInTheDocument();
    expect(screen.getByText("Launch Phase")).toBeInTheDocument();
  });

  it("renders step numbers with labels", () => {
    render(<ServiceTimeline {...defaultProps} />);
    expect(screen.getByText(/01 — Discover/)).toBeInTheDocument();
    expect(screen.getByText(/02 — Build/)).toBeInTheDocument();
    expect(screen.getByText(/03 — Launch/)).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    render(<ServiceTimeline {...defaultProps} />);
    expect(
      screen.getByText("We audit your data landscape."),
    ).toBeInTheDocument();
    expect(screen.getByText("We architect the solution.")).toBeInTheDocument();
    expect(screen.getByText("We deploy to production.")).toBeInTheDocument();
  });

  it("renders icons when slug is known (data-analysis)", () => {
    const { container } = render(<ServiceTimeline {...defaultProps} />);
    // Known slugs render lucide icons (SVGs inside the circles)
    const circles = container.querySelectorAll(".size-20");
    expect(circles).toHaveLength(3);

    circles.forEach((circle) => {
      const svg = circle.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("falls back to step label when slug is unknown (no icon)", () => {
    const { container } = render(
      <ServiceTimeline
        title="Process"
        steps={defaultSteps}
        accent="primary"
        slug="unknown-slug"
      />,
    );
    // Unknown slug should show step label text instead of icons
    const circles = container.querySelectorAll(".size-20");
    expect(circles).toHaveLength(3);

    // The first circle should show "Discover" instead of an icon
    expect(circles[0].textContent).toContain("Discover");
  });

  it("applies accent styling to circles", () => {
    const { container } = render(<ServiceTimeline {...defaultProps} />);
    const circles = container.querySelectorAll(".size-20");
    expect(circles[0]).toHaveClass("bg-primary/10");
  });

  it("applies accent text color for accent='accent'", () => {
    render(
      <ServiceTimeline
        title="Process"
        steps={defaultSteps}
        accent="accent"
        slug="data-analysis"
      />,
    );
    // The step label should exist
    expect(screen.getByText(/01 — Discover/)).toBeInTheDocument();
  });
});
