import Link from "next/link";

export default function RootNotFound() {
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
            404
          </p>
          <h1 style={{ margin: "12px 0 0", fontSize: 32 }}>Page not found</h1>
          <p style={{ marginTop: 12, color: "#8C97A8", maxWidth: 360 }}>
            The page you requested does not exist or was moved.
          </p>
          <Link
            href="/en"
            style={{
              display: "inline-flex",
              marginTop: 28,
              height: 44,
              alignItems: "center",
              padding: "0 20px",
              borderRadius: 8,
              background: "#d4a017",
              color: "#000a1a",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
