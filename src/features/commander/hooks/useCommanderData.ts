import { useEffect, useMemo, useState } from "react";
import { getRuntimeConfig } from "../../../shared/config/runtimeConfig";
import { passesHttpApi } from "../../passes/api/passesHttpApi";
import { passesMockApi } from "../../passes/api/passesMockApi";
import { signalHttpApi } from "../../signal/api/signalHttpApi";
import { signalMockApi } from "../../signal/api/signalMockApi";
import { trackingHttpApi } from "../../tracking/api/trackingHttpApi";
import { trackingMockApi } from "../../tracking/api/trackingMockApi";
import type { CommanderData, CommanderDataState } from "../types";
// Fetches and shapes data for commander views.

const INITIAL_STATE: CommanderData = {
  passCards: [],
  inactiveCards: [],
  signalConfig: { labels: ["X", "S", "S"] },
  trackingConfig: { azLabel: "Az", elLabel: "El" },
};

export function useCommanderData() {
  const [state, setState] = useState<CommanderDataState>({
    data: INITIAL_STATE,
    isLoading: true,
    errorMessage: null,
  });
  const { useMockApis } = getRuntimeConfig();
  const passesApi = useMemo(() => (useMockApis ? passesMockApi : passesHttpApi), [useMockApis]);
  const signalApi = useMemo(() => (useMockApis ? signalMockApi : signalHttpApi), [useMockApis]);
  const trackingApi = useMemo(
    () => (useMockApis ? trackingMockApi : trackingHttpApi),
    [useMockApis]
  );

  useEffect(() => {
    let mounted = true;

    Promise.all([
      passesApi.getPassCardDefinitions(),
      passesApi.getInactiveCards(),
      signalApi.getDisplayConfig(),
      trackingApi.getDisplayConfig(),
    ]).then(([passCards, inactiveCards, signalConfig, trackingConfig]) => {
      if (!mounted) return;
      setState({
        data: { passCards, inactiveCards, signalConfig, trackingConfig },
        isLoading: false,
        errorMessage: null,
      });
    }).catch((error) => {
      if (!mounted) return;
      setState((prev) => ({
        data: prev.data,
        isLoading: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Unable to load commander data.",
      }));
    });

    return () => {
      mounted = false;
    };
  }, [passesApi, signalApi, trackingApi]);

  return state;
}
