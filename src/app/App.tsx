import { CommanderScreen } from "../features/commander";
import { TvStage } from "./layout/TvStage";
import { AppProviders } from "./providers/AppProviders";
// Composes the main application screen structure.

export default function App() {
  return (
    <AppProviders>
      <TvStage>
        <CommanderScreen />
      </TvStage>
    </AppProviders>
  );
}
