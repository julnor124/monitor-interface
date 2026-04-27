import { useEffect, useState } from "react";
import { passesMockApi } from "../../passes/api/passesMockApi";
import { signalMockApi } from "../../signal/api/signalMockApi";
import { trackingMockApi } from "../../tracking/api/trackingMockApi";
import type { CommanderData } from "../types";

const INITIAL_STATE: CommanderData = {
  passCards: [],
  inactiveCards: [],
  signalConfig: { labels: ["X", "S", "S"] },
  trackingConfig: { azLabel: "Az", elLabel: "El" },
};

export function useCommanderData() {
  const [state, setState] = useState<CommanderData>(INITIAL_STATE);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      passesMockApi.getPassCardDefinitions(),
      passesMockApi.getInactiveCards(),
      signalMockApi.getDisplayConfig(),
      trackingMockApi.getDisplayConfig(),
    ]).then(([passCards, inactiveCards, signalConfig, trackingConfig]) => {
      if (!mounted) return;
      setState({ passCards, inactiveCards, signalConfig, trackingConfig });
    });

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
