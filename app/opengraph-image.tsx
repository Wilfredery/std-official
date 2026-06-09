import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "ShineTechData";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  const imageBuffer = readFileSync(
    join(process.cwd(), "public", "images", "about", "about-light.webp")
  );
  const imageBase64 = imageBuffer.toString("base64");
  const imageSrc = `data:image/webp;base64,${imageBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <img
          src={imageSrc}
          alt="ShineTechData"
          style={{
            maxWidth: "80%",
            maxHeight: "60%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
