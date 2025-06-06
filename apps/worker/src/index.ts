import { Worker, Job } from "bullmq";
import { workerConnection } from "@fajr-ring/queue/connection";
import { CallJobData } from "@fajr-ring/queue/types";
import { db } from "@fajr-ring/db";

// TODO: Read the docs one more time and tweak.
// TODO: Handle errors as you should

const worker = new Worker<CallJobData>(
  "call-queue",
  async (job: Job<CallJobData>) => {
    const { userId, phoneNumber } = job.data;

    const currentUser = await db.query.user.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId),
      with: { preferences: true },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Extra guard
    if (!currentUser.preferences.callsEnabled) {
      // TODO: Should we schedule the next call? Could something fail after user enabling calls again?
      throw new Error("User is not active for calls");
    }

    // TODO: call logic
    console.log("Calling user:", job.data.userId);

    // TODO: log the data to callLogs

    // TODO: schedule the next call

    return { success: true };
  },
  { connection: workerConnection, concurrency: 10 }
);

worker.on("completed", (job, returnvalue) => {
  console.log(`Job ${job.id} completed with:`, returnvalue);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});
