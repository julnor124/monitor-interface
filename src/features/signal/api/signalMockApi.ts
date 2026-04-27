import { signalDisplayConfigDtoSchema } from "./contracts";
import { mapSignalDisplayConfigDto } from "./mappers";
import type { SignalApi } from "./signalApi";
// Provides mock signal API responses for development.

export const signalMockApi: SignalApi = {
  async getDisplayConfig() {
    const parsed = signalDisplayConfigDtoSchema.parse({
      labels: ["X", "S", "S"],
    });
    return mapSignalDisplayConfigDto(parsed);
  },
};
