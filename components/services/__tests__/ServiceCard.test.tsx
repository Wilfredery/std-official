import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceCard } from "@/components/services/ServiceCard";

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ children, href, className, ...rest }: Record<string, unknown>) => (
    <a href={href as string} className={className as string} {...rest}>
      {children as React.ReactNode}
    </a>
  ),
}));

describe("ServiceCard", () => {
  const defaultProps = {
    title: "Data Analysis",
    shortDescription:
      "Deep-dive diagnostics to uncover hidden operational efficiencies.",
    learnMoreLabel: "View service details",
    index: 0,
    slug: "data-analysis",
    accent: "primary" as const,
  };

  it("renders the service title", () => {
    render(<ServiceCard {...defaultProps} />);
    expect(screen.getByText("Data Analysis")).toBeInTheDocument();
  });

  it("renders the short description", () => {
    render(<ServiceCard {...defaultProps} />);
    expect(
      screen.getByText(
        "Deep-dive diagnostics to uncover hidden operational efficiencies.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the learn more label", () => {
    render(<ServiceCard {...defaultProps} />);
    expect(screen.getByText("View service details")).toBeInTheDocument();
  });

  it("link href points to /services/{slug}", () => {
    render(<ServiceCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/services/data-analysis");
  });

  it("has correct animationDelay style based on index", () => {
    render(<ServiceCard {...defaultProps} index={3} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("style")).toMatch(
      /animation-delay:\s*0\.15/,
    );
  });

  it("has animationDelay of 0s for index 0", () => {
    render(<ServiceCard {...defaultProps} index={0} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("style")).toMatch(
      /animation-delay:\s*0s/,
    );
  });
});
