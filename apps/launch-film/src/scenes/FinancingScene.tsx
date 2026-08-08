import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeInOut, GoldAccentLabel, KenBurns, RiseText } from "../components/Motion";
import { FinancingPanelUI } from "../components/UIChrome";
import { COLORS } from "../lib/theme";

export const FinancingScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <KenBurns
        src="assets/scene-finance.jpg"
        startScale={1.06}
        endScale={1.15}
        dim={0.48}
        overlay="linear-gradient(100deg, rgba(5,8,15,.9), rgba(5,8,15,.4), rgba(5,8,15,.65))"
      />
      <FadeInOut fadeIn={10} fadeOut={12}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 120px",
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <GoldAccentLabel delay={4}>Financial Solutions</GoldAccentLabel>
            <RiseText delay={10} fontSize={54} maxWidth={700}>
              Access financial solutions built for clarity and trust.
            </RiseText>
            <div style={{ height: 18 }} />
            <RiseText
              delay={28}
              fontSize={24}
              weight={500}
              color={COLORS.textMuted}
              maxWidth={560}
              tracking="0"
            >
              Simple. Digital. Designed around your next decision.
            </RiseText>
          </div>
          <FinancingPanelUI delay={18} />
        </AbsoluteFill>
      </FadeInOut>
    </AbsoluteFill>
  );
};
