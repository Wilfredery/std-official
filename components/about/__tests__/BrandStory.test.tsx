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

  it("renders two paragraph blocks (origin + philosophy)", async () => {
    const jsx = await BrandStory({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.story.origin),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enMessages.about.story.philosophy),
    ).toBeInTheDocument();
  });
});
