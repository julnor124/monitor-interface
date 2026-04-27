import { fetchJson } from "../../../shared/api/httpClient";
import { getRuntimeConfig } from "../../../shared/config/runtimeConfig";
import { signalDisplayConfigDtoSchema } from "./contracts";
import { mapSignalDisplayConfigDto } from "./mappers";
import type { SignalApi } from "./signalApi";

// Implements the signal API adapter against HTTP backend endpoints.
export const signalHttpApi: SignalApi = {
  async getDisplayConfig() {
    const { apiBaseUrl } = getRuntimeConfig();
    const dto = await fetchJson(
      `${apiBaseUrl}/signal/config`,
      signalDisplayConfigDtoSchema
    );
    return mapSignalDisplayConfigDto(dto);
  },
};
