import { db } from "@fajr-ring/db";
import { callLog, callStatusEnum } from "@fajr-ring/db/schema";
import { CallJobData, CallJobReturn } from "@fajr-ring/queue/types";
import { Job } from "bullmq";
import { TwilioStatusBody, TwilioStatusQuery } from "./validation/schema";

export function getJobTimestamps(job: Job<CallJobData>) {
  const scheduledTimeMs = job.timestamp + (job.opts.delay ?? 0);
  return {
    timestamp: job.timestamp,
    initiatedTimeUtc: new Date(job.timestamp),
    scheduledTimeUtc: new Date(scheduledTimeMs),
  };
}

// This is for the worker which will be used on worker pending, failure and retry. Other statuses are used by the calling service
type CallStatus = (typeof callStatusEnum)["enumValues"][number];
type WorkerStatus = Extract<
  CallStatus,
  "PENDING" | "RETRY_SCHEDULED" | "FAILED"
>;
type CallingServiceStatus = Exclude<CallStatus, WorkerStatus> | "FAILED";
export async function logJobToCallLog(
  job: Job<CallJobData>,
  returnvalue: CallJobReturn | undefined,
  status: WorkerStatus
) {
  const { initiatedTimeUtc, scheduledTimeUtc } = getJobTimestamps(job);

  await db.insert(callLog).values({
    userId: job.data.userId,
    jobId: job.id ?? "unknown", // It should always exist unless created manually
    status,
    initiatedTimeUtc,
    scheduledTimeUtc,
    callSid: returnvalue?.callSid,
    callDuration: undefined,
    attemptNumber: job.attemptsMade + 1,
    errorMessage: job.failedReason,
  });
}

export async function logCallToCallLog(
  data: {
    job: TwilioStatusQuery;
    twilio: TwilioStatusBody;
  },
  status: CallingServiceStatus
) {
  const { job, twilio } = data;
  const initiatedTimeUtc = new Date(job.initiatedTimeUtc);
  const scheduledTimeUtc = new Date(job.scheduledTimeUtc);

  const _callDuration = twilio.CallDuration
    ? parseInt(twilio.CallDuration)
    : undefined;
  // Extra check to make sure parseInt won't fail
  const callDuration = Number.isNaN(_callDuration) ? undefined : _callDuration;

  await db.insert(callLog).values({
    userId: job.userId,
    jobId: job.jobId ?? "unknown", // It should always exist unless created manually
    status,
    initiatedTimeUtc,
    scheduledTimeUtc,
    callSid: twilio.CallSid,
    callDuration,
    attemptNumber: job.attemptsMade + 1,
    errorMessage: "Calling service error",
  });
}
