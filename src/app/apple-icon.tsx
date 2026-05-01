import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

function loadMarkBase64(): string {
  const buf = readFileSync(
    join(process.cwd(), "public/brand/v4-mark-only.jpg"),
  );
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

export default function AppleIcon() {
  const src = loadMarkBase64();
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a1f44",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="URPE"
          width={180}
          height={180}
          style={{ objectFit: "cover", borderRadius: 36 }}
        />
      </div>
    ),
    { ...size },
  );
}
