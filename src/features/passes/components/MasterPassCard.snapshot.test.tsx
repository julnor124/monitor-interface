import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MasterPassCard } from "./MasterPassCard";

describe("MasterPassCard snapshots", () => {
  it("matches inactive visual structure", () => {
    const { asFragment } = render(
      <MasterPassCard
        name="Vilma"
        passIndex={0}
        passName="north_arc_2148"
        modeLabel="PROG"
        seedAz={100}
        seedEl={10}
        seedBars={[40, 50, 60]}
        stateOverride="inactive"
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("matches upcoming visual structure", () => {
    const { asFragment } = render(
      <MasterPassCard
        name="Emma"
        passIndex={1}
        passName="horizon_link_9032"
        modeLabel="TRACK"
        seedAz={98.35}
        seedEl={14.22}
        seedBars={[50, 35, 62]}
        passSnapshot={{
          isActive: false,
          range: "00:49-01:10",
          primary: "12min",
          secondary: "Mission: horizon_link_9032",
          progress: 0,
          startMs: 0,
          endMs: 0,
          nextStartMs: 0,
        }}
        stateOverride="upcoming"
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
