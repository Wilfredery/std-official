import { describe, it, expect, vi } from "vitest";
import { render, screen, createMockTranslator } from "@/lib/__tests__/test-utils";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import enMessages from "@/messages/en.json";

// Mock SubtitleTyping (client component with timers)
vi.mock("@/components/home/hero/SubtitleTyping", () => ({
  SubtitleTyping: ({
    staticText,
    dynamicText,
  }: {
    staticText: string;
    dynamicText: string;
  }) => (
    <p>
      {staticText} {dynamicText}
    </p>
  ),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("ServicesHeader", () => {
  it("renders eyebrow text", async () => {
    const jsx = await ServicesHeader({ locale: "en" });
    render(jsx);
    expect(screen.getByText(enMessages.services.header.eyebrow)).toBeInTheDocument();
  });

  it("renders title text", async () => {
    const jsx = await ServicesHeader({ locale: "en" });
    render(jsx);
    expect(screen.getByText(enMessages.services.header.title)).toBeInTheDocument();
  });

  it("renders titleAccent text", async () => {
    const jsx = await ServicesHeader({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.services.header.titleAccent),
    ).toBeInTheDocument();
  });

  it("renders SubtitleTyping with correct props", async () => {
    const jsx = await ServicesHeader({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(
        `${enMessages.services.header.subtitleStatic} ${enMessages.services.header.subtitleDynamic}`,
      ),
    ).toBeInTheDocument();
  });
});