import { z } from "zod";

// TODO:
export const twilioStatusBodySchema = z.object({}).passthrough();

export const twilioStatusQuerySchema = z.object({
  jobId: z.string().min(1),
  userId: z.string().min(1),
  initiatedTimeUtc: z.string().datetime(),
  scheduledTimeUtc: z.string().datetime(),
  attemptNumber: z.coerce.number().int().positive(),
});

export type TwilioStatusBody = z.infer<typeof twilioStatusBodySchema>;
export type TwilioStatusQuery = z.infer<typeof twilioStatusQuerySchema>;
