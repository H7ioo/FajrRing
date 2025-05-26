import { env } from "@/env";
import { Twilio } from "twilio";
import { tryCatch } from "./utils";

// ! I would like to use another provider but all sucks, even twilio but it is the only one that works for my use case
// Maybe plivo if they allow me to sign in at the first place ._.
const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export async function sendSMS({ to, body }: { to: string; body: string }) {
  return await tryCatch(
    client.messages.create({
      from: env.TWILIO_PHONE_NUMBER,
      to,
      body,
    }),
  );
}

// ! Better-Auth handles everything about OTP no need to use twilio verify
export async function sendOTP({
  phoneNumber,
  code,
}: {
  phoneNumber: string;
  code: string;
}) {
  return await sendSMS({ to: phoneNumber, body: `Your OTP is ${code}` });
}
