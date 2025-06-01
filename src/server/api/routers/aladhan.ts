import {
  AladhanApiResponseSchema,
  AladhanTimingsInputSchema,
  type AladhanApiResponse,
} from "@/lib/aladhan";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import axios from "axios";

// TODO: use try catch
export const aladhanRouter = createTRPCRouter({
  getPrayerTimingsByDate: protectedProcedure
    .input(AladhanTimingsInputSchema)
    .query(async ({ input }) => {
      const { dateString, latitude, longitude, ...optionalParams } = input;

      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });

      if (optionalParams.method !== undefined) {
        queryParams.append("method", optionalParams.method.toString());
      }
      if (optionalParams.school !== undefined) {
        queryParams.append("school", optionalParams.school);
      }
      if (optionalParams.midnightMode !== undefined) {
        queryParams.append("midnightMode", optionalParams.midnightMode);
      }
      if (optionalParams.latitudeAdjustmentMethod !== undefined) {
        queryParams.append(
          "latitudeAdjustmentMethod",
          optionalParams.latitudeAdjustmentMethod,
        );
      }
      if (optionalParams.tune !== undefined) {
        queryParams.append("tune", optionalParams.tune);
      }
      if (optionalParams.timezonestring !== undefined) {
        queryParams.append("timezonestring", optionalParams.timezonestring);
      }
      // Add other optional params like 'shafaq' if method 15 is used

      const url = `https://api.aladhan.com/v1/timings/${dateString}?${queryParams.toString()}`;

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

        return parsedData.data.data; // Return the nested 'data' object which contains timings, date, meta
      } catch (error) {
        console.error("Error in getPrayerTimingsByDate:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching prayer times.",
          cause: error,
        });
      }
    }),
});
