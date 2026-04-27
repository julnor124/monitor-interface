import { describe, expect, it } from "vitest";
import { passCardDefinitionDtoSchema } from "./contracts";
import { mapPassCardDefinitionDto } from "./mappers";

describe("passes dto contracts and mappers", () => {
  it("validates and maps pass card dto", () => {
    const dto = passCardDefinitionDtoSchema.parse({
      name: "Vilma",
      passIndex: 0,
      passName: "north_arc_2148",
      modeLabel: "PROG",
      seedAz: 102.75,
      seedEl: 4.22,
      seedBars: [42, 76, 29],
    });

    const viewModel = mapPassCardDefinitionDto(dto);

    expect(viewModel.name).toBe("Vilma");
    expect(viewModel.modeLabel).toBe("PROG");
    expect(viewModel.seedBars).toEqual([42, 76, 29]);
  });
});
