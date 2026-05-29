import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceAudience } from "@/components/services/detail/audience/ServiceAudience";

describe("ServiceAudience", () => {
  const defaultProps = {
    forWhoLabel: "WHO IS IT FOR",
    forWho: "Businesses drowning in data but starved for insights.",
    problemLabel: "THE PROBLEM",
    problem: "Data silos prevent unified decision-making.",
  };

  it("renders the forWhoLabel and forWho text", () => {
    render(<ServiceAudience {...defaultProps} />);
    expect(screen.getByText("WHO IS IT FOR")).toBeInTheDocument();
    expect(
      screen.getByText("Businesses drowning in data but starved for insights."),
    ).toBeInTheDocument();
  });

  it("renders the problemLabel and problem text", () => {
    render(<ServiceAudience {...defaultProps} />);
    expect(screen.getByText("THE PROBLEM")).toBeInTheDocument();
    expect(
      screen.getByText("Data silos prevent unified decision-making."),
    ).toBeInTheDocument();
  });

  it("renders two cards with gradient-border-card class", () => {
    const { container } = render(<ServiceAudience {...defaultProps} />);
    const cards = container.querySelectorAll(".gradient-border-card");
    expect(cards).toHaveLength(2);
  });
});
