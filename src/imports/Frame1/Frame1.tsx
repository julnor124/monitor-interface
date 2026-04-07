import { useEffect, useState } from "react";
import svgPaths from "./svg-oa4korc7ak";

function useUtcTick() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 250);
    setNow(new Date());
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

function formatHmUtc(date: Date) {
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
    date.getUTCMinutes()
  ).padStart(2, "0")}`;
}

const TOTAL_SCHEDULED_PASSES = 7;
const PASS_START_INTERVAL_MIN = 7;
const PASS_ACTIVE_DURATION_MIN = 21;

function formatRemainingMs(ms: number) {
  if (ms <= 0) return "0s";
  const totalSec = Math.ceil(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMin = mins % 60;
    return `${hours}h ${remMin}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
}

function useScheduledPass(passIndex: number, passName: string) {
  const now = useUtcTick();
  const intervalMs = PASS_START_INTERVAL_MIN * 60_000;
  const durationMs = PASS_ACTIVE_DURATION_MIN * 60_000;
  const slot = Math.floor(now.getTime() / intervalMs);
  const currentMod =
    ((slot % TOTAL_SCHEDULED_PASSES) + TOTAL_SCHEDULED_PASSES) %
    TOTAL_SCHEDULED_PASSES;
  const deltaSinceStart =
    (currentMod - passIndex + TOTAL_SCHEDULED_PASSES) % TOTAL_SCHEDULED_PASSES;
  const lastStartSlot = slot - deltaSinceStart;
  const startMs = lastStartSlot * intervalMs;
  const endMs = startMs + durationMs;
  const isActive = now.getTime() >= startMs && now.getTime() < endMs;

  const progressPercent = clamp(
    ((now.getTime() - startMs) / (endMs - startMs)) * 100,
    0,
    100
  );
  const remainingMs = Math.max(0, endMs - now.getTime());

  const nextStartMs = (lastStartSlot + TOTAL_SCHEDULED_PASSES) * intervalMs;
  const nextEndMs = nextStartMs + durationMs;
  const nextInMin = Math.max(1, Math.ceil((nextStartMs - now.getTime()) / 60_000));

  return isActive
    ? {
        isActive: true,
        range: `${formatHmUtc(new Date(startMs))}-${formatHmUtc(new Date(endMs))}`,
        primary: `${formatRemainingMs(remainingMs)} left`,
        secondary: `Pass: ${passName}`,
        progress: progressPercent,
      }
    : {
        isActive: false,
        range: `${formatHmUtc(new Date(nextStartMs))}-${formatHmUtc(new Date(nextEndMs))}`,
        primary: `${nextInMin}min`,
        secondary: `Pass: ${passName}`,
        progress: 0,
      };
}

type PassSnapshot = {
  isActive: boolean;
  range: string;
  primary: string;
  secondary: string;
  progress: number;
  startMs: number;
  endMs: number;
  nextStartMs: number;
};

function getScheduledPassSnapshot(nowMs: number, passIndex: number, passName: string): PassSnapshot {
  const intervalMs = PASS_START_INTERVAL_MIN * 60_000;
  const durationMs = PASS_ACTIVE_DURATION_MIN * 60_000;
  const slot = Math.floor(nowMs / intervalMs);
  const currentMod =
    ((slot % TOTAL_SCHEDULED_PASSES) + TOTAL_SCHEDULED_PASSES) %
    TOTAL_SCHEDULED_PASSES;
  const deltaSinceStart =
    (currentMod - passIndex + TOTAL_SCHEDULED_PASSES) % TOTAL_SCHEDULED_PASSES;
  const lastStartSlot = slot - deltaSinceStart;
  const startMs = lastStartSlot * intervalMs;
  const endMs = startMs + durationMs;
  const isActive = nowMs >= startMs && nowMs < endMs;
  const progressPercent = clamp(((nowMs - startMs) / (endMs - startMs)) * 100, 0, 100);
  const remainingMs = Math.max(0, endMs - nowMs);
  const nextStartMs = (lastStartSlot + TOTAL_SCHEDULED_PASSES) * intervalMs;
  const nextEndMs = nextStartMs + durationMs;
  const nextInMin = Math.max(1, Math.ceil((nextStartMs - nowMs) / 60_000));

  return isActive
    ? {
        isActive: true,
        range: `${formatHmUtc(new Date(startMs))}-${formatHmUtc(new Date(endMs))}`,
        primary: `${formatRemainingMs(remainingMs)} left`,
        secondary: `Pass: ${passName}`,
        progress: progressPercent,
        startMs,
        endMs,
        nextStartMs,
      }
    : {
        isActive: false,
        range: `${formatHmUtc(new Date(nextStartMs))}-${formatHmUtc(new Date(nextEndMs))}`,
        primary: `${nextInMin}min`,
        secondary: `Pass: ${passName}`,
        progress: 0,
        startMs: nextStartMs,
        endMs: nextEndMs,
        nextStartMs,
      };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function useTelemetry(seedAz: number, seedEl: number, seedBars: [number, number, number]) {
  const [az, setAz] = useState(seedAz);
  const [el, setEl] = useState(seedEl);
  const [bars, setBars] = useState<[number, number, number]>(seedBars);

  useEffect(() => {
    const timer = setInterval(() => {
      setAz((prev) => clamp(prev + (Math.random() - 0.5) * 0.08, 0, 360));
      setEl((prev) => clamp(prev + (Math.random() - 0.5) * 0.06, 0, 90));
      setBars((prev) => [
        clamp(prev[0] + (Math.random() - 0.5) * 10, 20, 95),
        clamp(prev[1] + (Math.random() - 0.5) * 10, 20, 95),
        clamp(prev[2] + (Math.random() - 0.5) * 10, 20, 95),
      ]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return { az, el, bars };
}

function Span() {
  const now = useUtcTick();
  const date = now.toISOString().slice(0, 10);
  return (
    <div className="absolute h-[23px] left-[1474px] top-[17px] w-[180px]" data-name="span">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[23.079px] left-0 not-italic text-[#90a1b9] text-[30px] top-[-0.5px] whitespace-nowrap">{date}</p>
    </div>
  );
}

function Clock() {
  return (
    <div className="absolute left-[1419px] size-[40px] top-[6px]" data-name="Clock">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Clock">
          <path d={svgPaths.p19a01780} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46484" />
          <path d="M20 10V20L26.6667 23.3333" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46484" />
        </g>
      </svg>
    </div>
  );
}

function Container({
  stationLabel,
  onStationClick,
  backLabel,
}: {
  stationLabel: string;
  onStationClick?: () => void;
  backLabel?: string;
}) {
  const now = useUtcTick();
  const utcTime = `${now.toISOString().slice(11, 19)} UTC`;
  return (
    <div className="absolute bg-[#0f172b] border-[rgba(49,65,88,0.6)] border-b border-solid h-[56px] left-0 top-0 w-[1920px]" data-name="Container">
      <Span />
      <Clock />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[39px] leading-[29.673px] left-[30px] not-italic text-[#90a1b9] text-[30px] top-[11px] tracking-[1.1869px] w-[312px]">
        {backLabel ?? "OASIS · NMC"}
      </p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36.267px] left-[1690px] not-italic text-[#90a1b9] text-[30px] top-[10px] whitespace-nowrap">{utcTime}</p>
      <button
        className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[29.673px] left-1/2 -translate-x-1/2 not-italic text-[#90a1b9] text-[40px] top-[8px] tracking-[2.3738px] whitespace-nowrap hover:text-[#c6d2e5]"
        onClick={onStationClick}
        type="button"
      >
        {stationLabel}
      </button>
    </div>
  );
}

function SignalStacks({ bars }: { bars: [number, number, number] }) {
  return (
    <div className="absolute inset-[66.16%_5.34%_18.63%_73.32%]">
      <div
        className="absolute bottom-0 left-0 w-[22%] rounded-[3px] bg-[#3abeff] transition-[height] duration-700 ease-in-out"
        style={{ height: `${bars[0]}%` }}
      />
      <div
        className="absolute bottom-0 left-[39%] w-[22%] rounded-[3px] bg-[#3abeff] transition-[height] duration-700 ease-in-out"
        style={{ height: `${bars[1]}%` }}
      />
      <div
        className="absolute bottom-0 left-[78%] w-[22%] rounded-[3px] bg-[#3abeff] transition-[height] duration-700 ease-in-out"
        style={{ height: `${bars[2]}%` }}
      />
    </div>
  );
}

function SignalLabels() {
  return (
    <div className="absolute inset-[83.65%_5.1%_8.37%_73.32%] flex items-center justify-between text-[20px] text-white">
      <span className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic">X</span>
      <span className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic">S</span>
      <span className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic">S</span>
    </div>
  );
}

function PassProgress({ progress, isActive }: { progress: number; isActive: boolean }) {
  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="absolute bg-[#444] border border-[#22384a] border-solid inset-[35.74%_5.34%_50.99%_6.5%] rounded-[4px]" />
      <div
        className="absolute bg-[#3abeff] inset-[35.74%_93.5%_50.95%_6.5%] rounded-[4px] transition-[right] duration-700 ease-linear"
        style={{ right: `${100 - progress}%` }}
      />
    </>
  );
}

function InterfaceOneStyleBar({
  progress,
  showIndicator = false,
}: {
  progress: number;
  showIndicator?: boolean;
}) {
  const clamped = clamp(progress, 0, 100);
  return (
    <div className="relative h-[44px] rounded-[4px] border border-[#22384a] bg-[#444]">
      <div
        className="absolute inset-[0_100%_0_0] rounded-[4px] bg-[#3abeff] transition-[right] duration-700 ease-linear"
        style={{ right: `${100 - clamped}%` }}
      />
      {showIndicator ? (
        <div
          className="absolute top-1/2 h-[26px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded bg-[#8ee0ff] shadow-[0_0_10px_2px_rgba(58,190,255,0.8)] transition-[left] duration-700 ease-linear"
          style={{ left: `${clamped}%` }}
        />
      ) : null}
    </div>
  );
}

type ScheduledAntennaCardProps = {
  wrapperClassName: string;
  cardName: string;
  passIndex: number;
  passName: string;
  seedAz: number;
  seedEl: number;
  seedBars: [number, number, number];
  activeNameInsetClass?: string;
  dataName?: string;
};

function ScheduledAntennaCard({
  wrapperClassName,
  cardName,
  passIndex,
  passName,
  seedAz,
  seedEl,
  seedBars,
  activeNameInsetClass = "inset-[5.32%_68.21%_77.95%_6.5%]",
  dataName = "PREPARE PASS",
}: ScheduledAntennaCardProps) {
  const pass = useScheduledPass(passIndex, passName);
  const { az, el, bars } = useTelemetry(seedAz, seedEl, seedBars);

  return (
    <div className={wrapperClassName} data-name={dataName}>
      <div
        className={`absolute border-l-10 border-solid inset-[0_0.7%_0_1.86%] rounded-[8px] ${
          pass.isActive ? "bg-[#0f172b] border-[#3abeff]" : "bg-[#0f172b] border-[#b8963e]"
        }`}
      />
      {pass.isActive ? (
        <>
          <PassProgress progress={pass.progress} isActive={pass.isActive} />
          <p className={`absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[#f2f2f2] text-[30px] ${activeNameInsetClass}`}>{cardName}</p>
          <div className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[62.74%_48.72%_0_0] leading-[0] not-italic text-[#f2f2f2] text-[30px] text-center">
            <p className="leading-[normal] mb-0">{`Az: ${az.toFixed(2)}°`}</p>
            <p>
              <span className="leading-[normal] text-[#c9c9c9]">El:</span>
              <span className="leading-[normal]">{` `}</span>
              <span className="leading-[normal] text-[#c9c9c9]">{el.toFixed(2)}°</span>
            </p>
          </div>
          <SignalStacks bars={bars} />
          <SignalLabels />
          <div className="absolute inset-[76.05%_55.68%_23.95%_6.26%]" data-name="Title Divider">
            <div className="absolute inset-[-0.5px_-0.3%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 165 1">
                <path d="M0.5 0.5H164.5" id="Title Divider" stroke="var(--stroke-0, #666666)" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[5.32%_0_81.37%_51.51%] leading-[normal] not-italic text-[#c9c9c9] text-[30px] text-center">{pass.primary}</p>
        </>
      ) : (
        <>
          <Hourglass />
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[6.5%] bottom-[10.2%] leading-[normal] not-italic text-[#f2f2f2] text-[32px]">{pass.secondary}</p>
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal right-[6.5%] top-[4.38%] leading-[normal] not-italic text-[#f2f2f2] text-[32px]">{pass.range}</p>
          <p className="absolute font-['Inter:Bold',sans-serif] font-bold left-[28.1%] top-[39.92%] leading-[normal] not-italic text-[#f2f2f2] text-[50px]">{pass.primary}</p>
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[6.5%] top-[3.44%] leading-[normal] not-italic text-[#f2f2f2] text-[32px]">{cardName}</p>
        </>
      )}
    </div>
  );
}

function SmallerAntennaCard() {
  return <ScheduledAntennaCard wrapperClassName="absolute h-[263px] left-[45px] top-[109px] w-[431px]" dataName="SMALLER ANTENNA CARD" cardName="Vilma" passIndex={0} passName="north_beam_h" seedAz={101.14} seedEl={7.17} seedBars={[58, 34, 46]} />;
}

function SmallerAntennaCard1() {
  return <ScheduledAntennaCard wrapperClassName="absolute h-[263px] left-[979px] top-[107px] w-[431px]" dataName="SMALLER ANTENNA CARD" cardName="Malin" passIndex={1} passName="eastern_lane_i" seedAz={100.22} seedEl={14.22} seedBars={[64, 28, 40]} />;
}

function SmallerAntennaCard2() {
  return <ScheduledAntennaCard wrapperClassName="absolute inset-[9.91%_2.97%_65.74%_75.16%]" dataName="SMALLER ANTENNA CARD" cardName="Amanda" passIndex={2} passName="western_track_j" seedAz={99.22} seedEl={4.22} seedBars={[42, 24, 38]} activeNameInsetClass="inset-[5.32%_61.72%_77.95%_6.5%]" />;
}

function Elements() {
  return (
    <div className="absolute inset-[8.33%_16.67%]" data-name="elements">
      <div className="absolute inset-[-4.56%_-4.69%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35.875">
          <g id="elements">
            <path d={svgPaths.p248e3f80} id="Vector" stroke="var(--stroke-0, #F2F2F2)" strokeWidth="3" />
            <path d={svgPaths.p31aabd20} id="Vector 6703" stroke="var(--stroke-0, #F2F2F2)" strokeLinecap="round" strokeWidth="3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Hourglass() {
  return (
    <div className="absolute inset-[43.44%_calc(73.57%+7.36px)_41.56%_calc(15%-8.5px)] overflow-clip" data-name="hourglass">
      <Elements />
    </div>
  );
}

function MasterHourglassIcon() {
  return (
    <div className="h-[42px] w-[34px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 43">
        <path d={svgPaths.p248e3f80} stroke="#F2F2F2" strokeWidth="3" />
        <path d={svgPaths.p31aabd20} stroke="#F2F2F2" strokeLinecap="round" strokeWidth="3" />
      </svg>
    </div>
  );
}

function PreparePass() {
  return <ScheduledAntennaCard wrapperClassName="absolute inset-[10.09%_51.09%_65.56%_27.03%]" cardName="Emma" passIndex={0} passName="south_track_a" seedAz={101.14} seedEl={7.17} seedBars={[58, 34, 46]} />;
}

function PreparePass1() {
  return <ScheduledAntennaCard wrapperClassName="absolute inset-[39.35%_2.97%_36.3%_75.16%]" cardName="Olivia" passIndex={1} passName="polar_arc_b" seedAz={100.22} seedEl={14.22} seedBars={[64, 28, 40]} />;
}

function PreparePass2() {
  return <ScheduledAntennaCard wrapperClassName="absolute inset-[68.61%_51.09%_7.04%_27.03%]" cardName="Elin" passIndex={2} passName="atlantic_link_c" seedAz={99.22} seedEl={4.22} seedBars={[42, 24, 38]} />;
}

function PreparePass3() {
  return (
    <div className="absolute bg-[#0f172b] border-[#5f7388] border-l-10 border-solid inset-[68.61%_2.97%_7.04%_75.16%] leading-[normal] not-italic opacity-50 overflow-clip rounded-[9px] text-[#f2f2f2]" data-name="PREPARE PASS">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold inset-[39.16%_calc(10.24%+1.02px)_39.16%_calc(10%-9px)] text-[40px]">DISCONNECTED</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[3.44%_calc(69.05%+6.9px)_82.81%_calc(5%-9.5px)] text-[32px]">Hugo</p>
    </div>
  );
}

function PreparePass4() {
  return (
    <div className="absolute bg-[#0f172b] border-[#5f7388] border-l-10 border-solid inset-[68.61%_26.82%_7.04%_51.3%] leading-[normal] not-italic opacity-50 overflow-clip rounded-[9px] text-[#f2f2f2]" data-name="PREPARE PASS">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold inset-[39.16%_calc(10.24%+1.02px)_39.16%_calc(10%-9px)] text-[40px]">DISCONNECTED</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[3.42%_calc(56.9%+5.69px)_82.89%_calc(5%-9.5px)] text-[32px]">Hanna</p>
    </div>
  );
}

function PreparePass5() {
  return <ScheduledAntennaCard wrapperClassName="absolute inset-[39.35%_26.56%_36.3%_50.99%]" cardName="Sina" passIndex={3} passName="zenith_window_d" seedAz={103.52} seedEl={11.42} seedBars={[48, 36, 52]} />;
}

function PreparePass6() {
  return <ScheduledAntennaCard wrapperClassName="absolute inset-[39.35%_51.09%_36.3%_27.03%]" cardName="Maja" passIndex={4} passName="elevation_run_e" seedAz={97.8} seedEl={8.45} seedBars={[35, 54, 46]} />;
}

function PreparePass7() {
  return <ScheduledAntennaCard wrapperClassName="absolute inset-[39.35%_75.47%_36.3%_2.66%]" cardName="Frida" passIndex={5} passName="horizon_pass_f" seedAz={111.34} seedEl={6.81} seedBars={[44, 62, 30]} />;
}

function PreparePass8() {
  return <ScheduledAntennaCard wrapperClassName="absolute inset-[68.61%_75.47%_7.04%_2.66%]" cardName="Vickan" passIndex={6} passName="orbital_cross_g" seedAz={108.67} seedEl={12.08} seedBars={[52, 40, 58]} />;
}

function MasterPassCard({
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
}: {
  name: string;
  passIndex: number;
  passName: string;
  seedAz: number;
  seedEl: number;
  seedBars: [number, number, number];
  modeLabel: "PROG" | "TRACK";
  forceInactive?: boolean;
  forceAlarm?: boolean;
  passSnapshot?: PassSnapshot;
  stateOverride?: "inactive" | "upcoming" | "active" | "alarm";
}) {
  const pass = passSnapshot ?? useScheduledPass(passIndex, passName);
  const { az, el, bars } = useTelemetry(seedAz, seedEl, seedBars);
  const cardState: "inactive" | "upcoming" | "active" | "alarm" =
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
          ? "bg-[#c6a548]"
          : "bg-[#4d5f71]";
  const endLabel = pass.range.split("-")[1] ?? pass.range;
  const upcomingLabel = pass.primary.replace(/\s*left$/, "");
  const isLongUpcomingLabel = upcomingLabel.length >= 8;

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

  // Active, alarm, and upcoming share one card structure.
  const isLive = cardState === "active" || cardState === "alarm";
  return (
    <div className="relative h-[320px] overflow-hidden rounded-[8px] border border-[#1d3d57] bg-[#1a324b]">
      <div className="grid h-full grid-rows-[72px_50px_1fr_62px] px-5 pt-5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p className="min-w-0 flex-1 truncate pr-2 text-[42px] leading-[1] text-[#f2f2f2]">{name}</p>
          {isLive ? (
            <p
              className={`shrink-0 max-w-[42%] truncate bg-[#54606c] px-4 py-1 text-[22px] leading-[1] text-[#dfe8f7] ${
                modeLabel === "TRACK" ? "rounded-[6px]" : "rounded-[999px]"
              }`}
            >
              {modeLabel}
            </p>
          ) : (
            <p className="max-w-[52%] truncate text-right text-[32px] leading-[1] text-[#dbe6f4]">{pass.range}</p>
          )}
        </div>

        <InterfaceOneStyleBar progress={isLive ? pass.progress : 0} showIndicator={isLive} />

        <div className="grid min-w-0 grid-cols-[max-content_96px_minmax(0,1fr)] items-end gap-4 py-3">
          <div className="w-fit rounded bg-[#2a4d7a] px-4 py-3 text-[24px] leading-[1.2] text-[#d5e5ff]">
            {isLive ? (
              <>
                <p>{el.toFixed(2)}</p>
                <p>{az.toFixed(2)}</p>
              </>
            ) : (
              <>
                <p>{el.toFixed(2)}</p>
                <p>{az.toFixed(2)}</p>
              </>
            )}
          </div>
          <div className="min-w-0">
            {isLive ? (
              <>
                <div className="flex h-[48px] items-end gap-2">
                  <div className="h-[48px] w-3 rounded bg-[#3abeff]" style={{ height: `${bars[0]}%` }} />
                  <div className="h-[48px] w-3 rounded bg-[#3abeff]" style={{ height: `${bars[1]}%` }} />
                  <div className="h-[48px] w-3 rounded bg-[#3abeff]" style={{ height: `${bars[2]}%` }} />
                </div>
                <p className="mt-1 text-[22px] leading-[1] text-[#eaf1fb]">X S S</p>
              </>
            ) : (
              <>
                <div className="h-[42px]" />
                <div className="mt-1 h-[16px]" />
              </>
            )}
          </div>
          <div className="min-w-0 self-start pt-1 text-right">
            {isLive ? (
              <>
                <p className="truncate text-[clamp(1.8rem,3.1vh,2.2rem)] leading-[1] text-[#f2f2f2]">{pass.primary}</p>
                <p className="mt-1 truncate text-[clamp(1.3rem,2.2vh,1.5rem)] italic leading-[1] text-[#d8e3f3]">Ends {endLabel}</p>
              </>
            ) : (
              <div className="mt-2 flex min-w-0 items-center justify-end gap-2">
                <MasterHourglassIcon />
                <p
                  className={`font-bold leading-[1] text-[#f2f2f2] ${
                    isLongUpcomingLabel
                      ? "text-[clamp(1.6rem,2.8vh,2.2rem)]"
                      : "text-[clamp(1.8rem,3.2vh,2.6rem)]"
                  }`}
                >
                  {upcomingLabel}
                </p>
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

function StationMasterPrototype({ onBack }: { onBack: () => void }) {
  const now = useUtcTick();
  const inactiveCards = [
    { name: "Julia", date: "26-04-30", time: "12:10" },
    { name: "Olivia", date: "26-05-1", time: "13:15" },
    { name: "Sina", date: "26-05-02", time: "05:00" },
    { name: "Vickan", date: "26-05-05", time: "07:30" },
    { name: "Hugo", date: "26-05-06", time: "11:10" },
  ];

  const cardDefinitions = [
    { name: "Vilma", passIndex: 0, passName: "north_arc_2148", modeLabel: "PROG" as const, seedAz: 102.75, seedEl: 4.22, seedBars: [42, 76, 29] as [number, number, number] },
    { name: "Emma", passIndex: 1, passName: "horizon_link_9032", modeLabel: "TRACK" as const, seedAz: 98.35, seedEl: 14.22, seedBars: [50, 35, 62] as [number, number, number] },
    { name: "Malin", passIndex: 2, passName: "polar_window_7711", modeLabel: "TRACK" as const, seedAz: 102.75, seedEl: 4.22, seedBars: [36, 70, 50] as [number, number, number] },
    { name: "Amanda", passIndex: 3, passName: "zenith_route_5226", modeLabel: "PROG" as const, seedAz: 99.35, seedEl: 45.55, seedBars: [58, 61, 47] as [number, number, number] },
    { name: "Frida", passIndex: 4, passName: "storm_alert_8841", modeLabel: "PROG" as const, seedAz: 100.15, seedEl: 2.22, seedBars: [42, 75, 28] as [number, number, number], forceAlarm: true },
    { name: "Maja", passIndex: 5, passName: "eastern_gate_6420", modeLabel: "TRACK" as const, seedAz: 102.75, seedEl: 4.22, seedBars: [49, 55, 31] as [number, number, number] },
    { name: "Elin", passIndex: 6, passName: "orbital_cross_1194", modeLabel: "TRACK" as const, seedAz: 95.33, seedEl: 11.23, seedBars: [32, 62, 28] as [number, number, number] },
    { name: "Hanna", passIndex: 0, passName: "southern_loop_3305", modeLabel: "TRACK" as const, seedAz: 102.75, seedEl: 4.22, seedBars: [30, 57, 35] as [number, number, number] },
  ];

  const sortedCards = cardDefinitions
    .map((card) => {
      const snapshot = getScheduledPassSnapshot(now.getTime(), card.passIndex, card.passName);
      const state: "inactive" | "upcoming" | "active" | "alarm" = card.forceAlarm
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
      <Container stationLabel="STATION MASTER THESIS" backLabel="OASIS · NMC" onStationClick={onBack} />
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

export default function Frame() {
  const [view, setView] = useState<"julia" | "master">("julia");

  if (view === "master") {
    return <StationMasterPrototype onBack={() => setView("julia")} />;
  }

  return (
    <div className="bg-[#020618] relative w-[1920px] h-[1080px]">
      <Container stationLabel="STATION JULIA" onStationClick={() => setView("master")} />
      <SmallerAntennaCard />
      <SmallerAntennaCard1 />
      <SmallerAntennaCard2 />
      <PreparePass />
      <PreparePass1 />
      <PreparePass2 />
      <PreparePass3 />
      <PreparePass4 />
      <PreparePass5 />
      <PreparePass6 />
      <PreparePass7 />
      <PreparePass8 />
    </div>
  );
}