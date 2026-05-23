import { describe, it, expect, vi } from "vitest";

// Mock defineRouting to return the config as-is
vi.mock("next-intl/routing", () => ({
  defineRouting: (config: unknown) => config,
}));

import { routing } from "@/lib/i18n/routing";

describe("routing", () => {
  it("exports the correct locales from config", () => {
    expect(routing.locales).toEqual(["es", "en"]);
  });

  it("exports the correct defaultLocale from config", () => {
    expect(routing.defaultLocale).toBe("en");
  });

  it("sets localePrefix to always", () => {
    expect(routing.localePrefix).toBe("always");
  });
});