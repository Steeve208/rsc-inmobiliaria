import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/theme";

export const ReeskovaMark: React.FC<{ size?: number; opacity?: number }> = ({
  size = 120,
  opacity = 1,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ opacity }}
    >
      <path
        stroke={COLORS.gold}
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M17 13.5h19.2c6.9 0 11.4 4.1 11.4 10.5 0 4.7-2.7 8.2-7.3 9.7L48 50.5H38.6L31.2 36H26.4V50.5H17V13.5Z"
      />
      <path
        stroke={COLORS.gold}
        strokeWidth="3.4"
        strokeLinejoin="round"
        d="M26.4 13.5V36h7.6c3.2 0 5.2-1.85 5.2-5s-2-5-5.2-5h-7.6"
      />
      <g stroke={COLORS.gold} strokeWidth="2.3" strokeLinecap="round">
        <path d="M21.2 39.2V31.4" />
        <path d="M24.8 39.2V27.2" />
        <path d="M28.4 39.2V29.6" />
        <path d="M32 39.2V25.4" />
      </g>
    </svg>
  );
};

export const Wordmark: React.FC<{
  showTagline?: boolean;
  scale?: number;
  opacity?: number;
}> = ({ showTagline = true, scale = 1, opacity = 1 }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <ReeskovaMark size={96 * scale} />
      <div
        style={{
          marginTop: 28,
          fontSize: 56 * scale,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: COLORS.text,
          textTransform: "uppercase",
          fontFamily: "Satoshi, Manrope, system-ui, sans-serif",
        }}
      >
        REESKOVA
      </div>
      {showTagline ? (
        <div
          style={{
            marginTop: 14,
            fontSize: 16 * scale,
            fontWeight: 500,
            letterSpacing: "0.22em",
            color: COLORS.gold,
            textTransform: "uppercase",
            fontFamily: "Satoshi, Manrope, system-ui, sans-serif",
          }}
        >
          Premium marketplace
        </div>
      ) : null}
    </div>
  );
};

export const GoldLine: React.FC<{ width?: number; opacity?: number }> = ({
  width = 80,
  opacity = 1,
}) => (
  <div
    style={{
      width,
      height: 2,
      background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
      opacity,
      boxShadow: `0 0 16px ${COLORS.goldSoft}`,
    }}
  />
);

export const SceneBackground: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>{children}</AbsoluteFill>
);
