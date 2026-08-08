import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeInOut, GoldAccentLabel, KenBurns, RiseText } from "../components/Motion";
import { VehicleCardUI } from "../components/UIChrome";
import { COLORS } from "../lib/theme";

export const VehiclesScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <KenBurns
        src="assets/scene-vehicles.jpg"
        startScale={1.08}
        endScale={1.18}
        startX={1}
        endX={-2}
        dim={0.4}
        overlay="linear-gradient(90deg, rgba(5,8,15,.92), rgba(5,8,15,.35), rgba(5,8,15,.55))"
      />
      <FadeInOut fadeIn={10} fadeOut={12}>
        <AbsoluteFill style={{ padding: "120px 120px 0" }}>
          <GoldAccentLabel delay={4}>Vehicles</GoldAccentLabel>
          <RiseText delay={10} fontSize={56} maxWidth={760}>
            Explore vehicles that move with your ambition.
          </RiseText>
          <div style={{ height: 18 }} />
          <RiseText
            delay={26}
            fontSize={24}
            weight={500}
            color={COLORS.textMuted}
            maxWidth={620}
            tracking="0"
          >
            From everyday mobility to high-performance design.
          </RiseText>
        </AbsoluteFill>
        <VehicleCardUI delay={16} x={1280} y={280} />
        <VehicleCardUI
          delay={28}
          x={1100}
          y={620}
          make="Land Rover"
          title="Range Rover Sport"
          meta="2025 · 3,100 km"
          price="USD 96,500"
        />
      </FadeInOut>
    </AbsoluteFill>
  );
};
