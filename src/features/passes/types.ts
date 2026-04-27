// Declares shared TypeScript types for this feature.
export type ModeLabel = "PROG" | "TRACK";

export type CardState = "inactive" | "upcoming" | "active" | "alarm";

export type PassSnapshot = {
  isActive: boolean;
  range: string;
  primary: string;
  secondary: string;
  progress: number;
  startMs: number;
  endMs: number;
  nextStartMs: number;
};

export type PassCardDefinition = {
  name: string;
  passIndex: number;
  passName: string;
  modeLabel: ModeLabel;
  seedAz: number;
  seedEl: number;
  seedBars: [number, number, number];
  forceAlarm?: boolean;
};
