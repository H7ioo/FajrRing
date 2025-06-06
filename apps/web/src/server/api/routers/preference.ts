import { getDelayUntilTime } from "@/lib/timezone";
import { tryCatch } from "@/lib/utils";
import { preferencesSchema } from "@/lib/validations/preference";
import { preference } from "@fajr-ring/db/schema";
import { removeCallSchedule, scheduleCall } from "@fajr-ring/queue/jobs";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getPrayerTimingsByDate } from "./aladhan";

export const preferenceRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.preference.findFirst({
      where: eq(preference.userId, ctx.session.user.id),
    });
  }),
  save: protectedProcedure
    .input(preferencesSchema)
    .mutation(async ({ ctx, input }) => {
      const set = {
        ...input,
        fajrOffsetMinutes: input.fajrOffsetMinutes[0],
        ...input.locationData,
        ...input.locationData?.timezone,
      };

      // 1. if DB fails omit the process
      // 2. if queue fails save the preference and show error to client with retry button
      // ! Can't use tryCatch with drizzle
      try {
        await ctx.db
          .insert(preference)
          .values({
            ...set,
            userId: ctx.session.user.id,
          })
          .onConflictDoUpdate({
            set: {
              ...set,
              userId: ctx.session.user.id,
            },
            target: [preference.userId],
          });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save preferences",
        });
      }

      if (input.callsEnabled) {
        // TODO: add "take action"
        if (!ctx.session.user.phoneNumber) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Phone number is not set",
          });
        }

        const { data: prayerTimings, error } = await tryCatch(
          getPrayerTimingsByDate({
            input: {
              dateString: new Date()
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "-"),
              latitude: input.locationData?.latitude ?? 0,
              longitude: input.locationData?.longitude ?? 0,
              method: input.calculationMethodId,
              timezonestring: input.locationData?.timezone.timezoneId,
            },
          }),
        );

        // TODO: add "take action"
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get prayer timings",
          });
        }

        const callDelay = getDelayUntilTime(
          prayerTimings.timings.Fajr,
          input.fajrOffsetMinutes[0]!,
        );

        const { error: queueError } = await tryCatch(
          scheduleCall({
            userId: ctx.session.user.id,
            phoneNumber: ctx.session.user.phoneNumber,
            delayMs: callDelay,
          }),
        );

        // TODO: Add a UI button to check the queue and retry - "take action"
        if (queueError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to schedule call. Please try again...",
          });
        }
      } else {
        const { error } = await tryCatch(
          removeCallSchedule(ctx.session.user.id),
        );
        // TODO: add "take action"
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to remove call schedule. Please try again...",
          });
        }
      }

      return {
        success: true,
      };
    }),
});
