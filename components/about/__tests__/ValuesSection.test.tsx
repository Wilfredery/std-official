import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { ValuesSection } from "@/components/about/values/AboutValuesSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    const mock = createMockTranslator(namespace);
    // t.raw("items") must return the raw array from messages
    (mock as ReturnType<typeof createMockTranslator> & {
      raw: (key: string) => unknown;
    }).raw = (key: string) => {
      const keys = namespace.split(".");
      let obj: unknown = enMessages;
      for (const k of keys) {
        if (obj === null || obj === undefined) return [];
        obj = (obj as Record<string, unknown>)[k];
      }
      const parts = key.split(".");
      let result: unknown = obj;
      for (const part of parts) {
        if (result === null || result === undefined) return [];
        result = (result as Record<string, unknown>)[part];
      }
      return result;
    };
    return Promise.resolve(mock);
  }),
}));

describe("ValuesSection", () => {
  it("renders the eyebrow from i18n", async () => {
    const jsx = await ValuesSection({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.values.eyebrow),
    ).toBeInTheDocument();
  });

  it("renders the section title from i18n", async () => {
    const jsx = await ValuesSection({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.values.title),
    ).toBeInTheDocument();
  });

  it("renders all 4 value cards with their titles", async () => {
    const jsx = await ValuesSection({ locale: "en" });
    render(jsx);

    const items = enMessages.about.values.items;
    for (const item of items) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it("renders all 4 value cards with their descriptions", async () => {
    const jsx = await ValuesSection({ locale: "en" });
    render(jsx);

    const items = enMessages.about.values.items;
    for (const item of items) {
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
  });

  it("renders a 4-column grid on large screens", async () => {
    const jsx = await ValuesSection({ locale: "en" });
    const { container } = render(jsx);

    const grid = container.querySelector(".lg\\:grid-cols-4");
    expect(grid).toBeInTheDocument();
  });

  it("renders 4 lucide icons inside the cards", async () => {
    const jsx = await ValuesSection({ locale: "en" });
    const { container } = render(jsx);

    // Each card has an SVG icon from lucide-react
    const svgs = container.querySelectorAll(
      ".gradient-border-card svg",
    );
    expect(svgs).toHaveLength(4);
  });
});
