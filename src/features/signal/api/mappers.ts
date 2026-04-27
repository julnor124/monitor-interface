import type { SignalDisplayConfigDto } from "./contracts";
// Maps API data into app-friendly models.

export type SignalDisplayConfig = {
  labels: [string, string, string];
};

export function mapSignalDisplayConfigDto(
  dto: SignalDisplayConfigDto
): SignalDisplayConfig {
  return {
    labels: dto.labels,
  };
}
