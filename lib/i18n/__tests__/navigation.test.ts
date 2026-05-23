import { describe, it, expect, vi } from "vitest";

const { mockNavigation } = vi.hoisted(() => {
  const nav = {
    Link: vi.fn(),
    redirect: vi.fn(),
    usePathname: vi.fn(),
    useRouter: vi.fn(),
    getPathname: vi.fn(),
  };
  return { mockNavigation: nav };
});

vi.mock("next-intl/navigation", () => ({
  createNavigation: vi.fn(() => mockNavigation),
}));

import { Link, redirect, usePathname, useRouter, getPathname } from "@/lib/i18n/navigation";
import { createNavigation } from "next-intl/navigation";
import { routing } from "@/lib/i18n/routing";

describe("navigation", () => {
  it("calls createNavigation with routing config", () => {
    expect(createNavigation).toHaveBeenCalledWith(routing);
  });

  it("exports Link", () => {
    expect(Link).toBeDefined();
  });

  it("exports redirect", () => {
    expect(redirect).toBeDefined();
  });

  it("exports usePathname", () => {
    expect(usePathname).toBeDefined();
  });

  it("exports useRouter", () => {
    expect(useRouter).toBeDefined();
  });

  it("exports getPathname", () => {
    expect(getPathname).toBeDefined();
  });
});