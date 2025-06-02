import {
  AladhanApiResponseSchema,
  AladhanNextPrayerByAddressInputSchema,
  AladhanNextPrayerInputSchema,
  AladhanNextPrayerResponseSchema,
  AladhanTimingsByAddressInputSchema,
  AladhanTimingsByCityInputSchema,
  AladhanTimingsInputSchema,
  type AladhanApiResponse,
  type AladhanNextPrayerResponse,
} from "@/lib/aladhan";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import axios from "axios";

// Helper function to build query parameters dynamically
const buildQueryParams = (params: Record<string, unknown>): URLSearchParams => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      queryParams.append(key, value.toString());
    }
  });

  return queryParams;
};

// Helper function to handle regular prayer times API calls
const makePrayerTimesApiCall = async (url: string) => {
  try {
    const response = await axios.get<AladhanApiResponse>(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      const errorBody =
        response.data.data ||
        response.data.status ||
        "Failed to fetch prayer timings";

      console.error(
        `Aladhan API Error (${response.status}): ${JSON.stringify(errorBody)}`,
        { url },
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch prayer timings from Aladhan API: ${response.statusText} (${JSON.stringify(errorBody)})`,
      });
    }

    const parsedData = AladhanApiResponseSchema.safeParse(response.data);

    if (!parsedData.success) {
      console.error(
        "Failed to parse Aladhan API response:",
        parsedData.error.flatten(),
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid data structure received from Aladhan API.",
        cause: parsedData.error,
      });
    }

    if (parsedData.data.code !== 200 || parsedData.data.status !== "OK") {
      console.error("Aladhan API returned non-OK status:", parsedData.data);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Aladhan API reported an error: ${JSON.stringify(parsedData.data.data || parsedData.data.status)}`,
      });
    }

    return parsedData.data.data;
  } catch (error) {
    console.error("Error in prayer times API call:", error);
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while fetching prayer times.",
      cause: error,
    });
  }
};

// Helper function to handle next prayer API calls
const makeNextPrayerApiCall = async (url: string) => {
  try {
    const response = await axios.get<AladhanNextPrayerResponse>(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      const errorBody =
        response.data.data ||
        response.data.status ||
        "Failed to fetch next prayer time";

      console.error(
        `Aladhan API Error (${response.status}): ${JSON.stringify(errorBody)}`,
        { url },
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch next prayer time from Aladhan API: ${response.statusText} (${JSON.stringify(errorBody)})`,
      });
    }

    const parsedData = AladhanNextPrayerResponseSchema.safeParse(response.data);

    if (!parsedData.success) {
      console.error(
        "Failed to parse Aladhan next prayer API response:",
        parsedData.error.flatten(),
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid data structure received from Aladhan API.",
        cause: parsedData.error,
      });
    }

    if (parsedData.data.code !== 200 || parsedData.data.status !== "OK") {
      console.error("Aladhan API returned non-OK status:", parsedData.data);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Aladhan API reported an error: ${JSON.stringify(parsedData.data.data || parsedData.data.status)}`,
      });
    }

    return parsedData.data.data;
  } catch (error) {
    console.error("Error in next prayer API call:", error);
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while fetching next prayer time.",
      cause: error,
    });
  }
};

export const aladhanRouter = createTRPCRouter({
  // Get prayer times by coordinates and date
  getPrayerTimingsByDate: protectedProcedure
    .input(AladhanTimingsInputSchema)
    .query(async ({ input }) => {
      const { dateString, latitude, longitude, ...optionalParams } = input;

      const queryParams = buildQueryParams({
        latitude,
        longitude,
        ...optionalParams,
      });

      const url = `https://api.aladhan.com/v1/timings/${dateString}?${queryParams.toString()}`;
      return makePrayerTimesApiCall(url);
    }),

  // Get prayer times by address and date
  getPrayerTimingsByAddress: protectedProcedure
    .input(AladhanTimingsByAddressInputSchema)
    .query(async ({ input }) => {
      const { dateString, address, ...optionalParams } = input;

      const queryParams = buildQueryParams({
        address,
        ...optionalParams,
      });

      const url = `https://api.aladhan.com/v1/timingsByAddress/${dateString}?${queryParams.toString()}`;
      return makePrayerTimesApiCall(url);
    }),

  // Get prayer times by city and date
  getPrayerTimingsByCity: protectedProcedure
    .input(AladhanTimingsByCityInputSchema)
    .query(async ({ input }) => {
      const { dateString, city, country, ...optionalParams } = input;

      const queryParams = buildQueryParams({
        city,
        country,
        ...optionalParams,
      });

      const url = `https://api.aladhan.com/v1/timingsByCity/${dateString}?${queryParams.toString()}`;
      return makePrayerTimesApiCall(url);
    }),

  // Get next prayer time by coordinates and date
  getNextPrayer: protectedProcedure
    .input(AladhanNextPrayerInputSchema)
    .query(async ({ input }) => {
      const { dateString, latitude, longitude, ...optionalParams } = input;

      const queryParams = buildQueryParams({
        latitude,
        longitude,
        ...optionalParams,
      });

      const url = `https://api.aladhan.com/v1/nextPrayer/${dateString}?${queryParams.toString()}`;
      return makeNextPrayerApiCall(url);
    }),

  // Get next prayer time by address and date
  getNextPrayerByAddress: protectedProcedure
    .input(AladhanNextPrayerByAddressInputSchema)
    .query(async ({ input }) => {
      const { dateString, address, ...optionalParams } = input;

      const queryParams = buildQueryParams({
        address,
        ...optionalParams,
      });

      const url = `https://api.aladhan.com/v1/nextPrayerByAddress/${dateString}?${queryParams.toString()}`;
      return makeNextPrayerApiCall(url);
    }),
});
