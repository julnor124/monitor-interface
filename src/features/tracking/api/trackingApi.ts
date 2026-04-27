import type { TrackingDisplayConfig } from "./mappers";
// Requests tracking data from the API.

export interface TrackingApi {
  getDisplayConfig(): Promise<TrackingDisplayConfig>;
}
