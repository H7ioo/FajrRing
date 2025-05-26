import { env } from "@/env";
import { db } from "@/server/db";
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
      async sendOTP(data, request) {
        // TODO: Implement sending OTP code
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
