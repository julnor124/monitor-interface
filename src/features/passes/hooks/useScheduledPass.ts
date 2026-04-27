import { useMemo } from "react";
import { useUtcTick } from "../../ui/hooks/useUtcTick";
import type { PassSnapshot } from "../types";
// Computes and exposes scheduled pass state.

const TOTAL_SCHEDULED_PASSES = 7;
const PASS_START_INTERVAL_MIN = 7;
const PASS_ACTIVE_DURATION_MIN = 21;

function formatHmUtc(date: Date) {
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
    date.getUTCMinutes()
  ).padStart(2, "0")}`;
}

export function formatRemainingMs(ms: number) {
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getScheduledPassSnapshot(
  nowMs: number,
  passIndex: number,
  passName: string
): PassSnapshot {
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
        secondary: `Mission: ${passName}`,
        progress: progressPercent,
        startMs,
        endMs,
        nextStartMs,
      }
    : {
        isActive: false,
        range: `${formatHmUtc(new Date(nextStartMs))}-${formatHmUtc(new Date(nextEndMs))}`,
        primary: `${nextInMin}min`,
        secondary: `Mission: ${passName}`,
        progress: 0,
        startMs: nextStartMs,
        endMs: nextEndMs,
        nextStartMs,
      };
}

export function useScheduledPass(passIndex: number, passName: string): PassSnapshot {
  const now = useUtcTick();
  return useMemo(
    () => getScheduledPassSnapshot(now.getTime(), passIndex, passName),
    [now, passIndex, passName]
  );
}
