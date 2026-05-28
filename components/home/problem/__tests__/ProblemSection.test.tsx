import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { ProblemSection } from "@/components/home/problem/ProblemSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("ProblemSection", () => {
  it("renders eyebrow text", async () => {
    const jsx = await ProblemSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.problem.eyebrow),
    ).toBeInTheDocument();
  });

  it("renders title text", async () => {
    const jsx = await ProblemSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.problem.title),
    ).toBeInTheDocument();
  });

  it("renders exactly 3 problem cards", async () => {
    const jsx = await ProblemSection({ locale: "en" });
    const { container } = render(jsx);
    const cards = container.querySelectorAll(".gradient-border-card");
    expect(cards).toHaveLength(3);
  });

  it("each card renders the correct item text from messages", async () => {
    const jsx = await ProblemSection({ locale: "en" });
    render(jsx);

    const items = enMessages.home.problem.items as string[];
    items.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("cards have gradient-border-card class", async () => {
    const jsx = await ProblemSection({ locale: "en" });
    const { container } = render(jsx);
    const firstCard = container.querySelector(".gradient-border-card");
    expect(firstCard).toBeInTheDocument();
    expect(firstCard).toHaveClass("gradient-border-card");
  });

  it("cards have glow-gradient class", async () => {
    const jsx = await ProblemSection({ locale: "en" });
    const { container } = render(jsx);
    const firstCard = container.querySelector(".glow-gradient");
    expect(firstCard).toBeInTheDocument();
  });
});
