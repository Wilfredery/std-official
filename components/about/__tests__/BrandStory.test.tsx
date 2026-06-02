import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { BrandStory } from "@/components/about/brandStory/AboutBrandStory";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("BrandStory", () => {
  it("renders the story title from i18n", async () => {
    const jsx = await BrandStory({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.story.title),
    ).toBeInTheDocument();
  });

  it("renders the origin paragraph from i18n", async () => {
    const jsx = await BrandStory({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.story.origin),
    ).toBeInTheDocument();
  });

  it("renders the philosophy paragraph from i18n", async () => {
    const jsx = await BrandStory({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.story.philosophy),
    ).toBeInTheDocument();
  });

  it("renders a two-column grid layout", async () => {
    const jsx = await BrandStory({ locale: "en" });
    const { container } = render(jsx);

    const grid = container.querySelector(".md\\:grid-cols-2");
    expect(grid).toBeInTheDocument();
  });

  it("renders two paragraph blocks (one per grid column)", async () => {
    const jsx = await BrandStory({ locale: "en" });
    const { container } = render(jsx);

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBe(2);
  });
});
