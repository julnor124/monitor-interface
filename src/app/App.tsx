import { CommanderScreen } from "../features/commander";
import { TvStage } from "./layout/TvStage";
import { AppProviders } from "./providers/AppProviders";

export default function App() {
  return (
    <AppProviders>
      <TvStage>
        <CommanderScreen />
      </TvStage>
    </AppProviders>
  );
}
