// @vitest-environment node
import { describe, it, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import * as og from "@/app/[locale]/blog/[slug]/opengraph-image";
import * as tw from "@/app/[locale]/blog/[slug]/twitter-image";
import { blogPosts } from "@/lib/data/blog";
import { locales } from "@/lib/site";

const cases = blogPosts.flatMap((post) =>
  locales.map((locale) => ({ locale, slug: post.slug })),
);

describe.each([
  ["opengraph-image", og],
  ["twitter-image", tw],
])("%s module", (_name, mod) => {
  it("exports 1200x630 PNG config", () => {
    expect(mod.size).toEqual({ width: 1200, height: 630 });
    expect(mod.contentType).toBe("image/png");
  });

  // dynamicParams must stay unset: the [__metadata_id__] child segment is never
  // prerendered, so `false` makes every share-image URL 404 in production.
  it("is statically generated for every locale x slug", () => {
    expect(mod).not.toHaveProperty("dynamicParams");
    const params = mod.generateStaticParams();
    expect(params).toHaveLength(blogPosts.length * locales.length);
    expect(params).toEqual(expect.arrayContaining(cases));
  });

  it("returns a localized alt per post", () => {
    for (const { locale, slug } of cases) {
      const [meta] = mod.generateImageMetadata({ params: { locale, slug } });
      const post = blogPosts.find((p) => p.slug === slug)!;
      expect(meta.alt).toContain(post.content[locale].title);
      expect(meta.size).toEqual({ width: 1200, height: 630 });
      expect(meta.contentType).toBe("image/png");
    }
    const [es] = mod.generateImageMetadata({ params: { locale: "es", slug: blogPosts[0].slug } });
    const [en] = mod.generateImageMetadata({ params: { locale: "en", slug: blogPosts[0].slug } });
    expect(es.alt).not.toBe(en.alt);
  });
});

describe("share image rendering", () => {
  it.each(cases)("renders a 1200x630 PNG for $slug [$locale]", async ({ locale, slug }) => {
    const res = (await og.default({ params: Promise.resolve({ locale, slug }) })) as Response;
    expect(res.headers.get("content-type")).toBe("image/png");
    const buf = Buffer.from(await res.arrayBuffer());
    expect(buf.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(buf.readUInt32BE(16)).toBe(1200);
    expect(buf.readUInt32BE(20)).toBe(630);
    if (process.env.OG_DUMP_DIR) {
      mkdirSync(process.env.OG_DUMP_DIR, { recursive: true });
      writeFileSync(join(process.env.OG_DUMP_DIR, `${locale}-${slug}.png`), buf);
    }
  }, 30_000);
});
