import { fetchJson } from "../../../shared/api/httpClient";
import { getRuntimeConfig } from "../../../shared/config/runtimeConfig";
import { trackingDisplayConfigDtoSchema } from "./contracts";
import { mapTrackingDisplayConfigDto } from "./mappers";
import type { TrackingApi } from "./trackingApi";

// Implements the tracking API adapter against HTTP backend endpoints.
export const trackingHttpApi: TrackingApi = {
  async getDisplayConfig() {
    const { apiBaseUrl } = getRuntimeConfig();
    const dto = await fetchJson(
      `${apiBaseUrl}/tracking/config`,
      trackingDisplayConfigDtoSchema
    );
    return mapTrackingDisplayConfigDto(dto);
  },
};
