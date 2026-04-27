import { z } from "zod";

export const signalDisplayConfigDtoSchema = z.object({
  labels: z.tuple([z.string(), z.string(), z.string()]),
});

export type SignalDisplayConfigDto = z.infer<typeof signalDisplayConfigDtoSchema>;
