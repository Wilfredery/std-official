import { ImageResponse } from "next/og";

export const alt = "ShineTechData";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const interSemiBold = await fetch(
    "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
  ).then(async (res) => {
    const css = await res.text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('woff2'\)/)?.[1];
    if (!fontUrl) throw new Error("Font URL not found");
    return fetch(fontUrl).then((r) => r.arrayBuffer());
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e1b4b",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "-2px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            ShineTechData
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#818cf8",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Tech solutions for your company
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interSemiBold,
          weight: 600,
          style: "normal",
        },
      ],
    }
  );
}
