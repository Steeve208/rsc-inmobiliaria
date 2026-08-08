import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Wordmark, GoldLine } from "../components/Brand";
import { FadeInOut, KenBurns, RiseText } from "../components/Motion";
import { COLORS } from "../lib/theme";

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = spring({
    frame: frame - 6,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <KenBurns
        src="assets/scene-cta.jpg"
        startScale={1.1}
        endScale={1.2}
        dim={0.45}
        overlay="radial-gradient(ellipse at center, rgba(212,166,42,0.18), rgba(7,11,20,0.92) 70%)"
      />
      <FadeInOut fadeIn={12} fadeOut={12}>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(212,166,42,${0.22 * glow}), transparent 70%)`,
              filter: "blur(8px)",
            }}
          />
          <Wordmark
            showTagline
            scale={interpolate(
              spring({ frame: frame - 4, fps, config: { damping: 200 } }),
              [0, 1],
              [0.92, 1],
            )}
            opacity={interpolate(frame, [0, 16], [0, 1], {
              extrapolateRight: "clamp",
            })}
          />
          <div style={{ height: 28 }} />
          <GoldLine
            width={interpolate(frame, [20, 40], [0, 120], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            opacity={interpolate(frame, [20, 36], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
          <div style={{ height: 28 }} />
          <RiseText
            delay={28}
            fontSize={34}
            weight={500}
            color={COLORS.textMuted}
            align="center"
            maxWidth={860}
            tracking="0"
          >
            A modern digital marketplace that connects people,
            businesses, and opportunities.
          </RiseText>
        </AbsoluteFill>
      </FadeInOut>
    </AbsoluteFill>
  );
};
