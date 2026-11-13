import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f19",
          borderRadius: 40,
          color: "#ffffff",
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          border: "8px solid #ffffff",
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    },
  );
}
