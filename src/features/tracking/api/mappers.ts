import type { TrackingDisplayConfigDto } from "./contracts";

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
