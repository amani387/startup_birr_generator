import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          background: "linear-gradient(145deg, #1a1714 0%, #0a0908 100%)",
          borderRadius: 36,
          border: "4px solid #e4b429",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderBottom: "18px solid #f5d76e",
            marginBottom: 8,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            height: 72,
          }}
        >
          <div
            style={{
              width: 22,
              height: 40,
              background: "#a67c00",
              borderRadius: 4,
              opacity: 0.65,
            }}
          />
          <div
            style={{
              width: 22,
              height: 56,
              background: "#e4b429",
              borderRadius: 4,
              opacity: 0.9,
            }}
          />
          <div
            style={{
              width: 22,
              height: 72,
              background: "#f5d76e",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
