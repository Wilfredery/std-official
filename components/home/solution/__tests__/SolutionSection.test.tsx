import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { SolutionSection } from "@/components/home/solution/SolutionSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("SolutionSection", () => {
  it("renders eyebrow text", async () => {
    const jsx = await SolutionSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.solution.eyebrow),
    ).toBeInTheDocument();
  });

  it("renders title text", async () => {
    const jsx = await SolutionSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.solution.title),
    ).toBeInTheDocument();
  });

  it("renders description text", async () => {
    const jsx = await SolutionSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.solution.description),
    ).toBeInTheDocument();
  });

  it("renders section with border-b class", async () => {
    const jsx = await SolutionSection({ locale: "en" });
    const { container } = render(jsx);
    const section = container.querySelector("section");
    expect(section).toHaveClass("border-b");
    expect(section).toHaveClass("border-border");
  });
});
