import { useUtcTick } from "../../ui/hooks/useUtcTick";
import { TopBar } from "../../ui/components/TopBar";
import type { CardState } from "../../passes/types";
import { getScheduledPassSnapshot } from "../../passes/hooks/useScheduledPass";
import { MasterPassCard } from "../../passes/components/MasterPassCard";
import { useCommanderData } from "../hooks/useCommanderData";

export function CommanderScreen() {
  const now = useUtcTick();
  const { passCards, inactiveCards } = useCommanderData();

  const sortedCards = passCards
    .map((card) => {
      const snapshot = getScheduledPassSnapshot(now.getTime(), card.passIndex, card.passName);
      const state: CardState = card.forceAlarm
        ? "alarm"
        : snapshot.isActive
          ? "active"
          : "upcoming";
      const priority = state === "active" || state === "alarm" ? 0 : state === "upcoming" ? 1 : 2;
      const upcomingSortMs = snapshot.nextStartMs - now.getTime();
      const activeSortMs = snapshot.endMs - now.getTime();
      return { ...card, snapshot, state, priority, upcomingSortMs, activeSortMs };
    })
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.priority === 0) return a.activeSortMs - b.activeSortMs;
      if (a.priority === 1) return a.upcomingSortMs - b.upcomingSortMs;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="bg-[#0a2237] relative w-[1920px] h-[1080px]">
      <TopBar stationLabel="STATION MASTER THESIS" />
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
