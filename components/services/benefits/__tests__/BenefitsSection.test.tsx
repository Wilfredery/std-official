import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { BenefitsSection } from "@/components/services/benefits/BenefitsSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("BenefitsSection", () => {
  it("renders eyebrow text", async () => {
    const jsx = await BenefitsSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.benefits.eyebrow),
    ).toBeInTheDocument();
  });

  it("renders title text", async () => {
    const jsx = await BenefitsSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.benefits.title),
    ).toBeInTheDocument();
  });

  it("renders exactly 4 benefit cards", async () => {
    const jsx = await BenefitsSection({ locale: "en" });
    render(jsx);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(4);
  });

  it("each card contains an icon (SVG)", async () => {
    const jsx = await BenefitsSection({ locale: "en" });
    const { container } = render(jsx);
    const cards = container.querySelectorAll(".gradient-border-card");
    expect(cards).toHaveLength(4);
    cards.forEach((card) => {
      expect(card.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("each card has a title and description", async () => {
    const jsx = await BenefitsSection({ locale: "en" });
    render(jsx);
    enMessages.home.benefits.items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });
});
