import {
  inferAdditionalFields,
  phoneNumberClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  plugins: [
    phoneNumberClient(),
    // ! Not working correctly
    // inferAdditionalFields<typeof auth>(),
    inferAdditionalFields({
      user: {},
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
