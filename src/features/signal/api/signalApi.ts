import type { SignalDisplayConfig } from "./mappers";
// Requests signal data from the API.

export interface SignalApi {
  getDisplayConfig(): Promise<SignalDisplayConfig>;
}
