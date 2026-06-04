import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { PillarsSection } from "@/components/about/pillars/AboutPillarsSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("PillarsSection", () => {
  it("renders the eyebrow from i18n", async () => {
    const jsx = await PillarsSection({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.pillars.eyebrow),
    ).toBeInTheDocument();
  });

  it("renders the section title from i18n", async () => {
    const jsx = await PillarsSection({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(
        new RegExp(enMessages.about.pillars.title.trim()),
      ),
    ).toBeInTheDocument();
  });

  it("renders the accent part of the title", async () => {
    const jsx = await PillarsSection({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.pillars.titleAccent),
    ).toBeInTheDocument();
  });

  it("renders the subtitle from i18n", async () => {
    const jsx = await PillarsSection({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.pillars.subtitle),
    ).toBeInTheDocument();
  });

  it("renders all 6 pillar cards with their titles", async () => {
    const jsx = await PillarsSection({ locale: "en" });
    render(jsx);

    const titles = enMessages.about.pillars.titles;
    const values = Object.values(titles) as string[];
    for (const title of values) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders all 6 pillar cards with their descriptions", async () => {
    const jsx = await PillarsSection({ locale: "en" });
    render(jsx);

    const descriptions = enMessages.about.pillars.descriptions;
    const values = Object.values(descriptions) as string[];
    for (const desc of values) {
      expect(screen.getByText(desc)).toBeInTheDocument();
    }
  });

});
