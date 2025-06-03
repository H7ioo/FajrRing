import { preferencesSchema } from "@/lib/validations/preference";
import { preference } from "@fajr-ring/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
      return await ctx.db
        .insert(preference)
        .values({
          userId: ctx.session.user.id,
          ...set,
        })
        .onConflictDoUpdate({ target: preference.userId, set });
    }),
});
