import { TwilioStatusQuery } from "#lib/validation/schema";
import { env } from "../env";

// The package is in CommonJS so I have to do it this way
import twilioPkg from "twilio";
const Twilio = twilioPkg.Twilio;

export const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
export const validateRequest = twilioPkg.validateRequest;
export const VoiceResponse = twilioPkg.twiml.VoiceResponse;

// TODO: Create a quiz game inside of the call. @see https://www.twilio.com/docs/voice/tutorials/how-to-gather-user-input-via-keypad/node

export async function createCall({
  phoneNumber,
  statusCallbackUrl,
}: {
  phoneNumber: string;
  statusCallbackUrl: string;
}) {
  const call = await client.calls.create({
    from: env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
    // url: "http://demo.twilio.com/docs/voice.xml",
    url: `${env.TWILIO_WEBHOOK_BASE_URL}/twilio/voice`,
    method: "POST",
    statusCallback: statusCallbackUrl,
    statusCallbackMethod: "POST",
    statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
  });

  return call;
}

export function buildTwilioStatusCallbackUrl(
  baseUrl: string,
  params: TwilioStatusQuery
) {
  const url = new URL(baseUrl);
  url.searchParams.set("jobId", params.jobId);
  url.searchParams.set("userId", params.userId);
  url.searchParams.set("initiatedTimeUtc", params.initiatedTimeUtc);
  url.searchParams.set("scheduledTimeUtc", params.scheduledTimeUtc);
  url.searchParams.set("attemptsMade", params.attemptsMade.toString());
  return url.toString();
}
