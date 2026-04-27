import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MasterPassCard } from "./MasterPassCard";
// Validates behavior with targeted unit tests.

describe("MasterPassCard", () => {
  it("renders inactive state copy and mission strip", () => {
    render(
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

    expect(screen.getByText("Inactive standby")).toBeInTheDocument();
    expect(screen.getByText("No active pass")).toBeInTheDocument();
    expect(screen.getByText("Mission: north_arc_2148")).toBeInTheDocument();
  });
});
