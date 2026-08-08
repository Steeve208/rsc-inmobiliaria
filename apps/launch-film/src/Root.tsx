import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { loadFont } from "@remotion/google-fonts/Manrope";
import { LaunchFilm } from "./LaunchFilm";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./lib/theme";

const { waitUntilDone } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const waitHandle = delayRender("Loading Manrope");
waitUntilDone().then(() => continueRender(waitHandle));

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LaunchFilm"
      component={LaunchFilm}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
    />
  );
};
