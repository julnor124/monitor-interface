import type { PassCardDefinition } from "../types";
import type { InactiveCardViewModel } from "./mappers";
// Requests scheduled pass data from the API.

export interface PassesApi {
  getPassCardDefinitions(): Promise<PassCardDefinition[]>;
  getInactiveCards(): Promise<InactiveCardViewModel[]>;
}
