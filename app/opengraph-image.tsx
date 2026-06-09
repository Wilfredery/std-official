import { ImageResponse } from "next/og";

export const alt = "ShineTechData";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-2px",
              marginBottom: 24,
            }}
          >
            ShineTechData
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#818cf8",
              fontWeight: 400,
            }}
          >
            Tech solutions for your company
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
