import { getRuntimeConfig } from "../../../shared/config/runtimeConfig";
import type { PassesApi } from "./passesApi";
import {
  inactiveCardDtoListSchema,
  passCardDefinitionDtoListSchema,
} from "./contracts";
import { mapInactiveCardDto, mapPassCardDefinitionDto } from "./mappers";
import { fetchJson } from "../../../shared/api/httpClient";

// Implements the passes API adapter against HTTP backend endpoints.
export const passesHttpApi: PassesApi = {
  async getPassCardDefinitions() {
    const { apiBaseUrl } = getRuntimeConfig();
    const dtos = await fetchJson(
      `${apiBaseUrl}/passes/cards`,
      passCardDefinitionDtoListSchema
    );
    return dtos.map(mapPassCardDefinitionDto);
  },
  async getInactiveCards() {
    const { apiBaseUrl } = getRuntimeConfig();
    const dtos = await fetchJson(
      `${apiBaseUrl}/passes/inactive`,
      inactiveCardDtoListSchema
    );
    return dtos.map(mapInactiveCardDto);
  },
};
