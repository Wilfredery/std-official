import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceHero } from "@/components/services/detail/hero/ServiceHero";

vi.mock("@/components/home/hero/SubtitleTyping", () => ({
  SubtitleTyping: ({
    staticText,
    dynamicText,
  }: {
    staticText: string;
    dynamicText: string;
  }) => (
    <span data-testid="subtitle">
      {staticText} {dynamicText}
    </span>
  ),
}));

describe("ServiceHero", () => {
  const defaultProps = {
    title: "Data Analysis",
    subtitleStatic: "We transform",
    subtitleDynamic: "data into decisions",
  };

  it("renders the title in an h1 with gradient-text class", () => {
    render(<ServiceHero {...defaultProps} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Data Analysis");
    expect(heading).toHaveClass("gradient-text");
  });

  it("renders the mocked SubtitleTyping component", () => {
    render(<ServiceHero {...defaultProps} />);
    const subtitle = screen.getByTestId("subtitle");
    expect(subtitle).toHaveTextContent("We transform data into decisions");
  });

  it("passes correct props to SubtitleTyping", () => {
    render(
      <ServiceHero
        title="BI"
        subtitleStatic="Unlock"
        subtitleDynamic="your insights"
      />,
    );
    const subtitle = screen.getByTestId("subtitle");
    expect(subtitle).toHaveTextContent("Unlock your insights");
  });
});
