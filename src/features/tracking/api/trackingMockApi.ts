import { trackingDisplayConfigDtoSchema } from "./contracts";
import { mapTrackingDisplayConfigDto } from "./mappers";
import type { TrackingApi } from "./trackingApi";

export const trackingMockApi: TrackingApi = {
  async getDisplayConfig() {
    const parsed = trackingDisplayConfigDtoSchema.parse({
      azLabel: "Az",
      elLabel: "El",
    });
    return mapTrackingDisplayConfigDto(parsed);
  },
};
