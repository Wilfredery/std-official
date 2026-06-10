import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readPngDimensions(
  buffer: Buffer
): { width: number; height: number } | null {
  // PNG signature: 8 bytes
  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  for (let i = 0; i < 8; i++) {
    if (buffer[i] !== PNG_SIGNATURE[i]) return null;
  }
  // IHDR chunk starts at offset 16: 4-byte width, 4-byte height
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

describe("opengraph-image.png", () => {
  const imagePath = resolve(__dirname, "../../public/opengraph-image.png");

  it("exists at public/opengraph-image.png", () => {
    expect(() => readFileSync(imagePath)).not.toThrow();
  });

  it("is a valid PNG file", () => {
    const buffer = readFileSync(imagePath);
    const dimensions = readPngDimensions(buffer);
    expect(dimensions).not.toBeNull();
  });

  it("has width of 4500px", () => {
    const buffer = readFileSync(imagePath);
    const dimensions = readPngDimensions(buffer);
    expect(dimensions!.width).toBe(4500);
  });

  it("has height of 4500px", () => {
    const buffer = readFileSync(imagePath);
    const dimensions = readPngDimensions(buffer);
    expect(dimensions!.height).toBe(4500);
  });
});
