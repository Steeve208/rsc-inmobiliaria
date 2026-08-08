export const COLORS = {
  bg: "#070B14",
  bgSecondary: "#0E1422",
  card: "#111827",
  cardHover: "#161F31",
  border: "rgba(255, 255, 255, 0.08)",
  text: "#FFFFFF",
  textMuted: "#AEB7C5",
  gold: "#D4A62A",
  goldHover: "#E0B848",
  goldSoft: "rgba(212, 166, 42, 0.2)",
  blue: "#2B6EFF",
  green: "#22c55e",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Narration ~73.5s + cinematic end hold */
export const DURATION_IN_FRAMES = 82 * FPS;

export const SCENES = {
  problem: { from: 0, duration: 14 },
  solution: { from: 14, duration: 10 },
  realEstate: { from: 24, duration: 10 },
  vehicles: { from: 34, duration: 8 },
  financing: { from: 42, duration: 8 },
  businesses: { from: 50, duration: 8 },
  discover: { from: 58, duration: 10 },
  ecosystem: { from: 68, duration: 6 },
  ending: { from: 74, duration: 8 },
} as const;

export const toFrames = (seconds: number) => Math.round(seconds * FPS);
