import { preferencesSchema } from "@/lib/validations/preference";
import { preference } from "@/server/db/schema";
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
      console.log({ input });
      return await ctx.db
        .update(preference)
        .set({
          ...input,
          fajrOffsetMinutes: input.fajrOffsetMinutes[0],
          ...input.locationData,
          ...input.locationData?.timezone,
        })
        .where(eq(preference.userId, ctx.session.user.id));
    }),
});
