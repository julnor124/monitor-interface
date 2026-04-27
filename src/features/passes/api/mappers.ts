import type { PassCardDefinition } from "../types";
import type { InactiveCardDto, PassCardDefinitionDto } from "./contracts";

export type InactiveCardViewModel = {
  name: string;
  date: string;
  time: string;
};

export function mapPassCardDefinitionDto(dto: PassCardDefinitionDto): PassCardDefinition {
  return {
    name: dto.name,
    passIndex: dto.passIndex,
    passName: dto.passName,
    modeLabel: dto.modeLabel,
    seedAz: dto.seedAz,
    seedEl: dto.seedEl,
    seedBars: dto.seedBars,
    forceAlarm: dto.forceAlarm,
  };
}

export function mapInactiveCardDto(dto: InactiveCardDto): InactiveCardViewModel {
  return {
    name: dto.name,
    date: dto.date,
    time: dto.time,
  };
}
