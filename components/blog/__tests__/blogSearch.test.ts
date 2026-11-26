import { describe, it, expect } from "vitest";
import { filterPosts, normalizeText, type BlogCardData } from "@/components/blog/blogSearch";

const card = (slug: string, title: string, topic: BlogCardData["topic"]): BlogCardData => ({
  slug,
  title,
  description: `Descripción de ${title}`,
  publishedAt: "2026-11-23",
  dateLabel: "23 de noviembre de 2026",
  minutes: 5,
  topic,
  topicLabel: topic === "machine-learning" ? "Machine Learning" : "Business Intelligence",
});

const posts = [
  card("bi", "Análisis de ventas con Power BI", "business-intelligence"),
  card("ml", "Pronóstico de demanda", "machine-learning"),
  card("gov", "Tableros para gobiernos locales", "business-intelligence"),
];

describe("normalizeText", () => {
  it("lowercases and strips accents", () => {
    expect(normalizeText("Análisis PRONÓSTICO ñandú")).toBe("analisis pronostico nandu");
  });
});

describe("filterPosts", () => {
  it("returns every post for an empty query and no topic", () => {
    expect(filterPosts(posts, "  ", null)).toEqual(posts);
  });

  it("matches ignoring accents and case", () => {
    expect(filterPosts(posts, "analisis", null).map((p) => p.slug)).toEqual(["bi"]);
  });

  it("requires every word to match", () => {
    expect(filterPosts(posts, "power ventas", null).map((p) => p.slug)).toEqual(["bi"]);
    expect(filterPosts(posts, "power demanda", null)).toEqual([]);
  });

  it("searches the topic label too", () => {
    expect(filterPosts(posts, "machine", null).map((p) => p.slug)).toEqual(["ml"]);
  });

  it("filters by topic and combines with the query", () => {
    expect(filterPosts(posts, "", "business-intelligence").map((p) => p.slug)).toEqual([
      "bi",
      "gov",
    ]);
    expect(filterPosts(posts, "gobiernos", "business-intelligence").map((p) => p.slug)).toEqual([
      "gov",
    ]);
    expect(filterPosts(posts, "gobiernos", "machine-learning")).toEqual([]);
  });
});
