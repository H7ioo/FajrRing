import { z } from "zod";
import { PrayerCalculationMethodEnum } from "./aladhan";

export const preferencesSchema = z.object({
  location: z.string().min(1, "Location is required"),
  locationData: z
    .object({
      placeId: z.string(),
      displayName: z.string(),
      formattedAddress: z.string(),
      city: z.string(),
      country: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      timezone: z.object({
        timezoneId: z.string(),
        timezoneName: z.string(),
        rawOffset: z.number(),
        dstOffset: z.number(),
      }),
    })
    .optional(),
  calculationMethodId: PrayerCalculationMethodEnum.optional(),
  fajrOffsetMinutes: z.array(z.number()).length(1),
  callsEnabled: z.boolean().default(true).optional(),
  // customFajrAngle: z.string().optional(),
  // customIshaAngle: z.string().optional(),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;
