import { z } from "zod";

// --- Prayer Calculation Methods (as you provided) ---
export const prayerCalculationMethods = [
  // { value: "0", label: "Jafari / Shia Ithna-Ashari" },
  { value: "1", label: "University of Islamic Sciences, Karachi" },
  { value: "2", label: "Islamic Society of North America (ISNA)" },
  { value: "3", label: "Muslim World League (MWL)" },
  { value: "4", label: "Umm Al-Qura University, Makkah" },
  { value: "5", label: "Egyptian General Authority of Survey" },
  { value: "7", label: "Institute of Geophysics, University of Tehran" },
  { value: "8", label: "Gulf Region" },
  { value: "9", label: "Kuwait" },
  { value: "10", label: "Qatar" },
  { value: "11", label: "Majlis Ugama Islam Singapura, Singapore" },
  { value: "12", label: "Union Organization islamic de France" },
  { value: "13", label: "Diyanet İşleri Başkanlığı, Turkey" },
  { value: "14", label: "Spiritual Administration of Muslims of Russia" },
  { value: "15", label: "Moonsighting Committee Worldwide" }, // Simplified label
  { value: "16", label: "Dubai (experimental)" },
  { value: "17", label: "Jabatan Kemajuan Islam Malaysia (JAKIM)" },
  { value: "18", label: "Tunisia" },
  { value: "19", label: "Algeria" },
  { value: "20", label: "KEMENAG - Kementerian Agama Republik Indonesia" },
  { value: "21", label: "Morocco" },
  { value: "22", label: "Comunidade Islamica de Lisboa" },
  {
    value: "23",
    label: "Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan",
  },
  // { value: "99", label: "Custom" }, // We'll handle custom via 'tune' if needed, or specific params for method 99
] as const;

// Zod Enum for prayer calculation method IDs
export const PrayerCalculationMethodEnum = z.enum([
  // "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  /* "99" */
]);
export type PrayerCalculationMethodType = z.infer<
  typeof PrayerCalculationMethodEnum
>;

// --- Zod Schema for tRPC Input ---
export const AladhanTimingsInputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  dateString: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format"), // For path
  method: PrayerCalculationMethodEnum.optional(), // Optional, API defaults based on location
  school: z.enum(["0", "1"]).optional(), // 0 for Shafi, 1 for Hanafi
  midnightMode: z.enum(["0", "1"]).optional(), // 0 for Standard, 1 for Jafari
  latitudeAdjustmentMethod: z.enum(["1", "2", "3"]).optional(), // 1: MidNight, 2: OneSeventh, 3: AngleBased
  tune: z.string().optional(), // e.g., "0,0,0,0,0,0,0,0,0"
  timezonestring: z.string().optional(), // IANA timezone string e.g. "Europe/London"
});
export type AladhanTimingsInput = z.infer<typeof AladhanTimingsInputSchema>;

// --- Zod Schema for relevant parts of Aladhan API Response ---
const AladhanTimingsObjectSchema = z.object({
  Fajr: z.string(), // "HH:MM"
  Sunrise: z.string(),
  Dhuhr: z.string(),
  Asr: z.string(),
  Sunset: z.string(),
  Maghrib: z.string(),
  Isha: z.string(),
  Imsak: z.string(),
  Midnight: z.string(),
  Firstthird: z.string().optional(), // These might not always be present
  Lastthird: z.string().optional(),
});
export type AladhanTimingsObject = z.infer<typeof AladhanTimingsObjectSchema>;

const AladhanDateSchema = z.object({
  readable: z.string(), // e.g., "01 Jan 2025"
  timestamp: z.string(), // Unix timestamp string
  gregorian: z.object({
    date: z.string(), // "DD-MM-YYYY"
    format: z.string(),
    day: z.string(),
    weekday: z.object({ en: z.string() }),
    month: z.object({ number: z.number(), en: z.string() }),
    year: z.string(),
    // ... other gregorian details if needed
  }),
  hijri: z.object({
    date: z.string(), // "DD-MM-YYYY"
    // ... other hijri details if needed
  }),
});

const AladhanMetaSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(), // IANA timezone name
  method: z.object({
    id: z.number(), // Note: API returns number, our enum uses string. We might need to reconcile.
    name: z.string(),
    params: z.object({
      Fajr: z.union([z.number(), z.string()]),
      Isha: z.union([z.number(), z.string()]),
    }), // Fajr/Isha can be angle or "null minutes"
    location: z
      .object({ latitude: z.number(), longitude: z.number() })
      .optional(), // For some methods
  }),
  latitudeAdjustmentMethod: z.string().optional(),
  midnightMode: z.string().optional(),
  school: z.string().optional(),
  offset: z.record(z.number()).optional(), // e.g., { "Imsak": 0, "Fajr": 0, ... }
});

export const AladhanApiResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  data: z.object({
    timings: AladhanTimingsObjectSchema,
    date: AladhanDateSchema,
    meta: AladhanMetaSchema,
  }),
});
export type AladhanApiResponse = z.infer<typeof AladhanApiResponseSchema>;

// Type for the data we'll likely return from our tRPC procedure (subset of AladhanApiResponse.data)
export const PrayerTimingsDataSchema = AladhanApiResponseSchema.shape.data;
export type PrayerTimingsData = z.infer<typeof PrayerTimingsDataSchema>;
