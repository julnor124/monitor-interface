import type { TrackingDisplayConfig } from "./mappers";

export interface TrackingApi {
  getDisplayConfig(): Promise<TrackingDisplayConfig>;
}
