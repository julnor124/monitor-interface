import type { SignalDisplayConfigDto } from "./contracts";

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
