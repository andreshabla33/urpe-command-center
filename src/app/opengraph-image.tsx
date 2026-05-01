import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "URPE Command Center · Numero 18 Operations Division";

function loadLockupBase64(): string {
  const buf = readFileSync(
    join(process.cwd(), "public/brand/v4-horizontal-lockup.jpg"),
  );
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

export default function OpenGraphImage() {
  const src = loadLockupBase64();
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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={1100}
          height={367}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
