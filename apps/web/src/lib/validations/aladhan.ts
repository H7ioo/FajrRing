import { z } from "zod";

// ===================
// 1. CONSTANTS & ENUMS
// ===================

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
  { value: "15", label: "Moonsighting Committee Worldwide" },
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
  // { value: "99", label: "Custom" },
] as const;

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
  // "99"
]);

// ===================
// 2. BASE/REUSABLE SCHEMAS
// ===================

const BaseOptionalParamsSchema = z.object({
  method: PrayerCalculationMethodEnum.optional(),
  shafaq: z.enum(["general", "ahmer", "abyad"]).optional(),
  tune: z.string().optional(),
  school: z.enum(["0", "1"]).optional(),
  midnightMode: z.enum(["0", "1"]).optional(),
  timezonestring: z.string().optional(),
  latitudeAdjustmentMethod: z.enum(["1", "2", "3"]).optional(),
  calendarMethod: z
    .enum(["HJCoSA", "UAQ", "DIYANET", "MATHEMATICAL"])
    .optional(),
  iso8601: z.boolean().optional(),
  adjustment: z.number().optional(),
});

const BaseDateSchema = z.object({
  dateString: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format"),
});

const CoordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const CitySchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  x7xapikey: z.string().optional(),
});

const AddressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  x7xapikey: z.string().optional(),
});

// ===================
// 3. INPUT SCHEMAS
// ===================

export const AladhanTimingsInputSchema = BaseDateSchema.merge(
  CoordinatesSchema,
).merge(
  BaseOptionalParamsSchema.omit({
    calendarMethod: true,
    iso8601: true,
    adjustment: true,
  }),
);

export const AladhanTimingsByAddressInputSchema = BaseDateSchema.merge(
  AddressSchema,
).merge(BaseOptionalParamsSchema);

export const AladhanTimingsByCityInputSchema = BaseDateSchema.merge(
  CitySchema,
).merge(BaseOptionalParamsSchema);

export const AladhanNextPrayerInputSchema = BaseDateSchema.merge(
  CoordinatesSchema,
).merge(BaseOptionalParamsSchema);

export const AladhanNextPrayerByAddressInputSchema = BaseDateSchema.merge(
  AddressSchema,
).merge(BaseOptionalParamsSchema);

// ===================
// 4. API RESPONSE SCHEMAS
// ===================

const AladhanTimingsObjectSchema = z.object({
  Fajr: z.string(),
  Sunrise: z.string(),
  Dhuhr: z.string(),
  Asr: z.string(),
  Sunset: z.string(),
  Maghrib: z.string(),
  Isha: z.string(),
  Imsak: z.string(),
  Midnight: z.string(),
  Firstthird: z.string().optional(),
  Lastthird: z.string().optional(),
});

const AladhanDateSchema = z.object({
  readable: z.string(),
  timestamp: z.string(),
  gregorian: z.object({
    date: z.string(),
    format: z.string(),
    day: z.string(),
    weekday: z.object({ en: z.string() }),
    month: z.object({ number: z.number(), en: z.string() }),
    year: z.string(),
  }),
  hijri: z.object({
    date: z.string(),
    // ... other hijri details if needed
  }),
});

const AladhanMetaSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  method: z.object({
    id: z.number(),
    name: z.string(),
    params: z.object({
      Fajr: z.union([z.number(), z.string()]),
      Isha: z.union([z.number(), z.string()]),
    }),
    location: z
      .object({ latitude: z.number(), longitude: z.number() })
      .optional(),
  }),
  latitudeAdjustmentMethod: z.string().optional(),
  midnightMode: z.string().optional(),
  school: z.string().optional(),
  offset: z.record(z.number()).optional(),
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

export const PrayerTimingsDataSchema = AladhanApiResponseSchema.shape.data;

const AladhanNextPrayerTimingsSchema = z.record(z.string());

export const AladhanNextPrayerResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  data: z.object({
    timings: AladhanNextPrayerTimingsSchema,
    date: AladhanDateSchema,
    meta: AladhanMetaSchema,
  }),
});

// ===================
// 5. TYPES
// ===================

export type PrayerTimingsData = z.infer<typeof PrayerTimingsDataSchema>;
export type AladhanApiResponse = z.infer<typeof AladhanApiResponseSchema>;
export type AladhanTimingsObject = z.infer<typeof AladhanTimingsObjectSchema>;
export type AladhanTimingsInput = z.infer<typeof AladhanTimingsInputSchema>;
export type AladhanTimingsByAddressInput = z.infer<
  typeof AladhanTimingsByAddressInputSchema
>;
export type AladhanTimingsByCityInput = z.infer<
  typeof AladhanTimingsByCityInputSchema
>;
export type AladhanNextPrayerInput = z.infer<
  typeof AladhanNextPrayerInputSchema
>;
export type AladhanNextPrayerByAddressInput = z.infer<
  typeof AladhanNextPrayerByAddressInputSchema
>;
export type AladhanNextPrayerResponse = z.infer<
  typeof AladhanNextPrayerResponseSchema
>;
export type PrayerCalculationMethodType = z.infer<
  typeof PrayerCalculationMethodEnum
>;
