import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceOverview } from "@/components/services/detail/overview/ServiceOverview";

describe("ServiceOverview", () => {
  const defaultProps = {
    label: "SUMMARY",
    overview: "We provide deep-dive diagnostics to uncover operational efficiencies.",
  };

  it("renders the label as an h2", () => {
    render(<ServiceOverview {...defaultProps} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("SUMMARY");
  });

  it("renders the overview text", () => {
    render(<ServiceOverview {...defaultProps} />);
    expect(
      screen.getByText(
        "We provide deep-dive diagnostics to uncover operational efficiencies.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the overview in a paragraph", () => {
    render(<ServiceOverview {...defaultProps} />);
    const label = screen.getByText("SUMMARY");
    // The overview text should be in a <p> right after the heading
    const paragraph = label.parentElement?.querySelector("p");
    expect(paragraph).toHaveTextContent(
      "We provide deep-dive diagnostics to uncover operational efficiencies.",
    );
  });

  it("renders each detail paragraph after the overview", () => {
    const details = ["First detail paragraph.", "Second detail paragraph."];
    const { container } = render(
      <ServiceOverview {...defaultProps} details={details} />,
    );
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0]).toHaveTextContent(defaultProps.overview);
    expect(paragraphs[1]).toHaveTextContent("First detail paragraph.");
    expect(paragraphs[2]).toHaveTextContent("Second detail paragraph.");
  });

  it("renders only the overview paragraph when details are omitted", () => {
    const { container } = render(<ServiceOverview {...defaultProps} />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});
