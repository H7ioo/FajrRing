import { getDelayUntilTime } from "@/lib/timezone";
import { tryCatch } from "@/lib/utils";
import { preferencesSchema } from "@/lib/validations/preference";
import { preference } from "@fajr-ring/db/schema";
import { removeCallSchedule, scheduleCall } from "@fajr-ring/queue/jobs";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { TRPCErrorWithAction } from "../error";
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
        // if user doesn't have phone number, disable calls
        callsEnabled: ctx.session.user.phoneNumber ? input.callsEnabled : false,
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
          message: "Failed to save preferences. Please try again...",
        });
      }

      if (input.callsEnabled) {
        if (!ctx.session.user.phoneNumber) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Phone number is not set. Please set your phone number in settings",
            cause: new TRPCErrorWithAction("Phone number is not set", {
              toast: {
                action: {
                  type: "redirect",
                  url: "/dashboard/settings",
                  label: "Go to settings",
                },
              },
            }),
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

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get prayer timings",
            cause: new TRPCErrorWithAction("Failed to get prayer timings", {
              toast: {
                action: {
                  type: "retry",
                  retryFn: "scheduleCall",
                },
              },
            }),
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

        if (queueError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to schedule call. Please try again...",
            cause: new TRPCErrorWithAction("Failed to schedule call", {
              toast: {
                action: {
                  type: "retry",
                  retryFn: "scheduleCall",
                },
              },
            }),
          });
        }
      } else {
        const { error } = await tryCatch(
          removeCallSchedule(ctx.session.user.id),
        );
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to remove call schedule. Please try again...",
            cause: new TRPCErrorWithAction("Failed to remove call schedule", {
              toast: {
                action: {
                  type: "retry",
                  retryFn: "removeCallSchedule",
                },
              },
            }),
          });
        }
      }

      return {
        success: true,
      };
    }),
});
