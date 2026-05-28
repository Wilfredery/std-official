import { describe, it, expect, vi } from "vitest";
import { render, screen, createMockTranslator } from "@/lib/__tests__/test-utils";
import { ContactFaq } from "@/components/contact/Faq/FaqSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("ContactFaq", () => {
  it("renders the FAQ title from contact.faq.title", async () => {
    const jsx = await ContactFaq();
    render(jsx);
    expect(screen.getByText(enMessages.contact.faq.title)).toBeInTheDocument();
  });

  it("renders all 4 FAQ questions", async () => {
    const jsx = await ContactFaq();
    render(jsx);
    enMessages.contact.faq.items.forEach((item) => {
      expect(screen.getByText(item.q)).toBeInTheDocument();
    });
  });

  it("renders all 4 FAQ answers", async () => {
    const jsx = await ContactFaq();
    render(jsx);
    enMessages.contact.faq.items.forEach((item) => {
      expect(screen.getByText(item.a, { hidden: true })).toBeInTheDocument();
    });
  });

  it("each item has the gradient-border-card class", async () => {
    const jsx = await ContactFaq();
    const { container } = render(jsx);
    const details = container.querySelectorAll("details");
    expect(details.length).toBe(4);
    details.forEach((detail) => {
      expect(detail).toHaveClass("gradient-border-card");
    });
  });
});
