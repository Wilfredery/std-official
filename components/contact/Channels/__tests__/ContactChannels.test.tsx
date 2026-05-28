import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ContactChannels } from "@/components/contact/Channels/ContactChannels";
import enMessages from "@/messages/en.json";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

vi.mock("@/hooks/useHydrated", () => ({
  useHydrated: () => true,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, className, priority, fill, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} {...props} />
  ),
}));

describe("ContactChannels", () => {
  it("renders the section title with gradient-text accent", () => {
    render(<ContactChannels />);
    expect(
      screen.getByText(enMessages.contact.channels.title.trim()),
    ).toBeInTheDocument();
    const accent = screen.getByText(enMessages.contact.channels.titleAccent);
    expect(accent).toHaveClass("gradient-text");
  });

  it("renders WhatsApp link", () => {
    render(<ContactChannels />);
    const link = screen.getByRole("link", { name: enMessages.contact.channels.whatsappAria });
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("renders email link", () => {
    render(<ContactChannels />);
    const links = screen.getAllByRole("link");
    const emailLink = links.find((l) => l.getAttribute("href")?.startsWith("mailto:"));
    expect(emailLink).toBeDefined();
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining(enMessages.contact.channels.emailValue),
    );
  });

  it("renders hours section", () => {
    render(<ContactChannels />);
    expect(screen.getByText(enMessages.contact.channels.hours)).toBeInTheDocument();
    expect(screen.getByText(enMessages.contact.channels.hoursValue)).toBeInTheDocument();
  });
});
