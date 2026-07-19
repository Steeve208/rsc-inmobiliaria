"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#070B14",
          color: "#f4f7fb",
          fontFamily:
            'Manrope, Satoshi, "Segoe UI", system-ui, sans-serif',
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ color: "#d4a017", letterSpacing: "0.12em", fontSize: 12 }}>
            ERROR
          </p>
          <h1 style={{ margin: "12px 0 0", fontSize: 32 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: 12, color: "#8C97A8", maxWidth: 360 }}>
            An unexpected error occurred. You can try again or return home.
          </p>
          {error.digest ? (
            <p style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
              Ref: {error.digest}
            </p>
          ) : null}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                height: 44,
                padding: "0 20px",
                borderRadius: 8,
                border: 0,
                background: "#d4a017",
                color: "#000a1a",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link
              href="/en"
              style={{
                display: "inline-flex",
                height: 44,
                alignItems: "center",
                padding: "0 20px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
