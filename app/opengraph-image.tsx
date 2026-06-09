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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
          padding: "60px",
        }}
      >
        {/* Logo hexagon shape */}
        <div
          style={{
            width: "120px",
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M60 10L110 35V85L60 110L10 85V35L60 10Z"
              stroke="#818cf8"
              strokeWidth="4"
              fill="none"
            />
            <circle cx="60" cy="60" r="20" fill="#818cf8" opacity="0.3" />
            <circle cx="60" cy="60" r="10" fill="#818cf8" />
          </svg>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: "1.1",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Shine
          <span style={{ color: "#818cf8" }}>Tech</span>
          Data
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "#c7d2fe",
            textAlign: "center",
            fontWeight: "400",
            letterSpacing: "1px",
          }}
        >
          Tech solutions for your company
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
