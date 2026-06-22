import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1a1714 0%, #0a0908 100%)",
          borderRadius: 8,
          border: "1.5px solid #e4b429",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 3,
            height: 20,
            paddingBottom: 2,
          }}
        >
          <div
            style={{
              width: 5,
              height: 11,
              background: "#a67c00",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 5,
              height: 15,
              background: "#e4b429",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 5,
              height: 19,
              background: "#f5d76e",
              borderRadius: 1,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
