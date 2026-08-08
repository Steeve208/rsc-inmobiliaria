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
import { FadeInOut, GoldAccentLabel, KenBurns, RiseText } from "../components/Motion";
import {
  PropertyCardUI,
  SearchBarUI,
  VehicleCardUI,
} from "../components/UIChrome";
import { COLORS } from "../lib/theme";

export const DiscoverScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <KenBurns
        src="assets/scene-platform.jpg"
        startScale={1.04}
        endScale={1.12}
        dim={0.55}
        overlay="linear-gradient(180deg, rgba(7,11,20,.85), rgba(7,11,20,.55), rgba(7,11,20,.88))"
      />
      <FadeInOut fadeIn={10} fadeOut={12}>
        <AbsoluteFill
          style={{
            alignItems: "center",
            paddingTop: 100,
          }}
        >
          <GoldAccentLabel delay={4}>The experience</GoldAccentLabel>
          <RiseText delay={8} fontSize={58} align="center" maxWidth={900}>
            Search. Discover. Connect.
          </RiseText>
          <div style={{ height: 12 }} />
          <RiseText
            delay={22}
            fontSize={26}
            weight={500}
            color={COLORS.textMuted}
            align="center"
            maxWidth={760}
            tracking="0"
          >
            Everything you need — unified in a single marketplace.
          </RiseText>
          <div style={{ height: 48 }} />
          <SearchBarUI delay={28} />
        </AbsoluteFill>
        <PropertyCardUI
          delay={40}
          x={160}
          y={620}
          scale={0.82}
          title="Oceanview Villa"
          meta="5 beds · 4 baths"
          price="USD 1.2M"
        />
        <VehicleCardUI
          delay={48}
          x={1480}
          y={640}
          make="BMW"
          title="BMW i7"
          meta="2025 · 1,800 km"
          price="USD 109,000"
        />
      </FadeInOut>
    </AbsoluteFill>
  );
};

export const EcosystemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const partners = ["RSC Group", "RSC Bank", "RSC Capital", "Ora Technology"];

  return (
    <AbsoluteFill>
      <KenBurns
        src="assets/scene-city.jpg"
        startScale={1.08}
        endScale={1.16}
        dim={0.5}
        overlay="linear-gradient(180deg, rgba(7,11,20,.7), rgba(7,11,20,.45), rgba(7,11,20,.85))"
      />
      <FadeInOut fadeIn={10} fadeOut={14}>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 120px",
          }}
        >
          <GoldAccentLabel delay={4}>Built for the future</GoldAccentLabel>
          <RiseText delay={10} fontSize={54} align="center" maxWidth={980}>
            More than a marketplace.
            <br />
            An ecosystem.
          </RiseText>
          <div style={{ height: 40 }} />
          <div
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {partners.map((name, i) => {
              const anim = spring({
                frame: frame - 28 - i * 5,
                fps,
                config: { damping: 200 },
              });
              return (
                <div
                  key={name}
                  style={{
                    padding: "14px 22px",
                    borderRadius: 999,
                    border: `1px solid rgba(212,166,42,0.28)`,
                    background: "rgba(17,24,39,0.72)",
                    color: COLORS.textMuted,
                    fontSize: 15,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    fontFamily: "Satoshi, Manrope, system-ui, sans-serif",
                    opacity: anim,
                    transform: `translateY(${interpolate(anim, [0, 1], [12, 0])}px)`,
                  }}
                >
                  {name}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </FadeInOut>
    </AbsoluteFill>
  );
};

export const EndingScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <KenBurns
        src="assets/scene-cta.jpg"
        startScale={1.12}
        endScale={1.22}
        dim={0.35}
        overlay="radial-gradient(ellipse at center, rgba(212,166,42,0.22), rgba(7,11,20,0.95) 68%)"
      />
      <FadeInOut fadeIn={14} fadeOut={8}>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Img
            src={staticFile("assets/reeskova-icon.svg")}
            style={{
              width: 110,
              height: 110,
              marginBottom: 28,
              filter: "drop-shadow(0 0 28px rgba(212,166,42,0.45))",
            }}
          />
          <RiseText
            delay={8}
            fontSize={72}
            align="center"
            tracking="0.14em"
            maxWidth={1200}
          >
            REESKOVA
          </RiseText>
          <div style={{ height: 28 }} />
          <RiseText
            delay={22}
            fontSize={30}
            weight={500}
            color={COLORS.gold}
            align="center"
            tracking="0.06em"
            maxWidth={900}
          >
            One Marketplace. Endless Opportunities.
          </RiseText>
          <div style={{ height: 18 }} />
          <RiseText
            delay={36}
            fontSize={24}
            weight={500}
            color={COLORS.textMuted}
            align="center"
            tracking="0.04em"
            maxWidth={700}
          >
            Discover what&apos;s next.
          </RiseText>
        </AbsoluteFill>
      </FadeInOut>
    </AbsoluteFill>
  );
};
