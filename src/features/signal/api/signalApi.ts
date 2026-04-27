import type { SignalDisplayConfig } from "./mappers";

export interface SignalApi {
  getDisplayConfig(): Promise<SignalDisplayConfig>;
}
