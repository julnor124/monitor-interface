import type { CardState, PassCardDefinition, PassSnapshot } from "../passes/types";
import type { InactiveCardViewModel } from "../passes/api/mappers";
import type { SignalDisplayConfig } from "../signal/api/mappers";
import type { TrackingDisplayConfig } from "../tracking/api/mappers";

export type CommanderSortedCard = PassCardDefinition & {
  snapshot: PassSnapshot;
  state: CardState;
  priority: number;
  upcomingSortMs: number;
  activeSortMs: number;
};

export type CommanderData = {
  passCards: PassCardDefinition[];
  inactiveCards: InactiveCardViewModel[];
  signalConfig: SignalDisplayConfig;
  trackingConfig: TrackingDisplayConfig;
};
