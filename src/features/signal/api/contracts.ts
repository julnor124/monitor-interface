import { z } from "zod";
// Defines typed contracts for API payloads.

export const signalDisplayConfigDtoSchema = z.object({
  labels: z.tuple([z.string(), z.string(), z.string()]),
});

export type SignalDisplayConfigDto = z.infer<typeof signalDisplayConfigDtoSchema>;
