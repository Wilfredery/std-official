import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceDeliverables } from "@/components/services/detail/deliverables/ServiceDeliverables";

describe("ServiceDeliverables", () => {
  const defaultProps = {
    title: "What You'll Get",
    items: ["Custom dashboards", "Weekly reports", "Data pipeline automation"],
  };

  it("renders the title", () => {
    render(<ServiceDeliverables {...defaultProps} />);
    expect(screen.getByText("What You'll Get")).toBeInTheDocument();
  });

  it("renders all deliverable items", () => {
    render(<ServiceDeliverables {...defaultProps} />);
    expect(screen.getByText("Custom dashboards")).toBeInTheDocument();
    expect(screen.getByText("Weekly reports")).toBeInTheDocument();
    expect(screen.getByText("Data pipeline automation")).toBeInTheDocument();
  });

  it("renders a CheckCircle2 icon for each item", () => {
    const { container } = render(<ServiceDeliverables {...defaultProps} />);
    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(3);

    listItems.forEach((li) => {
      const svg = li.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("renders nothing when items array is empty", () => {
    const { container } = render(
      <ServiceDeliverables title="Empty" items={[]} />,
    );
    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(0);
  });
});
