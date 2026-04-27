import { trackingDisplayConfigDtoSchema } from "./contracts";
import { mapTrackingDisplayConfigDto } from "./mappers";
import type { TrackingApi } from "./trackingApi";
// Provides mock tracking API responses for development.

export const trackingMockApi: TrackingApi = {
  async getDisplayConfig() {
    const parsed = trackingDisplayConfigDtoSchema.parse({
      azLabel: "Az",
      elLabel: "El",
    });
    return mapTrackingDisplayConfigDto(parsed);
  },
};
