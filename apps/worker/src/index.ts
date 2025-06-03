import { Worker, Job } from "bullmq";
import { workerConnection } from "@fajr-ring/queue/connection";
import { CallJobData } from "@fajr-ring/queue/types";

const worker = new Worker<CallJobData>(
  "call-queue",
  async (job: Job<CallJobData>) => {
    // Your call logic here
    console.log("Calling user:", job.data.userId);
    // ...Twilio call, logging, etc.
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
