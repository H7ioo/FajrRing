import { env } from "@/env";
import { sendOTP } from "@/lib/sms";
import { db } from "@fajr-ring/db";
import { preference } from "@fajr-ring/db/schema";
import { betterAuth as betterAuthClient } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins/phone-number";
import { headers } from "next/headers";
import { cache } from "react";

export const betterAuth = betterAuthClient({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Create a preference for the user
          await db.insert(preference).values({
            userId: user.id,
          });
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.BETTER_AUTH_GOOGLE_ID,
      clientSecret: env.BETTER_AUTH_GOOGLE_SECRET,
      mapProfileToUser(profile) {
        return {
          displayUsername: profile.name,
        };
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14, // 14 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  plugins: [
    phoneNumber({
      async sendOTP({ phoneNumber, code }, request) {
        await sendOTP({ phoneNumber, code });
      },

      async sendForgetPasswordOTP({ phoneNumber, code }, request) {
        await sendOTP({ phoneNumber, code });
      },

      // To allow sign up with phone  number
      signUpOnVerification: {
        getTempEmail(phoneNumber) {
          return `${phoneNumber}@my-site.com`; // TODO: Change the site name
        },
      },
    }),
    nextCookies(),
  ], // make sure nextCookies is the last plugin in the array
});

export const { handler } = betterAuth;

export const auth = cache(async () => {
  const session = await betterAuth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export type Session = typeof betterAuth.$Infer.Session;

export default betterAuth;
