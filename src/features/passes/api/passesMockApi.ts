import type { PassesApi } from "./passesApi";
import {
  inactiveCardDtoListSchema,
  passCardDefinitionDtoListSchema,
  type InactiveCardDto,
  type PassCardDefinitionDto,
} from "./contracts";
import { mapInactiveCardDto, mapPassCardDefinitionDto } from "./mappers";

const passCardDefinitionDtos: PassCardDefinitionDto[] = [
  { name: "Vilma", passIndex: 0, passName: "north_arc_2148", modeLabel: "PROG", seedAz: 102.75, seedEl: 4.22, seedBars: [42, 76, 29] },
  { name: "Emma", passIndex: 1, passName: "horizon_link_9032", modeLabel: "TRACK", seedAz: 98.35, seedEl: 14.22, seedBars: [50, 35, 62] },
  { name: "Malin", passIndex: 2, passName: "polar_window_7711", modeLabel: "TRACK", seedAz: 102.75, seedEl: 4.22, seedBars: [36, 70, 50] },
  { name: "Amanda", passIndex: 3, passName: "zenith_route_5226", modeLabel: "PROG", seedAz: 99.35, seedEl: 45.55, seedBars: [58, 61, 47] },
  { name: "Frida", passIndex: 4, passName: "storm_alert_8841", modeLabel: "PROG", seedAz: 100.15, seedEl: 2.22, seedBars: [42, 75, 28], forceAlarm: true },
  { name: "Maja", passIndex: 5, passName: "eastern_gate_6420", modeLabel: "TRACK", seedAz: 102.75, seedEl: 4.22, seedBars: [49, 55, 31] },
  { name: "Elin", passIndex: 6, passName: "orbital_cross_1194", modeLabel: "TRACK", seedAz: 95.33, seedEl: 11.23, seedBars: [32, 62, 28] },
  { name: "Hanna", passIndex: 0, passName: "southern_loop_3305", modeLabel: "TRACK", seedAz: 102.75, seedEl: 4.22, seedBars: [30, 57, 35] },
];

const inactiveCardDtos: InactiveCardDto[] = [
  { name: "Julia", date: "26-04-30", time: "12:10" },
  { name: "Olivia", date: "26-05-1", time: "13:15" },
  { name: "Sina", date: "26-05-02", time: "05:00" },
  { name: "Vickan", date: "26-05-05", time: "07:30" },
  { name: "Hugo", date: "26-05-06", time: "11:10" },
];

export const passesMockApi: PassesApi = {
  async getPassCardDefinitions() {
    const parsed = passCardDefinitionDtoListSchema.parse(passCardDefinitionDtos);
    return parsed.map(mapPassCardDefinitionDto);
  },
  async getInactiveCards() {
    const parsed = inactiveCardDtoListSchema.parse(inactiveCardDtos);
    return parsed.map(mapInactiveCardDto);
  },
};
