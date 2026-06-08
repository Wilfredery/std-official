import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROBOTS_PATH = resolve(process.cwd(), "out", "robots.txt");
const SITE_URL = "https://shinetechdata.com";

describe("out/robots.txt — build output verification", () => {
  let content: string;

  beforeAll(() => {
    content = readFileSync(ROBOTS_PATH, "utf-8");
  });

  it("is a non-empty file", () => {
    expect(content.length).toBeGreaterThan(0);
  });

  it('contains "User-Agent: *" directive', () => {
    expect(content).toMatch(/User-Agent:\s*\*/);
  });

  it('contains "Allow: /" directive', () => {
    expect(content).toMatch(/Allow:\s*\/\s*$/m);
  });

  it("does not contain any Disallow rules", () => {
    const disallowMatches = content.match(/^Disallow:/m);
    expect(disallowMatches).toBeNull();
  });
});

// Graceful skip if build output missing
if (!existsSync(ROBOTS_PATH)) {
  console.warn("out/robots.txt not found — skipping build output verification");
  describe.skip("out/robots.txt — build output verification", () => {});
}
