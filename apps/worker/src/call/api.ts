// I was between hono and fastify for the api but I'll go with hono for now
// TODO: Move api to a separate app

import { VoiceResponse } from "#call";
import { logCallToCallLog } from "#lib/utils";
import { twilioAuth } from "#lib/validation/middleware";
import {
  twilioStatusBodySchema,
  twilioStatusQuerySchema,
} from "#lib/validation/schema";
import { env } from "../env";
import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

const PORT = 8787;

app.use(logger());

app.get("/twilio/status", async (c) => {
  return c.text("OK");
});

app.post("/twilio/voice", async (c) => {
  const twiml = new VoiceResponse();
  twiml
    .gather({
      numDigits: 1,
      action: `${env.TWILIO_WEBHOOK_BASE_URL}/twilio/gather`,
      method: "POST",
    })
    .say("Please enter 1");

  twiml.redirect(c.req.url);

  c.header("Content-Type", "text/xml");
  return c.body(twiml.toString());
});

app.post("/twilio/gather", async (c) => {
  const body = await c.req.parseBody();
  const digits = body["Digits"];
  const twiml = new VoiceResponse();

  if (digits) {
    switch (digits) {
      case "1":
        twiml.say("You selected sales. Good for you!");
        break;
      case "2":
        twiml.say("You need support. We will help!");
        break;
      default:
        twiml.say("Sorry, I don't understand that choice.");
        twiml.pause();
        twiml.redirect(`${env.TWILIO_WEBHOOK_BASE_URL}/twilio/voice`);
        break;
    }
  } else {
    twiml.redirect(`${env.TWILIO_WEBHOOK_BASE_URL}/twilio/voice`);
  }

  c.header("Content-Type", "text/xml");
  return c.body(twiml.toString());
});

app.post(
  "/twilio/status",
  // 1. Security First: Ensure the request is from Twilio.
  // This middleware should run before any data validation.
  twilioAuth({
    authToken: () => env.TWILIO_AUTH_TOKEN,
    baseUrl: () => env.TWILIO_WEBHOOK_BASE_URL,
  }),
  zValidator("query", twilioStatusQuerySchema),
  zValidator("form", twilioStatusBodySchema),
  async (c) => {
    const query = c.req.valid("query");
    const body = c.req.valid("form");

    const logObject: Parameters<typeof logCallToCallLog>[0] = {
      job: {
        userId: query.userId,
        jobId: query.jobId,
        initiatedTimeUtc: query.initiatedTimeUtc,
        scheduledTimeUtc: query.scheduledTimeUtc,
        attemptsMade: query.attemptsMade,
      },
      twilio: body,
    };

    console.log(`[TWILIO EVENT]: ${body.CallStatus}`);

    switch (body.CallStatus) {
      case "busy":
      case "no-answer":
        await logCallToCallLog(logObject, "NO_ANSWER");
        break;
      case "failed":
        await logCallToCallLog(logObject, "FAILED");
        break;
      case "completed":
        await logCallToCallLog(logObject, "COMPLETED");
        break;
      case "in-progress":
        await logCallToCallLog(logObject, "ANSWERED");
        break;
      case "initiated":
        await logCallToCallLog(logObject, "INITIATED");
        break;
      default:
        await logCallToCallLog(logObject, "FAILED");
        break;
    }

    return c.text("OK");
  }
);

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.text("Internal Server Error", 500);
});

const server = serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`HONO server running on http://localhost:${PORT}`);
});

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
