import { z } from "zod";

export const trackingDisplayConfigDtoSchema = z.object({
  azLabel: z.string().min(1),
  elLabel: z.string().min(1),
});

export type TrackingDisplayConfigDto = z.infer<typeof trackingDisplayConfigDtoSchema>;
