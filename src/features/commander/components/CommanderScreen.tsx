import { MasterPassCard } from "../../passes/components/MasterPassCard";
import { getScheduledPassSnapshot } from "../../passes/hooks/useScheduledPass";
import type { CardState } from "../../passes/types";
import { TopBar } from "../../ui/components/TopBar";
import { useUtcTick } from "../../ui/hooks/useUtcTick";
import { useCommanderData } from "../hooks/useCommanderData";
import type { CommanderSortedCard } from "../types";
// Displays the commander feature main screen.

function deriveCardState(forceAlarm: boolean | undefined, isActive: boolean): CardState {
  if (forceAlarm) return "alarm";
  return isActive ? "active" : "upcoming";
}

export function CommanderScreen() {
  const now = useUtcTick();
  const nowMs = now.getTime();
  const { data, isLoading, errorMessage } = useCommanderData();
  const { passCards, inactiveCards, signalConfig, trackingConfig } = data;

  const sortedCards: CommanderSortedCard[] = passCards
    .map((card) => {
      const snapshot = getScheduledPassSnapshot(nowMs, card.passIndex, card.passName);
      const state = deriveCardState(card.forceAlarm, snapshot.isActive);
      // Keep active and alarm cards left-most, then upcoming by nearest start time.
      const priority = state === "active" || state === "alarm" ? 0 : 1;
      const upcomingSortMs = snapshot.nextStartMs - nowMs;
      // For alarm cards that are not yet active, sort by time-to-start so
      // placement matches the visible countdown label.
      const activeSortMs =
        state === "alarm" && !snapshot.isActive
          ? Math.max(0, snapshot.startMs - nowMs)
          : snapshot.endMs - nowMs;
      return { ...card, snapshot, state, priority, upcomingSortMs, activeSortMs };
    })
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.state === "active" || a.state === "alarm") {
        return a.activeSortMs - b.activeSortMs;
      }
      return a.upcomingSortMs - b.upcomingSortMs;
    });

  return (
    <div className="bg-[#0a2237] relative w-[1920px] h-[1080px]">
      <TopBar stationLabel="STATION MASTER THESIS" />
      {errorMessage ? (
        <div className="absolute left-[22px] right-[22px] top-[120px] rounded-[8px] border border-[#7d2d2d] bg-[#2b1616] px-8 py-6 text-[#f3c6c6]">
          <p className="text-[34px] font-bold leading-[1]">Data unavailable</p>
          <p className="mt-3 text-[22px] leading-[1.2] text-[#e3b4b4]">
            Unable to load backend data. Check connection or API status and try again.
          </p>
          <p className="mt-2 text-[18px] leading-[1.2] text-[#d7a2a2]">
            {`Details: ${errorMessage}`}
          </p>
        </div>
      ) : null}
      {isLoading && !errorMessage ? (
        <div className="absolute left-[22px] right-[22px] top-[120px] rounded-[8px] border border-[#27476a] bg-[#11263d] px-8 py-5 text-[#c7d9ef]">
          <p className="text-[26px] leading-[1]">Loading data...</p>
        </div>
      ) : null}
      <div className="absolute left-[22px] right-[22px] top-[78px] grid grid-cols-4 grid-rows-2 gap-x-8 gap-y-20">
        {sortedCards.map((card) => (
          <MasterPassCard
            key={card.name}
            name={card.name}
            passIndex={card.passIndex}
            passName={card.passName}
            modeLabel={card.modeLabel}
            seedAz={card.seedAz}
            seedEl={card.seedEl}
            seedBars={card.seedBars}
            forceAlarm={card.forceAlarm}
            passSnapshot={card.snapshot}
            stateOverride={card.state}
            signalLabels={signalConfig.labels}
            azLabel={trackingConfig.azLabel}
            elLabel={trackingConfig.elLabel}
          />
        ))}
      </div>
      <div className="absolute left-[22px] right-[22px] top-[865px] border-t border-[#6e879d] pt-2" />
      <div className="absolute left-[22px] right-[22px] top-[882px] grid grid-cols-5 gap-5">
        {inactiveCards.map((item) => (
          <div key={item.name} className="h-[132px] rounded-[8px] bg-[#aab4bf] px-4 py-3 text-[26px] italic leading-[1.2] text-[#16222e]">
            <p className="truncate">{`${item.name} inactive until:`}</p>
            <p className="truncate">{`• Date: ${item.date}`}</p>
            <p className="truncate">{`• Time: ${item.time}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
