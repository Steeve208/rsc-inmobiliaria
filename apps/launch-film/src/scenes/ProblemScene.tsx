import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeInOut, GoldAccentLabel, KenBurns, RiseText } from "../components/Motion";
import { FragmentShards } from "../components/UIChrome";
import { COLORS } from "../lib/theme";

export const ProblemScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <KenBurns
        src="assets/scene-fragmented.jpg"
        startScale={1.05}
        endScale={1.14}
        dim={0.55}
        overlay="linear-gradient(180deg, rgba(7,11,20,.75), rgba(7,11,20,.55), rgba(7,11,20,.8))"
      />
      <FragmentShards />
      <FadeInOut fadeIn={10} fadeOut={14}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            paddingLeft: 140,
            paddingRight: 140,
          }}
        >
          <GoldAccentLabel delay={8}>The problem</GoldAccentLabel>
          <RiseText delay={14} fontSize={64} maxWidth={900}>
            Opportunities live in fragments.
          </RiseText>
          <div style={{ height: 22 }} />
          <RiseText
            delay={34}
            fontSize={28}
            weight={500}
            color={COLORS.textMuted}
            maxWidth={820}
            tracking="0"
          >
            Properties. Vehicles. Financing. Businesses —
            scattered across platforms never designed to work together.
          </RiseText>
        </AbsoluteFill>
      </FadeInOut>
    </AbsoluteFill>
  );
};
