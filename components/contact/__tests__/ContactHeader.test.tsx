import { describe, it, expect, vi } from "vitest";
import { render, screen, createMockTranslator } from "@/lib/__tests__/test-utils";
import { ContactHeader } from "@/components/contact/ContactHeader";
import enMessages from "@/messages/en.json";

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

describe("ContactHeader", () => {
  it("renders eyebrow text", async () => {
    const jsx = await ContactHeader({ locale: "en" });
    render(jsx);
    expect(screen.getByText(enMessages.contact.header.eyebrow)).toBeInTheDocument();
  });

  it("renders title and titleAccent", async () => {
    const jsx = await ContactHeader({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.contact.header.title.trim()),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enMessages.contact.header.titleAccent),
    ).toBeInTheDocument();
  });

  it("renders hero-glow background", async () => {
    const jsx = await ContactHeader({ locale: "en" });
    const { container } = render(jsx);
    expect(container.querySelector(".hero-glow")).toBeInTheDocument();
  });

  it("SubtitleTyping receives correct props", async () => {
    const jsx = await ContactHeader({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(
        `${enMessages.contact.header.subtitleStatic} ${enMessages.contact.header.subtitleDynamic}`,
      ),
    ).toBeInTheDocument();
  });
});
