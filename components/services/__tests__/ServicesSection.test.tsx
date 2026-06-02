import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { ServicesSection } from "@/components/services/ServicesSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

vi.mock("@/components/services/ServiceCard", () => ({
  ServiceCard: (props: Record<string, unknown>) => (
    <div data-testid="service-card" data-title={props.title as string}>
      {props.title as string}
    </div>
  ),
}));

describe("ServicesSection", () => {
  it("renders the section eyebrow from i18n", async () => {
    const jsx = await ServicesSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.services.eyebrow),
    ).toBeInTheDocument();
  });

  it("renders the section title from i18n", async () => {
    const jsx = await ServicesSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.services.title),
    ).toBeInTheDocument();
  });

  it("renders the section subtitle from i18n", async () => {
    const jsx = await ServicesSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.services.subtitle),
    ).toBeInTheDocument();
  });

  it("renders all service cards in a grid", async () => {
    const jsx = await ServicesSection({ locale: "en" });
    render(jsx);
    const cards = screen.getAllByTestId("service-card");
    expect(cards.length).toBeGreaterThan(0);
  });
});
