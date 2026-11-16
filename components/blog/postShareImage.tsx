import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  blogUi,
  getPostBySlug,
  readingMinutes,
  toBlogLocale,
} from "@/lib/data/blog";

/** Shared by opengraph-image.tsx and twitter-image.tsx in app/[locale]/blog/[slug]. */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const SHARE_IMAGE_CONTENT_TYPE = "image/png";

/**
 * Brand colors from app/globals.css (dark theme), converted from OKLCH to hex
 * because ImageResponse cannot resolve CSS variables.
 */
const COLORS = {
  background: "#0a0a0c", // --background (dark)
  foreground: "#fafafa", // --foreground (dark)
  muted: "#9797a1", // --muted-foreground (dark)
  primary: "#9658ff", // --primary (dark)
  primaryDeep: "#7c37e4", // --primary (light)
  accent: "#f7357c", // --accent (dark)
} as const;

const FONT_DIR = join(process.cwd(), "components", "blog", "fonts");

// Libre Franklin is the site's own font. The shipped "latin" subset covers
// U+0000-00FF, so á é í ó ú ñ ¿ ¡ render without any network fetch.
let fontsPromise: Promise<
  { name: string; data: Buffer; weight: 400 | 700; style: "normal" }[]
> | null = null;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(FONT_DIR, "LibreFranklin-Regular.woff")),
    readFile(join(FONT_DIR, "LibreFranklin-Bold.woff")),
  ]).then(([regular, bold]) => [
    { name: "Libre Franklin", data: regular, weight: 400, style: "normal" },
    { name: "Libre Franklin", data: bold, weight: 700, style: "normal" },
  ]);
  return fontsPromise;
}

/** Localized alt text for the per-post share image. */
export function postShareImageAlt(locale: string, slug: string): string {
  const lang = toBlogLocale(locale);
  const post = getPostBySlug(slug);
  if (!post) return "ShineTechData";
  const title = post.content[lang].title;
  return lang === "es"
    ? `Blog de ShineTechData: ${title}`
    : `ShineTechData blog: ${title}`;
}

/** Step the headline size down for longer titles so they never overflow. */
export function titleFontSize(title: string): number {
  if (title.length <= 60) return 72;
  if (title.length <= 80) return 62;
  return 54;
}

export async function renderPostShareImage(
  locale: string,
  slug: string,
): Promise<Response> {
  const post = getPostBySlug(slug);
  if (!post) return new Response("Not found", { status: 404 });

  const lang = toBlogLocale(locale);
  const ui = blogUi[lang];
  const content = post.content[lang];
  const eyebrow = `${ui.eyebrow.toUpperCase()}  ·  ${readingMinutes(content)} ${ui.minRead}`;
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: COLORS.foreground,
          fontFamily: "Libre Franklin",
          backgroundColor: COLORS.background,
          backgroundImage: `radial-gradient(circle at 92% 8%, ${COLORS.primaryDeep}99 0%, ${COLORS.background}00 55%), radial-gradient(circle at 0% 110%, ${COLORS.accent}55 0%, ${COLORS.background}00 45%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <polygon
              points="26,3 46,14.5 46,37.5 26,49 6,37.5 6,14.5"
              fill="none"
              stroke={COLORS.primary}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <circle cx="26" cy="26" r="6" fill={COLORS.accent} />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            ShineTechData
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 3,
              color: COLORS.accent,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: titleFontSize(content.title),
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1.5,
            }}
          >
            {content.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: COLORS.muted,
          }}
        >
          <div style={{ display: "flex" }}>shinetechdata.com</div>
          <div
            style={{
              display: "flex",
              width: 160,
              height: 6,
              borderRadius: 3,
              backgroundImage: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
            }}
          />
        </div>
      </div>
    ),
    { ...SHARE_IMAGE_SIZE, fonts },
  );
}
