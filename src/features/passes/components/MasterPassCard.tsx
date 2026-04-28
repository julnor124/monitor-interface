import { SignalBars } from "../../signal/components/SignalBars";
import { AzElReadout } from "../../tracking/components/AzElReadout";
import { useTelemetry } from "../../tracking/hooks/useTelemetry";
import { useUtcTick } from "../../ui/hooks/useUtcTick";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { formatRemainingMs, useScheduledPass } from "../hooks/useScheduledPass";
import type { CardState, ModeLabel, PassSnapshot } from "../types";
import { MasterHourglassIcon } from "./MasterHourglassIcon";
import { PassProgressBar } from "./PassProgressBar";
// Renders the primary card for pass details.

const ALARM_COUNTDOWN_WINDOW_MS = 21 * 60 * 1000;

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function MasterPassCard({
  name,
  passIndex,
  passName,
  seedAz,
  seedEl,
  seedBars,
  modeLabel,
  forceInactive = false,
  forceAlarm = false,
  passSnapshot,
  stateOverride,
  signalLabels,
  azLabel,
  elLabel,
}: {
  name: string;
  passIndex: number;
  passName: string;
  seedAz: number;
  seedEl: number;
  seedBars: [number, number, number];
  modeLabel: ModeLabel;
  forceInactive?: boolean;
  forceAlarm?: boolean;
  passSnapshot?: PassSnapshot;
  stateOverride?: CardState;
  signalLabels?: [string, string, string];
  azLabel?: string;
  elLabel?: string;
}) {
  const now = useUtcTick();
  const scheduledPass = useScheduledPass(passIndex, passName);
  const pass = passSnapshot ?? scheduledPass;
  const { az, el, bars } = useTelemetry(seedAz, seedEl, seedBars);
  const cardState: CardState =
    stateOverride ??
    (forceInactive
      ? "inactive"
      : forceAlarm
        ? "alarm"
        : pass.isActive
          ? "active"
          : "upcoming");
  const stripClass =
    cardState === "alarm"
      ? "bg-[#c86b6b]"
      : cardState === "active"
        ? "bg-[#3566a8]"
        : cardState === "upcoming"
          ? "bg-[#c3b167]"
          : "bg-[#4d5f71]";
  const upcomingLabel = pass.primary.replace(/\s*left$/, "");
  const liveCountdownLabel =
    cardState === "alarm" && !pass.isActive
      ? `${formatRemainingMs(Math.max(0, pass.startMs - now.getTime()))} left`
      : pass.primary;
  const liveProgress =
    cardState === "alarm" && !pass.isActive
      ? clampPercent(
          ((ALARM_COUNTDOWN_WINDOW_MS - Math.max(0, pass.startMs - now.getTime())) /
            ALARM_COUNTDOWN_WINDOW_MS) *
            100
        )
      : pass.progress;

  if (cardState === "inactive") {
    return (
      <div className="relative h-[320px] overflow-hidden rounded-[8px] border border-[#1d3d57] bg-[#172737] opacity-70">
        <div className="grid h-full grid-rows-[84px_1fr_70px] px-5 pt-4">
          <div>
            <p className="truncate text-[46px] leading-[1] text-[#d8e3ef]">{name}</p>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <p className="text-[24px] leading-[1.1] text-[#c3cfdd]">Inactive standby</p>
            <p className="text-[18px] leading-[1.1] text-[#9eb1c5]">No active pass</p>
          </div>
          <div className={`-mx-5 flex min-w-0 h-full w-[calc(100%+2.5rem)] items-center rounded-b-[8px] text-[30px] leading-[1] text-[#d8e3ef] ${stripClass}`}>
            <p className="block w-full overflow-hidden text-ellipsis whitespace-nowrap px-5">{pass.secondary}</p>
          </div>
        </div>
      </div>
    );
  }

  // Alarm cards should keep live layout while timing still drives normal passes.
  const isLive = pass.isActive || cardState === "alarm";
  return (
    <div className="relative h-[320px] overflow-hidden rounded-[8px] border border-[#1d3d57] bg-[#1a324b]">
      <div className="grid h-full grid-rows-[72px_50px_1fr_62px] px-5 pt-5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p className="min-w-0 flex-1 truncate pr-2 text-[42px] leading-[1] text-[#f2f2f2]">{name}</p>
          {isLive ? (
            <p className="max-w-[52%] truncate text-right text-[32px] leading-[1] text-[#f2f2f2]">{liveCountdownLabel}</p>
          ) : (
            <p className="max-w-[52%] truncate text-right text-[32px] leading-[1] text-[#dbe6f4]">{pass.range}</p>
          )}
        </div>

        <PassProgressBar progress={isLive ? liveProgress : 0} showIndicator={isLive} />

        <div className="grid min-w-0 grid-cols-[max-content_132px_minmax(0,1fr)] items-end gap-4 py-3">
          <AzElReadout az={az} el={el} azLabel={azLabel} elLabel={elLabel} />
          <SignalBars bars={bars} isLive={isLive} labels={signalLabels} />
          <div className="min-w-0 self-start pt-1 text-right">
            {isLive ? (
              <div className="flex justify-end">
                <StatusBadge label={modeLabel} />
              </div>
            ) : (
              <div className="mt-2 flex min-w-0 items-center justify-end gap-1">
                <div className="shrink-0">
                  <MasterHourglassIcon />
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`whitespace-nowrap font-bold leading-[1] text-[#f2f2f2] ${
                      upcomingLabel.length >= 8
                        ? "text-[clamp(1.6rem,2.8vh,2.2rem)]"
                        : "text-[clamp(1.8rem,3.2vh,2.6rem)]"
                    }`}
                  >
                    {upcomingLabel}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`-mx-5 flex min-w-0 h-full w-[calc(100%+2.5rem)] items-center rounded-b-[8px] text-[30px] leading-[1] text-[#f2f2f2] ${stripClass}`}>
          <p className="block w-full overflow-hidden text-ellipsis whitespace-nowrap px-5">{cardState === "alarm" ? "Alarm" : pass.secondary}</p>
        </div>
      </div>
    </div>
  );
}
