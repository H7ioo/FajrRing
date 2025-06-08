import { Worker, Job } from "bullmq";
import { workerConnection } from "@fajr-ring/queue/connection";
import { CallJobData, CallJobReturn } from "@fajr-ring/queue/types";
import { db } from "@fajr-ring/db";
import { buildTwilioStatusCallbackUrl, createCall } from "#call";
import { callLog, callStatusEnum } from "@fajr-ring/db/schema";
import { env } from "./env";

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

    const scheduledTimeMs = job.timestamp + (job.opts.delay ?? 0);
    const scheduledTimeUtc = new Date(scheduledTimeMs);
    const initiatedTimeUtc = new Date(job.timestamp);

    const statusCallback = buildTwilioStatusCallbackUrl(
      `${env.TWILIO_CALL_STATUS_WEBHOOK_URL}twilio/status`,
      {
        userId: job.data.userId,
        jobId: job.id ?? "unknown", // It should always exist unless created manually
        initiatedTimeUtc: initiatedTimeUtc.toISOString(),
        scheduledTimeUtc: initiatedTimeUtc.toISOString(),
        attemptNumber: job.attemptsMade,
      }
    );

    await createCall({ phoneNumber, statusCallback });

    // TODO: Implement webhook for those
    return { callSid: "", callDuration: "" };
  },
  { connection: workerConnection, concurrency: 10 }
);

async function logJobToCallLogs(
  job: Job<CallJobData>,
  returnvalue: CallJobReturn,
  status: (typeof callStatusEnum)["enumValues"][number]
) {
  const scheduledTimeMs = job.timestamp + (job.opts.delay ?? 0);
  const scheduledTimeUtc = new Date(scheduledTimeMs);
  const initiatedTimeUtc = new Date(job.timestamp);

  await db.insert(callLog).values({
    userId: job.data.userId,
    jobId: job.id ?? "unknown", // It should always exist unless created manually
    status,
    initiatedTimeUtc,
    scheduledTimeUtc,
    twilioCallSid: returnvalue.callSid,
    durationSeconds: 0, // TODO: This is from the call
    attemptNumber: job.attemptsMade,
    errorMessage: job.failedReason,
  });
}

worker.on("completed", (job, returnvalue) => {
  // TODO: log the data to callLogs

  console.log({ job, returnvalue });

  // TODO: schedule the next call
  console.log(`Job ${job.id} completed with:`, returnvalue);
});

// worker.on("active", (job, prev) => {
// });

// // This event is triggered when a job has stalled and has been moved back to the wait list.
// worker.on("stalled", (job, prev) => {
// });

// This event is triggered when a job has thrown an exception.
// Note: job parameter could be received as undefined when an stalled job reaches the stalled limit and it is deleted by the removeOnFail option.
worker.on("failed", (job, err, prev) => {
  const maxAttempts = job?.opts.attempts ?? 3;
  const currentAttempt = job?.attemptsMade ?? 1;
  console.log("from FAILED", job, prev);
  // TODO: log the data to callLogs

  // TODO: schedule the next call
  console.error(`Job ${job?.id} failed:`, err);
});

// Worker error
worker.on("error", (err) => {
  console.log("from ERROR", err);
  // TODO: log the data to callLogs

  // TODO: schedule the next call
  console.error("Worker error:", err);
});
