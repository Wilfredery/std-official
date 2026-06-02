import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { ContactChannels } from "@/components/contact/Channels/ContactChannels";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("ContactChannels", () => {
  it("renders the section title with gradient-text accent", async () => {
    const jsx = await ContactChannels();
    render(jsx);
    expect(
      screen.getByText(enMessages.contact.channels.title.trim()),
    ).toBeInTheDocument();
    const accent = screen.getByText(enMessages.contact.channels.titleAccent);
    expect(accent).toHaveClass("gradient-text");
  });

  it("renders WhatsApp link", async () => {
    const jsx = await ContactChannels();
    render(jsx);
    const link = screen.getByRole("link", {
      name: enMessages.contact.channels.whatsappAria,
    });
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("renders email link", async () => {
    const jsx = await ContactChannels();
    render(jsx);
    const links = screen.getAllByRole("link");
    const emailLink = links.find((l) =>
      l.getAttribute("href")?.startsWith("mailto:"),
    );
    expect(emailLink).toBeDefined();
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining(enMessages.contact.channels.emailValue),
    );
  });

  it("renders hours section", async () => {
    const jsx = await ContactChannels();
    render(jsx);
    expect(
      screen.getByText(enMessages.contact.channels.hours),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enMessages.contact.channels.hoursValue),
    ).toBeInTheDocument();
  });
});
