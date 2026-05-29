import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceFaq } from "@/components/services/detail/faq/ServiceFaq";

describe("ServiceFaq", () => {
  const defaultProps = {
    title: "Frequently Asked Questions",
    items: [
      { question: "What is the timeline?", answer: "Typically 4-6 weeks." },
      { question: "Do you offer support?", answer: "Yes, 24/7 support included." },
      { question: "What does it cost?", answer: "Contact us for a custom quote." },
    ],
  };

  it("renders the title", () => {
    render(<ServiceFaq {...defaultProps} />);
    expect(
      screen.getByText("Frequently Asked Questions"),
    ).toBeInTheDocument();
  });

  it("renders all questions", () => {
    render(<ServiceFaq {...defaultProps} />);
    expect(screen.getByText("What is the timeline?")).toBeInTheDocument();
    expect(screen.getByText("Do you offer support?")).toBeInTheDocument();
    expect(screen.getByText("What does it cost?")).toBeInTheDocument();
  });

  it("renders answers but they are inside details (accordion)", () => {
    render(<ServiceFaq {...defaultProps} />);
    // All answers should exist in the document
    expect(
      screen.getByText("Typically 4-6 weeks."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Yes, 24/7 support included."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Contact us for a custom quote."),
    ).toBeInTheDocument();
  });

  it("renders the correct number of details/summary elements", () => {
    const { container } = render(<ServiceFaq {...defaultProps} />);
    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(3);

    const summaries = container.querySelectorAll("summary");
    expect(summaries).toHaveLength(3);
  });

  it("details elements are not open by default", () => {
    const { container } = render(<ServiceFaq {...defaultProps} />);
    const details = container.querySelectorAll("details");
    details.forEach((detail) => {
      expect(detail).not.toHaveAttribute("open");
    });
  });

  it("renders the plus toggle icon in each summary", () => {
    const { container } = render(<ServiceFaq {...defaultProps} />);
    const summaries = container.querySelectorAll("summary");
    summaries.forEach((summary) => {
      const toggle = summary.querySelector("span");
      expect(toggle).toHaveTextContent("+");
    });
  });
});
