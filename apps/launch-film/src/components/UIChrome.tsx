import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../lib/theme";

const cardBase: React.CSSProperties = {
  background: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
  fontFamily: "Satoshi, Manrope, system-ui, sans-serif",
};

export const PropertyCardUI: React.FC<{
  delay?: number;
  title?: string;
  meta?: string;
  price?: string;
  x?: number;
  y?: number;
  scale?: number;
}> = ({
  delay = 0,
  title = "Modern Home in Miami",
  meta = "4 beds · 3 baths · 280 m²",
  price = "USD 850,000",
  x = 0,
  y = 0,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const float = Math.sin((frame + delay) / 28) * 6;

  return (
    <div
      style={{
        ...cardBase,
        width: 320 * scale,
        position: "absolute",
        left: x,
        top: y,
        opacity: anim,
        transform: `translateY(${interpolate(anim, [0, 1], [40, 0]) + float}px) scale(${interpolate(anim, [0, 1], [0.92, 1])})`,
      }}
    >
      <div
        style={{
          height: 170 * scale,
          background:
            "linear-gradient(135deg, #1a2438 0%, #0d1524 50%, #162033 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 40%, rgba(212,166,42,0.18), transparent 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: COLORS.gold,
            color: COLORS.bg,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "6px 10px",
            borderRadius: 999,
          }}
        >
          Premium
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ color: COLORS.text, fontSize: 18, fontWeight: 600 }}>
          {title}
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 6 }}>
          {meta}
        </div>
        <div
          style={{
            color: COLORS.gold,
            fontSize: 18,
            fontWeight: 700,
            marginTop: 12,
          }}
        >
          {price}
        </div>
      </div>
    </div>
  );
};

export const VehicleCardUI: React.FC<{
  delay?: number;
  make?: string;
  title?: string;
  meta?: string;
  price?: string;
  x?: number;
  y?: number;
}> = ({
  delay = 0,
  make = "Porsche",
  title = "Porsche Taycan",
  meta = "2024 · 8,200 km",
  price = "USD 118,000",
  x = 0,
  y = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const float = Math.sin((frame + delay) / 26) * 5;

  return (
    <div
      style={{
        ...cardBase,
        width: 300,
        position: "absolute",
        left: x,
        top: y,
        opacity: anim,
        transform: `translateY(${interpolate(anim, [0, 1], [36, 0]) + float}px)`,
      }}
    >
      <div
        style={{
          height: 150,
          background:
            "linear-gradient(145deg, #122018 0%, #0b1210 55%, #163024 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(34,197,94,0.18)",
            color: COLORS.green,
            border: "1px solid rgba(34,197,94,0.35)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "6px 10px",
            borderRadius: 999,
          }}
        >
          Verified
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ color: COLORS.green, fontSize: 12, fontWeight: 600 }}>
          {make}
        </div>
        <div style={{ color: COLORS.text, fontSize: 18, fontWeight: 600 }}>
          {title}
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 6 }}>
          {meta}
        </div>
        <div
          style={{
            color: COLORS.gold,
            fontSize: 18,
            fontWeight: 700,
            marginTop: 12,
          }}
        >
          {price}
        </div>
      </div>
    </div>
  );
};

export const CompanyCardUI: React.FC<{
  delay?: number;
  name?: string;
  role?: string;
  x?: number;
  y?: number;
}> = ({
  delay = 0,
  name = "Horizon Realty",
  role = "Verified agency",
  x = 0,
  y = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  return (
    <div
      style={{
        ...cardBase,
        width: 220,
        height: 220,
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: anim,
        transform: `translateY(${interpolate(anim, [0, 1], [30, 0])}px) scale(${interpolate(anim, [0, 1], [0.9, 1])})`,
        borderColor: "rgba(212,166,42,0.35)",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `linear-gradient(180deg, ${COLORS.goldHover}, ${COLORS.gold})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.bg,
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        {name.slice(0, 1)}
      </div>
      <div style={{ textAlign: "center", padding: "0 16px" }}>
        <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 600 }}>
          {name}
        </div>
        <div
          style={{
            color: COLORS.gold,
            fontSize: 12,
            marginTop: 6,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {role}
        </div>
      </div>
    </div>
  );
};

export const SearchBarUI: React.FC<{ delay?: number; query?: string }> = ({
  delay = 0,
  query = "Miami · Properties · Any price",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  const typed = Math.floor(
    interpolate(frame - delay - 10, [0, 45], [0, query.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <div
      style={{
        opacity: anim,
        transform: `translateY(${interpolate(anim, [0, 1], [24, 0])}px)`,
        width: 720,
        height: 64,
        borderRadius: 999,
        background: "rgba(255,255,255,0.96)",
        display: "flex",
        alignItems: "center",
        padding: "0 10px 0 28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        fontFamily: "Satoshi, Manrope, system-ui, sans-serif",
      }}
    >
      <div style={{ flex: 1, color: "#111827", fontSize: 18, fontWeight: 500 }}>
        {query.slice(0, typed)}
        <span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: COLORS.gold }}>
          |
        </span>
      </div>
      <div
        style={{
          height: 48,
          padding: "0 24px",
          borderRadius: 999,
          background: `linear-gradient(180deg, ${COLORS.goldHover}, ${COLORS.gold})`,
          color: COLORS.bg,
          fontWeight: 700,
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          letterSpacing: "0.04em",
        }}
      >
        Search
      </div>
    </div>
  );
};

export const FinancingPanelUI: React.FC<{ delay?: number }> = ({
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  const rows = [
    { label: "24h analysis", detail: "Fast digital review" },
    { label: "Verified partners", detail: "Trusted institutions" },
    { label: "100% digital", detail: "From request to decision" },
  ];

  return (
    <div
      style={{
        ...cardBase,
        width: 420,
        padding: 28,
        opacity: anim,
        transform: `translateY(${interpolate(anim, [0, 1], [32, 0])}px)`,
      }}
    >
      <div
        style={{
          color: COLORS.gold,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        RSC Credit
      </div>
      <div
        style={{
          color: COLORS.text,
          fontSize: 28,
          fontWeight: 700,
          marginTop: 10,
          lineHeight: 1.2,
        }}
      >
        Financial solutions for your next move
      </div>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {rows.map((row, i) => {
          const rowAnim = spring({
            frame: frame - delay - 8 - i * 6,
            fps,
            config: { damping: 200 },
          });
          return (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: 16,
                background: COLORS.bgSecondary,
                border: `1px solid ${COLORS.border}`,
                opacity: rowAnim,
                transform: `translateX(${interpolate(rowAnim, [0, 1], [16, 0])}px)`,
              }}
            >
              <div>
                <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 600 }}>
                  {row.label}
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>
                  {row.detail}
                </div>
              </div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: COLORS.gold,
                  boxShadow: `0 0 12px ${COLORS.gold}`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FragmentShards: React.FC = () => {
  const frame = useCurrentFrame();
  const shards = [
    { x: 180, y: 220, w: 280, h: 160, r: -8 },
    { x: 520, y: 160, w: 240, h: 140, r: 4 },
    { x: 900, y: 240, w: 260, h: 150, r: -3 },
    { x: 1280, y: 180, w: 300, h: 170, r: 6 },
    { x: 360, y: 520, w: 250, h: 140, r: 2 },
    { x: 760, y: 560, w: 280, h: 150, r: -5 },
    { x: 1180, y: 540, w: 260, h: 140, r: 3 },
  ];

  return (
    <AbsoluteFill>
      {shards.map((s, i) => {
        const drift = Math.sin((frame + i * 12) / 40) * 8;
        const opacity = interpolate(frame, [0, 20], [0, 0.85], {
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y + drift,
              width: s.w,
              height: s.h,
              borderRadius: 18,
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              opacity,
              transform: `rotate(${s.r}deg)`,
              boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 8,
                background: i % 2 === 0 ? COLORS.gold : COLORS.blue,
                opacity: 0.55,
              }}
            />
            <div style={{ padding: 16 }}>
              <div
                style={{
                  width: "55%",
                  height: 10,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.18)",
                }}
              />
              <div
                style={{
                  width: "35%",
                  height: 8,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.1)",
                  marginTop: 10,
                }}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
