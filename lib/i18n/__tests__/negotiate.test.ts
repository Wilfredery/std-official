import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl/routing", () => ({
  defineRouting: (config: unknown) => config,
}));

import { negotiateLocale } from "@/lib/i18n/negotiate";

describe("negotiateLocale", () => {
  it("falls back to the default locale when header is missing", () => {
    expect(negotiateLocale(null)).toBe("en");
    expect(negotiateLocale("")).toBe("en");
  });

  it("matches a regional Spanish tag to es", () => {
    expect(negotiateLocale("es-DO,es;q=0.9,en;q=0.8")).toBe("es");
  });

  it("respects q-values over header order", () => {
    expect(negotiateLocale("en;q=0.5,es;q=0.9")).toBe("es");
  });

  it("skips unsupported languages", () => {
    expect(negotiateLocale("fr-FR,fr;q=0.9,es;q=0.7")).toBe("es");
  });

  it("falls back to default when nothing is supported", () => {
    expect(negotiateLocale("fr-FR,de;q=0.8")).toBe("en");
  });

  it("ignores languages with q=0", () => {
    expect(negotiateLocale("es;q=0,en;q=0.5")).toBe("en");
  });
});
