import { useEffect, useState } from "react";
import { passesMockApi } from "../../passes/api/passesMockApi";
import type { PassCardDefinition } from "../../passes/types";
import type { InactiveCardViewModel } from "../../passes/api/mappers";

type CommanderDataState = {
  passCards: PassCardDefinition[];
  inactiveCards: InactiveCardViewModel[];
};

const INITIAL_STATE: CommanderDataState = {
  passCards: [],
  inactiveCards: [],
};

export function useCommanderData() {
  const [state, setState] = useState<CommanderDataState>(INITIAL_STATE);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      passesMockApi.getPassCardDefinitions(),
      passesMockApi.getInactiveCards(),
    ]).then(([passCards, inactiveCards]) => {
      if (!mounted) return;
      setState({ passCards, inactiveCards });
    });

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
