import type { TrackingDisplayConfigDto } from "./contracts";
// Maps API data into app-friendly models.

export type TrackingDisplayConfig = {
  azLabel: string;
  elLabel: string;
};

export function mapTrackingDisplayConfigDto(
  dto: TrackingDisplayConfigDto
): TrackingDisplayConfig {
  return {
    azLabel: dto.azLabel,
    elLabel: dto.elLabel,
  };
}
