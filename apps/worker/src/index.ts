import { Worker, Job } from "bullmq";
import { workerConnection } from "@fajr-ring/queue/connection";
import { CallJobData, CallJobReturn } from "@fajr-ring/queue/types";
import { db } from "@fajr-ring/db";
import { buildTwilioStatusCallbackUrl, createCall } from "#call";
import { callLog, callStatusEnum } from "@fajr-ring/db/schema";
import { env } from "./env";
import { getJobTimestamps, logJobToCallLog } from "#lib/utils";

// TODO: Read the docs one more time and tweak.
// TODO: Handle errors as you should

const worker = new Worker<CallJobData, CallJobReturn>(
  "call-queue",
  async (job: Job<CallJobData>) => {
    const { userId } = job.data;

    const currentUser = await db.query.user.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId),
      with: { preferences: true },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const { phoneNumber } = currentUser;

    if (!phoneNumber) {
      throw new Error("User has no phone number");
    }

    // Extra guard
    if (!currentUser.preferences.callsEnabled) {
      // TODO: Should we schedule the next call? Could something fail after user enabling calls again?
      throw new Error("User is not active for calls");
    }

    const { initiatedTimeUtc, scheduledTimeUtc } = getJobTimestamps(job);

    const statusCallbackUrl = buildTwilioStatusCallbackUrl(
      `${env.TWILIO_WEBHOOK_BASE_URL}/twilio/status`,
      {
        userId: job.data.userId,
        jobId: job.id ?? "unknown", // It should always exist unless created manually
        initiatedTimeUtc: initiatedTimeUtc.toISOString(),
        scheduledTimeUtc: scheduledTimeUtc.toISOString(),
        attemptsMade: job.attemptsMade,
      }
    );

    const call = await createCall({ phoneNumber, statusCallbackUrl });

    return { callSid: call.sid };
  },
  { connection: workerConnection, concurrency: 10 }
);

worker.on("completed", (job, returnvalue) => {
  console.log(`[WORKER JOB]: COMPLETED`);

  // TODO: schedule the next call?
});

// This event is triggered when a job has thrown an exception.
// Note: job parameter could be received as undefined when an stalled job reaches the stalled limit and it is deleted by the removeOnFail option.
worker.on("failed", async (job, err, prev) => {
  // TODO: schedule the next call?
  console.error(`[WORKER JOB]: FAILED`, err.message);

  // TODO: job could be undefined?!
  if (job) {
    await logJobToCallLog(job, undefined, "FAILED");
  }
});

// Worker error
worker.on("error", async (err) => {
  // TODO: How to log data?
  // TODO: schedule the next call?
});
