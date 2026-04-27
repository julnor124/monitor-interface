import { z } from "zod";
// Defines typed contracts for API payloads.

export const modeLabelDtoSchema = z.enum(["PROG", "TRACK"]);

export const passCardDefinitionDtoSchema = z.object({
  name: z.string().min(1),
  passIndex: z.number().int().nonnegative(),
  passName: z.string().min(1),
  modeLabel: modeLabelDtoSchema,
  seedAz: z.number(),
  seedEl: z.number(),
  seedBars: z.tuple([z.number(), z.number(), z.number()]),
  forceAlarm: z.boolean().optional(),
});

export const inactiveCardDtoSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
});

export const passCardDefinitionDtoListSchema = z.array(passCardDefinitionDtoSchema);
export const inactiveCardDtoListSchema = z.array(inactiveCardDtoSchema);

export type PassCardDefinitionDto = z.infer<typeof passCardDefinitionDtoSchema>;
export type InactiveCardDto = z.infer<typeof inactiveCardDtoSchema>;
