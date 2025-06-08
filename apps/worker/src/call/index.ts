import { TwilioStatusQuery } from "#validation/schema";
import { env } from "../env";

// The package is in CommonJS so I have to do it this way
import twilioPkg from "twilio";
const Twilio = twilioPkg.Twilio;

export const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
export const validateRequest = twilioPkg.validateRequest;

// TODO: Create a quiz game inside of the call. @see https://www.twilio.com/docs/voice/tutorials/how-to-gather-user-input-via-keypad/node

export async function createCall({
  phoneNumber,
  statusCallback,
}: {
  phoneNumber: string;
  statusCallback: string;
}) {
  const call = await client.calls.create({
    from: env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
    url: "http://demo.twilio.com/docs/voice.xml",
    statusCallback: statusCallback ?? env.TWILIO_CALL_STATUS_WEBHOOK_URL,
    statusCallbackMethod: "POST",
    statusCallbackEvent: [
      "ringing",
      "canceled",
      "completed",
      "busy",
      "no-answer",
      "failed",
    ],
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
  url.searchParams.set("attemptNumber", params.attemptNumber.toString());
  return url.toString();
}
