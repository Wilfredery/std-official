import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceTools } from "@/components/services/detail/tools/ServiceTools";

describe("ServiceTools", () => {
  const defaultProps = {
    title: "Tools for small businesses",
    items: [
      { name: "Power BI", description: "Microsoft's BI tool." },
      { name: "Looker Studio", description: "Google's free dashboard tool." },
      { name: "Metabase", description: "Open-source BI." },
    ],
  };

  it("renders the title as an h2", () => {
    render(<ServiceTools {...defaultProps} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Tools for small businesses" }),
    ).toBeInTheDocument();
  });

  it("renders every tool name as an h3 with its description", () => {
    render(<ServiceTools {...defaultProps} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getByText("Power BI")).toBeInTheDocument();
    expect(screen.getByText("Google's free dashboard tool.")).toBeInTheDocument();
    expect(screen.getByText("Open-source BI.")).toBeInTheDocument();
  });

  it("renders tools in a semantic list", () => {
    const { container } = render(<ServiceTools {...defaultProps} />);
    expect(container.querySelectorAll("ul")).toHaveLength(1);
    expect(container.querySelectorAll("li")).toHaveLength(3);
  });

  it("marks the decorative icon as aria-hidden", () => {
    const { container } = render(<ServiceTools {...defaultProps} />);
    container.querySelectorAll("li svg").forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("renders no list items when items is empty", () => {
    const { container } = render(<ServiceTools title="Empty" items={[]} />);
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });
});
