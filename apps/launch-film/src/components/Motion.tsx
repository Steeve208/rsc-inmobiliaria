import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../lib/theme";

type KenBurnsProps = {
  src: string;
  startScale?: number;
  endScale?: number;
  startX?: number;
  endX?: number;
  startY?: number;
  endY?: number;
  overlay?: string;
  dim?: number;
};

export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  startScale = 1.08,
  endScale = 1.18,
  startX = 0,
  endX = -2,
  startY = 0,
  endY = -1.5,
  overlay = "linear-gradient(90deg, rgba(5,8,15,.88), rgba(5,8,15,.45), rgba(5,8,15,.25))",
  dim = 0.35,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / Math.max(durationInFrames - 1, 1);
  const scale = interpolate(progress, [0, 1], [startScale, endScale]);
  const x = interpolate(progress, [0, 1], [startX, endX]);
  const y = interpolate(progress, [0, 1], [startY, endY]);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${x}%, ${y}%)`,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: overlay }} />
      <AbsoluteFill style={{ backgroundColor: `rgba(7,11,20,${dim})` }} />
    </AbsoluteFill>
  );
};

export const FadeInOut: React.FC<{
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ children, fadeIn = 12, fadeOut = 12 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const RiseText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fontSize?: number;
  color?: string;
  weight?: number;
  tracking?: string;
  maxWidth?: number;
  align?: "left" | "center";
}> = ({
  children,
  delay = 0,
  fontSize = 56,
  color = COLORS.text,
  weight = 700,
  tracking = "-0.02em",
  maxWidth = 980,
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 80, mass: 0.8 },
  });
  const y = interpolate(anim, [0, 1], [28, 0]);
  const opacity = interpolate(anim, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontSize,
        fontWeight: weight,
        color,
        letterSpacing: tracking,
        maxWidth,
        textAlign: align,
        lineHeight: 1.15,
        fontFamily: "Satoshi, Manrope, system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
};

export const GoldAccentLabel: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  return (
    <div
      style={{
        opacity: anim,
        transform: `translateY(${interpolate(anim, [0, 1], [12, 0])}px)`,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 22,
      }}
    >
      <div
        style={{
          width: 28,
          height: 2,
          background: COLORS.gold,
          boxShadow: `0 0 12px ${COLORS.goldSoft}`,
        }}
      />
      <span
        style={{
          color: COLORS.gold,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "Satoshi, Manrope, system-ui, sans-serif",
        }}
      >
        {children}
      </span>
    </div>
  );
};
