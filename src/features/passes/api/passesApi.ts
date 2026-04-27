import type { PassCardDefinition } from "../types";
import type { InactiveCardViewModel } from "./mappers";

export interface PassesApi {
  getPassCardDefinitions(): Promise<PassCardDefinition[]>;
  getInactiveCards(): Promise<InactiveCardViewModel[]>;
}
