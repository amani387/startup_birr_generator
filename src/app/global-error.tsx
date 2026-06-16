"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const message =
    error.message?.trim() || "An unexpected error occurred. Please refresh the page.";

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "system-ui, sans-serif",
          background: "#0c0b0a",
          color: "#e5e2e1",
        }}
      >
        <div
          style={{
            maxWidth: "24rem",
            width: "100%",
            textAlign: "center",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "1.5rem",
            background: "#181716",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
            Application error
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#d0c6ab", margin: 0, lineHeight: 1.5 }}>
            {message}
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.5rem" }}>
              Ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.25rem",
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "#ffd700",
              color: "#14120f",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
