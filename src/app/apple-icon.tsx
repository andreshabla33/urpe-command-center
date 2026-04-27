import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: "#000",
          color: "#fff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          fontWeight: 700,
          letterSpacing: -3,
          borderRadius: 36,
        }}
      >
        <div style={{ display: "flex" }}>U</div>
        <div
          style={{
            display: "flex",
            fontSize: 14,
            letterSpacing: 4,
            opacity: 0.6,
            marginTop: 4,
          }}
        >
          URPE
        </div>
      </div>
    ),
    { ...size },
  );
}
