import { signalDisplayConfigDtoSchema } from "./contracts";
import { mapSignalDisplayConfigDto } from "./mappers";
import type { SignalApi } from "./signalApi";

export const signalMockApi: SignalApi = {
  async getDisplayConfig() {
    const parsed = signalDisplayConfigDtoSchema.parse({
      labels: ["X", "S", "S"],
    });
    return mapSignalDisplayConfigDto(parsed);
  },
};
