import { describe, expect, it } from "vitest";
import { getScheduledPassSnapshot } from "./useScheduledPass";

describe("getScheduledPassSnapshot", () => {
  it("returns stable upcoming state values", () => {
    const nowMs = 0;
    const snapshot = getScheduledPassSnapshot(nowMs, 1, "test_mission");

    expect(snapshot.isActive).toBe(false);
    expect(snapshot.range).toMatch(/^\d{2}:\d{2}-\d{2}:\d{2}$/);
    expect(snapshot.primary).toMatch(/min$/);
    expect(snapshot.secondary).toBe("Mission: test_mission");
    expect(snapshot.progress).toBe(0);
  });

  it("returns active state for the scheduled slot", () => {
    const nowMs = 7 * 60_000 + 5 * 60_000; // pass index 1 active
    const snapshot = getScheduledPassSnapshot(nowMs, 1, "active_case");

    expect(snapshot.isActive).toBe(true);
    expect(snapshot.range).toBe("00:07-00:28");
    expect(snapshot.primary).toMatch(/left$/);
    expect(snapshot.secondary).toBe("Mission: active_case");
    expect(snapshot.progress).toBeGreaterThan(0);
  });
});
