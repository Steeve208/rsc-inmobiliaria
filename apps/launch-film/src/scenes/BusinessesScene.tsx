import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeInOut, GoldAccentLabel, KenBurns, RiseText } from "../components/Motion";
import { CompanyCardUI } from "../components/UIChrome";
import { COLORS } from "../lib/theme";

export const BusinessesScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <KenBurns
        src="assets/scene-business.jpg"
        startScale={1.05}
        endScale={1.14}
        dim={0.5}
        overlay="linear-gradient(90deg, rgba(5,8,15,.88), rgba(5,8,15,.5), rgba(5,8,15,.7))"
      />
      <FadeInOut fadeIn={10} fadeOut={12}>
        <AbsoluteFill style={{ padding: "110px 120px 0" }}>
          <GoldAccentLabel delay={4}>Verified Businesses</GoldAccentLabel>
          <RiseText delay={10} fontSize={54} maxWidth={780}>
            Connect with verified businesses ready to deliver.
          </RiseText>
          <div style={{ height: 16 }} />
          <RiseText
            delay={26}
            fontSize={24}
            weight={500}
            color={COLORS.textMuted}
            maxWidth={640}
            tracking="0"
          >
            Agencies, dealerships, and partners you can rely on.
          </RiseText>
        </AbsoluteFill>
        <CompanyCardUI delay={16} x={980} y={420} name="Horizon Realty" />
        <CompanyCardUI
          delay={24}
          x={1230}
          y={380}
          name="Apex Motors"
          role="Verified dealership"
        />
        <CompanyCardUI
          delay={32}
          x={1480}
          y={460}
          name="Nova Capital"
          role="Verified partner"
        />
      </FadeInOut>
    </AbsoluteFill>
  );
};
