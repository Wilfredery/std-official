import { describe, it, expect } from "vitest";
import { services, serviceSlugs, getServiceBySlug } from "@/lib/data/services";

describe("services", () => {
  it("exports an array with 6 services", () => {
    expect(services).toHaveLength(6);
  });

  it("each service has the required structure", () => {
    for (const service of services) {
      expect(service).toHaveProperty("slug");
      expect(service).toHaveProperty("icon");
      expect(service).toHaveProperty("accent");
      expect(service).toHaveProperty("href");
      expect(typeof service.slug).toBe("string");
      expect(typeof service.href).toBe("string");
      expect(["primary", "accent"]).toContain(service.accent);
    }
  });

  it("each service href follows the /services/{slug} pattern", () => {
    for (const service of services) {
      expect(service.href).toBe(`/services/${service.slug}`);
    }
  });

  it("service slugs match the serviceSlugs const", () => {
    const actualSlugs = services.map((s) => s.slug);
    expect(actualSlugs).toEqual([...serviceSlugs]);
  });
});

describe("getServiceBySlug", () => {
  it("returns the matching service for a valid slug", () => {
    const result = getServiceBySlug("data-analysis");
    expect(result).toBeDefined();
    expect(result!.slug).toBe("data-analysis");
  });

  it("returns undefined for an invalid slug", () => {
    const result = getServiceBySlug("nonexistent");
    expect(result).toBeUndefined();
  });
});