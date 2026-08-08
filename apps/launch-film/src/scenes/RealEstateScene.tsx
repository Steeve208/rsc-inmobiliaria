import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeInOut, GoldAccentLabel, KenBurns, RiseText } from "../components/Motion";
import { PropertyCardUI } from "../components/UIChrome";
import { COLORS } from "../lib/theme";

export const RealEstateScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <KenBurns
        src="assets/scene-home.jpg"
        startScale={1.06}
        endScale={1.16}
        startX={0}
        endX={-1.5}
        dim={0.42}
      />
      <FadeInOut fadeIn={10} fadeOut={12}>
        <AbsoluteFill style={{ padding: "120px 120px 0" }}>
          <GoldAccentLabel delay={4}>Real Estate</GoldAccentLabel>
          <RiseText delay={10} fontSize={58} maxWidth={720}>
            Discover real estate shaped for how you live.
          </RiseText>
          <div style={{ height: 18 }} />
          <RiseText
            delay={28}
            fontSize={24}
            weight={500}
            color={COLORS.textMuted}
            maxWidth={640}
            tracking="0"
          >
            From modern homes to landmark addresses — all in one place.
          </RiseText>
        </AbsoluteFill>
        <PropertyCardUI
          delay={18}
          x={1180}
          y={220}
          title="Skyline Residence"
          meta="3 beds · 2 baths · 186 m²"
          price="USD 720,000"
        />
        <PropertyCardUI
          delay={30}
          x={1320}
          y={560}
          scale={0.88}
          title="Premium Apartment"
          meta="2 beds · 2 baths · 124 m²"
          price="USD 420,000"
        />
      </FadeInOut>
    </AbsoluteFill>
  );
};
