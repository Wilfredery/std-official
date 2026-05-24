import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useHydrated } from "@/hooks/useHydrated";

describe("useHydrated", () => {
  it("returns true after hydration in jsdom environment", () => {
    const { result } = renderHook(() => useHydrated());
    expect(result.current).toBe(true);
  });
});