import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServicesSlider } from "@/components/services/ServicesSlider";
import { services } from "@/lib/data/services";

vi.mock("@/components/services/ServiceCard", () => ({
  ServiceCard: (props: any) => (
    <div
      data-testid="service-card"
      data-title={props.title}
      data-index={props.index}
    >
      {props.title}
    </div>
  ),
}));

describe("ServicesSlider", () => {
  const titles: Record<string, string> = {};
  const shortDescriptions: Record<string, string> = {};

  for (const service of services) {
    titles[service.slug] = `Title for ${service.slug}`;
    shortDescriptions[service.slug] = `Description for ${service.slug}`;
  }

  it("renders all service cards duplicated (2x length)", () => {
    render(
      <ServicesSlider
        titles={titles}
        shortDescriptions={shortDescriptions}
        learnMoreLabel="Learn More"
      />,
    );
    const cards = screen.getAllByTestId("service-card");
    expect(cards).toHaveLength(services.length * 2);
  });

  it("has the CSS animation class on the track", () => {
    const { container } = render(
      <ServicesSlider
        titles={titles}
        shortDescriptions={shortDescriptions}
        learnMoreLabel="Learn More"
      />,
    );
    const track = container.querySelector(".slider-track");
    expect(track).toBeInTheDocument();
    expect(track?.className).toContain(
      "animate-[scroll_30s_linear_infinite]",
    );
  });
});
