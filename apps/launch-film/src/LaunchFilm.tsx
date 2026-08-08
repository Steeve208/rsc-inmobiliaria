import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import { COLORS, SCENES, toFrames } from "./lib/theme";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { RealEstateScene } from "./scenes/RealEstateScene";
import { VehiclesScene } from "./scenes/VehiclesScene";
import { FinancingScene } from "./scenes/FinancingScene";
import { BusinessesScene } from "./scenes/BusinessesScene";
import {
  DiscoverScene,
  EcosystemScene,
  EndingScene,
} from "./scenes/ClosingScenes";

const scene = (key: keyof typeof SCENES) => ({
  from: toFrames(SCENES[key].from),
  durationInFrames: toFrames(SCENES[key].duration),
});

export const LaunchFilm: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("audio/narration.mp3")} />

      <Sequence {...scene("problem")}>
        <ProblemScene />
      </Sequence>
      <Sequence {...scene("solution")}>
        <SolutionScene />
      </Sequence>
      <Sequence {...scene("realEstate")}>
        <RealEstateScene />
      </Sequence>
      <Sequence {...scene("vehicles")}>
        <VehiclesScene />
      </Sequence>
      <Sequence {...scene("financing")}>
        <FinancingScene />
      </Sequence>
      <Sequence {...scene("businesses")}>
        <BusinessesScene />
      </Sequence>
      <Sequence {...scene("discover")}>
        <DiscoverScene />
      </Sequence>
      <Sequence {...scene("ecosystem")}>
        <EcosystemScene />
      </Sequence>
      <Sequence {...scene("ending")}>
        <EndingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
